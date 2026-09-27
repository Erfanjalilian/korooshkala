import { randomInt, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createSession, getSessionUserId, SESSION_LIFETIME_SECONDS } from "@/lib/session";
import { readOrders, readUsers, writeJson, type ShippingProfile } from "@/lib/store";

export const runtime = "nodejs";

type PendingCode = { code: string; expiresAt: number };
const pendingCodes = new Map<string, PendingCode>();
const normalizeDigits = (value: string) => value
  .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
  .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
const normalizePhone = (value: string) => normalizeDigits(value).replace(/\D/g, "");

async function sendSms(phone: string, code: string) {
  const apiKey = process.env.SMS_IR_API_KEY;
  const templateId = process.env.SMS_IR_TEMPLATE_ID || "323089";
  const parameterName = process.env.SMS_IR_TEMPLATE_PARAMETER || "Code";
  if (!apiKey) throw new Error("کلید سرویس پیامک در تنظیمات سرور ثبت نشده است.");

  const response = await fetch("https://api.sms.ir/v1/send/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "X-API-KEY": apiKey },
    body: JSON.stringify({ mobile: phone, templateId: Number(templateId), parameters: [{ name: parameterName, value: code }] }),
  });
  if (!response.ok) throw new Error("ارسال پیامک با خطا روبه‌رو شد.");
}

async function handlePost(request: Request) {
  const body = await request.json() as { action?: string; phone?: string; code?: string };
  const phone = normalizePhone(body.phone || "");
  if (!/^09\d{9}$/.test(phone)) return NextResponse.json({ error: "شماره موبایل معتبر وارد کنید." }, { status: 400 });

  if (body.action === "request") {
    const code = String(randomInt(100000, 1000000));
    await sendSms(phone, code);
    pendingCodes.set(phone, { code, expiresAt: Date.now() + 2 * 60 * 1000 });
    return NextResponse.json({ ok: true });
  }

  if (body.action !== "verify" || !/^\d{6}$/.test(body.code || "")) {
    return NextResponse.json({ error: "کد تأیید ۶ رقمی وارد کنید." }, { status: 400 });
  }
  const pending = pendingCodes.get(phone);
  if (!pending || pending.expiresAt < Date.now() || pending.code !== body.code) {
    return NextResponse.json({ error: "کد تأیید صحیح نیست یا منقضی شده است." }, { status: 400 });
  }
  pendingCodes.delete(phone);

  const users = await readUsers();
  let user = users.find((item) => item.phone === phone);
  if (!user) {
    user = { id: `usr-${randomUUID().slice(0, 8)}`, phone, email: "", name: "کاربر جدید", role: "customer", createdAt: new Date().toISOString() };
    await writeJson("users.json", [...users, user]);
  }
  const sessionId = createSession(user.id);
  const response = NextResponse.json({ ok: true, user: { id: user.id, phone: user.phone, name: user.name } });
  response.cookies.set("jk_session", sessionId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: SESSION_LIFETIME_SECONDS, path: "/" });
  return response;
}

export async function POST(request: Request) {
  try {
    return await handlePost(request);
  } catch (error) {
    console.error("Authentication request failed:", error);
    return NextResponse.json(
      { error: "در پردازش ورود خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getSessionUserId(request.headers.get("cookie"));
  if (!userId) return NextResponse.json({ error: "برای ویرایش اطلاعات وارد حساب کاربری شوید." }, { status: 401 });

  const body = await request.json() as { shippingProfile?: Partial<ShippingProfile> };
  const submitted = body.shippingProfile ?? {};
  const shippingProfile: ShippingProfile = {
    firstName: String(submitted.firstName ?? "").trim(),
    lastName: String(submitted.lastName ?? "").trim(),
    phone: normalizePhone(String(submitted.phone ?? "")),
    postalCode: normalizeDigits(String(submitted.postalCode ?? "")).replace(/\D/g, ""),
    address: String(submitted.address ?? "").trim(),
    province: String(submitted.province ?? "").trim(),
    city: String(submitted.city ?? "").trim(),
  };

  if (Object.values(shippingProfile).some((value) => !value)) {
    return NextResponse.json({ error: "لطفاً تمام اطلاعات ارسال را کامل کنید." }, { status: 400 });
  }
  if (!/^09\d{9}$/.test(shippingProfile.phone)) {
    return NextResponse.json({ error: "شماره تماس گیرنده معتبر نیست." }, { status: 400 });
  }
  if (!/^\d{10}$/.test(shippingProfile.postalCode)) {
    return NextResponse.json({ error: "کد پستی باید ۱۰ رقم باشد." }, { status: 400 });
  }

  const users = await readUsers();
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex < 0) return NextResponse.json({ error: "کاربر پیدا نشد." }, { status: 404 });

  users[userIndex] = {
    ...users[userIndex],
    name: `${shippingProfile.firstName} ${shippingProfile.lastName}`,
    shippingProfile,
  };
  await writeJson("users.json", users);
  return NextResponse.json({ ok: true, shippingProfile });
}

export async function GET(request: Request) {
  const userId = getSessionUserId(request.headers.get("cookie"));
  if (!userId) return NextResponse.json({ error: "وارد حساب کاربری نشده‌اید." }, { status: 401 });
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return NextResponse.json({ error: "کاربر پیدا نشد." }, { status: 404 });
  const orders = (await readOrders()).filter((order) => order.userId === user.id);
  return NextResponse.json({ user, orders });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("jk_session");
  return response;
}
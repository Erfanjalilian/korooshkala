import { randomInt, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { readOrders, readUsers, writeJson } from "@/lib/store";

export const runtime = "nodejs";

type PendingCode = { code: string; expiresAt: number };
const pendingCodes = new Map<string, PendingCode>();
const sessions = new Map<string, string>();
const normalizePhone = (value: string) => value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/\D/g, "");

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

export async function POST(request: Request) {
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
  const sessionId = randomUUID();
  sessions.set(sessionId, user.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("jk_session", sessionId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return response;
}

export async function GET(request: Request) {
  const sessionId = request.headers.get("cookie")?.match(/(?:^|;\s*)jk_session=([^;]+)/)?.[1];
  const userId = sessionId ? sessions.get(sessionId) : undefined;
  if (!userId) return NextResponse.json({ error: "وارد حساب کاربری نشده‌اید." }, { status: 401 });
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return NextResponse.json({ error: "کاربر پیدا نشد." }, { status: 404 });
  const orders = (await readOrders()).filter((order) => order.userId === user.id);
  return NextResponse.json({ user, orders });
}

export async function DELETE(request: Request) {
  const sessionId = request.headers.get("cookie")?.match(/(?:^|;\s*)jk_session=([^;]+)/)?.[1];
  if (sessionId) sessions.delete(sessionId);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("jk_session");
  return response;
}
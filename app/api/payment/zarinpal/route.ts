import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { readOrders, writeJson } from "@/lib/store";

export const runtime = "nodejs";

const merchantId = process.env.ZARINPAL_MERCHANT_ID;
const isSandbox = process.env.ZARINPAL_SANDBOX === "true";
const zarinpalBase = isSandbox ? "https://sandbox.zarinpal.com/pg/v4/payment" : "https://api.zarinpal.com/pg/v4/payment";
const zarinpalPayBase = isSandbox ? "https://sandbox.zarinpal.com/pg/StartPay/" : "https://www.zarinpal.com/pg/StartPay/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "شناسه سفارش لازم است." }, { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie");
  const userId = getSessionUserId(cookieHeader);
  if (!userId) {
    return NextResponse.json({ error: "برای پرداخت باید وارد حساب کاربری شوید." }, { status: 401 });
  }
  if (!merchantId) {
    return NextResponse.json({ error: "تنظیمات درگاه پرداخت روی سرور کامل نیست." }, { status: 500 });
  }

  const orders = await readOrders();
  const order = orders.find((item) => item.id === orderId && item.userId === userId);
  if (!order) {
    return NextResponse.json({ error: "سفارش پیدا نشد." }, { status: 404 });
  }

  const callbackUrl = new URL("/api/payment/zarinpal/callback", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString();

  try {
    const zarinpalResponse = await fetch(`${zarinpalBase}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: Number(order.total),
        callback_url: callbackUrl,
        description: `سفارش ${order.id}`,
        metadata: { order_id: order.id, user_id: userId },
      }),
    });

    const zarinpalResult = await zarinpalResponse.json() as { data?: { code?: number; authority?: string; message?: string }; errors?: { code?: number; message?: string } };
    if (!zarinpalResponse.ok || zarinpalResult.data?.code !== 100 || !zarinpalResult.data?.authority) {
      const message = zarinpalResult.data?.message || zarinpalResult.errors?.message || "درخواست پرداخت با خطا مواجه شد.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const authority = zarinpalResult.data.authority;

    const updatedOrders = orders.map((item) => item.id === order.id
      ? { ...item, payment: { ...(item.payment ?? {}), gateway: "zarinpal", status: "pending_payment", authority } }
      : item);
    await writeJson("orders.json", updatedOrders);

    const paymentUrl = `${zarinpalPayBase}${authority}`;
    return NextResponse.redirect(paymentUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "درگاه پرداخت در حال حاضر در دسترس نیست.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

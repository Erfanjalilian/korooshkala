import { NextResponse } from "next/server";
import { readOrders, writeJson } from "@/lib/store";
import { tomanToRial } from "@/lib/currency";

export const runtime = "nodejs";

const merchantId = process.env.ZARINPAL_MERCHANT_ID;
const isSandbox = process.env.ZARINPAL_SANDBOX === "true";
const zarinpalBase = isSandbox ? "https://sandbox.zarinpal.com/pg/v4/payment" : "https://api.zarinpal.com/pg/v4/payment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  const redirectTarget = new URL("/account", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  if (!authority) {
    redirectTarget.searchParams.set("payment", "failed");
    return NextResponse.redirect(redirectTarget);
  }
  if (!merchantId) {
    redirectTarget.searchParams.set("payment", "failed");
    return NextResponse.redirect(redirectTarget);
  }

  const orders = await readOrders();
  const order = orders.find((item) => item.payment?.authority === authority);
  if (!order) {
    redirectTarget.searchParams.set("payment", "failed");
    return NextResponse.redirect(redirectTarget);
  }

  if (status !== "OK") {
    const updatedOrders = orders.map((item) => item.id === order.id ? { ...item, status: "cancelled", payment: { ...(item.payment ?? {}), status: "cancelled" } } : item);
    await writeJson("orders.json", updatedOrders);
    redirectTarget.searchParams.set("payment", "failed");
    return NextResponse.redirect(redirectTarget);
  }

  try {
    const verifyResponse = await fetch(`${zarinpalBase}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ merchant_id: merchantId, amount: tomanToRial(Number(order.total)), authority }),
    });

    const json = await verifyResponse.json() as { data?: { code?: number; ref_id?: number }; errors?: { message?: string } };
    const isVerified = verifyResponse.ok && json.data?.code === 100;

    const updatedOrders = orders.map((item) => {
      if (item.id !== order.id) return item;
      return {
        ...item,
        status: isVerified ? "paid" : "pending_payment",
        payment: {
          ...(item.payment ?? {}),
          status: isVerified ? "paid" : "pending_payment",
          referenceId: json.data?.ref_id ? String(json.data.ref_id) : item.payment?.referenceId,
        },
      };
    });
    await writeJson("orders.json", updatedOrders);

    redirectTarget.searchParams.set("payment", isVerified ? "success" : "failed");
    return NextResponse.redirect(redirectTarget);
  } catch {
    redirectTarget.searchParams.set("payment", "failed");
    return NextResponse.redirect(redirectTarget);
  }
}

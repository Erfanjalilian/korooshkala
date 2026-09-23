import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { readOrders, readProducts, writeJson } from "@/lib/store";

export const runtime = "nodejs";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingInfo = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  postalCode?: string;
  address?: string;
  province?: string;
  city?: string;
};

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const sessionUserId = getSessionUserId(cookieHeader);
  if (!sessionUserId) {
    return NextResponse.json({ error: "برای ثبت سفارش باید وارد حساب کاربری شوید." }, { status: 401 });
  }

  const body = await request.json() as { items?: CartItem[]; shipping?: ShippingInfo };
  const items = Array.isArray(body.items) ? body.items : [];
  const shipping = body.shipping ?? {};

  if (!items.length) {
    return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });
  }

  const products = await readProducts();
  const requestedQuantities = new Map<string, number>();
  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    requestedQuantities.set(item.productId, (requestedQuantities.get(item.productId) ?? 0) + quantity);
  }

  const orderItems = [];
  for (const [productId, quantity] of requestedQuantities) {
    const product = products.find((current) => current.id === productId);
    if (!product || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ error: "یکی از محصولات سفارش معتبر نیست." }, { status: 400 });
    }
    if (quantity > product.stock) {
      return NextResponse.json({ error: `موجودی محصول «${product.name}» کافی نیست.` }, { status: 400 });
    }
    orderItems.push({ productId: product.id, name: product.name, price: product.price, quantity });
  }

  const firstName = (shipping.firstName ?? "").trim();
  const lastName = (shipping.lastName ?? "").trim();
  const fullName = (shipping.fullName ?? [firstName, lastName].filter(Boolean).join(" ")).trim();
  const postalCode = (shipping.postalCode ?? "").trim();
  const address = (shipping.address ?? "").trim();
  const province = (shipping.province ?? "").trim();
  const city = (shipping.city ?? "").trim();

  if (!fullName || !postalCode || !address || !province || !city) {
    return NextResponse.json({ error: "اطلاعات ارسال ناقص است." }, { status: 400 });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `ord-${randomUUID().slice(0, 8)}`;

  const order = {
    id: orderId,
    userId: sessionUserId,
    status: "pending_payment",
    items: orderItems,
    total,
    currency: "IRT",
    createdAt: new Date().toISOString(),
    shipping: { fullName, postalCode, address, province, city },
    payment: { gateway: "zarinpal", status: "pending_payment" },
  };

  const orders = await readOrders();
  await writeJson("orders.json", [...orders, order]);

  const callbackUrl = new URL("/api/payment/zarinpal/callback", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString();
  return NextResponse.json({
    ok: true,
    orderId,
    total,
    paymentUrl: `/api/payment/zarinpal?orderId=${encodeURIComponent(orderId)}&callback=${encodeURIComponent(callbackUrl)}`,
  });
}

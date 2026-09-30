import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { calculateOtherProductsShippingFee, calculateSilentBoxPackagingFee, readOrders, readProducts, readStoreSettings, readUsers, writeJson, type ShippingProfile } from "@/lib/store";

export const runtime = "nodejs";

const normalizeDigits = (value: string) => value
  .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
  .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

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
  phone?: string;
  postalCode?: string;
  address?: string;
  province?: string;
  city?: string;
  shippingMethod?: string;
};

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const sessionUserId = await getSessionUserId(cookieHeader);
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
  const settings = await readStoreSettings();
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
  const normalizedPostalCode = normalizeDigits(postalCode).replace(/\D/g, "");
  const address = (shipping.address ?? "").trim();
  const province = (shipping.province ?? "").trim();
  const city = (shipping.city ?? "").trim();
  const shippingMethod = (shipping.shippingMethod ?? "").trim();

  if (!fullName || !postalCode || !address || !province || !city) {
    return NextResponse.json({ error: "اطلاعات ارسال ناقص است." }, { status: 400 });
  }
  if (shippingMethod !== "tipax" && shippingMethod !== "bus") {
    return NextResponse.json({ error: "روش ارسال معتبر انتخاب کنید." }, { status: 400 });
  }
  if (shippingMethod === "bus" && province === "تهران") {
    return NextResponse.json({ error: "ارسال فوری با اتوبوس فقط برای مقصدهای خارج از تهران امکان‌پذیر است." }, { status: 400 });
  }

  const users = await readUsers();
  const userIndex = users.findIndex((user) => user.id === sessionUserId);
  if (userIndex < 0) return NextResponse.json({ error: "کاربر پیدا نشد." }, { status: 404 });
  const contactPhone = normalizeDigits((shipping.phone ?? users[userIndex].shippingProfile?.phone ?? users[userIndex].phone ?? "").trim()).replace(/\D/g, "");
  if (!/^09\d{9}$/.test(contactPhone)) {
    return NextResponse.json({ error: "شماره تماس گیرنده معتبر نیست." }, { status: 400 });
  }
  if (!/^\d{10}$/.test(normalizedPostalCode)) {
    return NextResponse.json({ error: "کد پستی باید ۱۰ رقم باشد." }, { status: 400 });
  }

  const shippingProfile: ShippingProfile = {
    firstName,
    lastName,
    phone: contactPhone,
    postalCode: normalizedPostalCode,
    address,
    province,
    city,
  };
  users[userIndex] = { ...users[userIndex], name: fullName, shippingProfile };
  await writeJson("users.json", users);

  const packagingFee = calculateSilentBoxPackagingFee(orderItems, products, settings.silentBoxPackagingFee);
  const otherProductsShippingFee = calculateOtherProductsShippingFee(orderItems, products, settings.otherProductsShippingFee);
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + packagingFee + otherProductsShippingFee;
  const orderId = `ord-${randomUUID().slice(0, 8)}`;

  const order = {
    id: orderId,
    userId: sessionUserId,
    status: "pending_payment",
    items: orderItems,
    packagingFee,
    otherProductsShippingFee,
    total,
    currency: "IRT",
    createdAt: new Date().toISOString(),
    shipping: { fullName, phone: contactPhone, postalCode: normalizedPostalCode, address, province, city, shippingMethod },
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

import { NextResponse } from "next/server";
import { calculateSilentBoxPackagingFee, readProducts, readStoreSettings } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json() as { items?: Array<{ productId?: unknown; quantity?: unknown }> };
  const items = Array.isArray(body.items) ? body.items : [];
  const products = await readProducts();
  const settings = await readStoreSettings();
  const quantities = new Map<string, number>();

  for (const item of items) {
    const productId = typeof item.productId === "string" ? item.productId : "";
    const quantity = Number(item.quantity);
    if (!productId || !Number.isSafeInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: "اقلام سبد خرید معتبر نیستند." }, { status: 400 });
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }

  const normalizedItems = [...quantities].map(([productId, quantity]) => ({ productId, quantity }));
  const packagingQuantity = normalizedItems.reduce((total, item) => {
    const product = products.find((current) => current.id === item.productId);
    return total + (product?.categorySlug === "سایلنت-باکس" ? item.quantity : 0);
  }, 0);

  return NextResponse.json({
    packagingQuantity,
    packagingFee: calculateSilentBoxPackagingFee(normalizedItems, products, settings.silentBoxPackagingFee),
    unitFee: settings.silentBoxPackagingFee,
  });
}
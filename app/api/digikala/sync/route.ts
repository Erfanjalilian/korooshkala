import { NextResponse } from "next/server";
import { readProducts } from "@/lib/store";
import { buildDigikalaQueue, normalizeDigikalaSyncStatus } from "@/lib/digikala/core";
import { readDigikalaProductMappings, writeDigikalaProductMappings } from "@/lib/digikala/storage";

export const runtime = "nodejs";

export async function GET() {
  const [products, mappings] = await Promise.all([
    readProducts(),
    readDigikalaProductMappings(),
  ]);

  const pending = mappings.filter((item) => normalizeDigikalaSyncStatus(item.syncStatus) !== "SYNCED").length;
  const failed = mappings.filter((item) => normalizeDigikalaSyncStatus(item.syncStatus) === "FAILED").length;

  return NextResponse.json({
    productsTotal: products.length,
    mappingsTotal: mappings.length,
    pending,
    failed,
    synced: mappings.filter((item) => normalizeDigikalaSyncStatus(item.syncStatus) === "SYNCED").length,
    queue: buildDigikalaQueue(products.map((product) => product.id), 25),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    action?: "product" | "all";
    localProductId?: string;
    batchSize?: number;
  };

  const batchSize = Math.max(1, Number(payload.batchSize) || 25);
  const products = await readProducts();

  const candidateProducts = payload.action === "product" && payload.localProductId
    ? products.filter((product) => product.id === payload.localProductId)
    : products;

  if (candidateProducts.length === 0) {
    return NextResponse.json({ error: "No products available for sync." }, { status: 404 });
  }

  const queue = buildDigikalaQueue(candidateProducts, batchSize);
  const mappings = await readDigikalaProductMappings();

  const nextMappings = [...mappings];
  for (const batch of queue) {
    for (const product of batch) {
      const existing = nextMappings.find((item) => item.localProductId === product.id);
      if (!existing) {
        nextMappings.push({
          id: `dig-product-${Date.now()}-${product.id}`,
          localProductId: product.id,
          digikalaProductId: "",
          localVariantId: undefined,
          digikalaVariantId: undefined,
          digikalaCategoryId: undefined,
          syncStatus: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  await writeDigikalaProductMappings(nextMappings);

  return NextResponse.json({
    queueLength: queue.length,
    queuedItems: candidateProducts.length,
    batchSize,
    status: "QUEUED",
  });
}

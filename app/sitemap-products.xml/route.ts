import { readProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

const siteOrigin = "https://korooshkala.ir";

function isUsableRouteKey(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    return decodeURIComponent(value) === value;
  } catch {
    return false;
  }
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const products = await readProducts();
  const slugCounts = new Map<string, number>();

  for (const product of products) {
    if (isUsableRouteKey(product.slug)) {
      slugCounts.set(product.slug, (slugCounts.get(product.slug) ?? 0) + 1);
    }
  }

  const urls = new Set<string>();

  for (const product of products) {
    const slug = product.slug;
    const uniqueSlug =
      isUsableRouteKey(slug) && slugCounts.get(slug) === 1 ? slug : undefined;
    const candidates = [uniqueSlug, product.id];

    for (const candidate of candidates) {
      if (!isUsableRouteKey(candidate)) continue;

      const routeProduct = products.find(
        (item) => item.slug === candidate || item.id === candidate,
      );
      if (routeProduct?.id !== product.id) continue;

      urls.add(`${siteOrigin}/products/${encodeURIComponent(candidate)}`);
      break;
    }
  }

  const entries = Array.from(urls, (url) => `  <url><loc>${escapeXml(url)}</loc></url>`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

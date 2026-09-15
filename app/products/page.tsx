import ProductCatalog from "@/app/components/products/ProductCatalog";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const query = params.q ?? "";

  return (
    <ProductCatalog
      key={`${category}:${query}`}
      initialCategory={category}
      initialQuery={query}
    />
  );
}

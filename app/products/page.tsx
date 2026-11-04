import ProductCatalog from "@/app/components/products/ProductCatalog";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const subcategory = params.subcategory ?? "";
  const query = params.q ?? "";

  return (
    <ProductCatalog
      key={`${category}:${subcategory}:${query}`}
      initialCategory={category}
      initialSubcategory={subcategory}
      initialQuery={query}
    />
  );
}

import { readCategories, readProducts } from "@/lib/store";

const normalizeSearchValue = (value: unknown) =>
  String(value ?? "").trim().toLocaleLowerCase("fa-IR");

export async function GET(request: Request) {
  const [productRecords, categories] = await Promise.all([
    readProducts(),
    readCategories(),
  ]);
  const { searchParams } = new URL(request.url);
  const query = normalizeSearchValue(searchParams.get("q"));
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "featured";

  let filteredProducts = productRecords.filter((product) => {
    const matchesQuery = query.length === 0 || [
      product.name,
      product.description,
      product.category,
      product.brand,
    ].some((value) => normalizeSearchValue(value).includes(query));
    const matchesCategory = category === "all" || product.categorySlug === category;

    return matchesQuery && matchesCategory;
  });

  filteredProducts = [...filteredProducts].sort((first, second) => {
    if (sort === "price-asc") return first.price - second.price;
    if (sort === "price-desc") return second.price - first.price;
    if (sort === "rating") return second.rating - first.rating;
    if (sort === "newest") return Number(second.isNew) - Number(first.isNew);
    return Number(second.featured) - Number(first.featured);
  });

  return Response.json({
    products: filteredProducts,
    total: filteredProducts.length,
    categories,
  });
}

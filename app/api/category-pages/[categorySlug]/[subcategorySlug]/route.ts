import { readCategoryPage } from "@/lib/categoryPages";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categorySlug: string; subcategorySlug: string }> },
) {
  const { categorySlug, subcategorySlug } = await params;
  const page = await readCategoryPage(categorySlug, subcategorySlug);

  if (!page) {
    return Response.json({ error: "Category page not found" }, { status: 404 });
  }

  return Response.json({ page });
}

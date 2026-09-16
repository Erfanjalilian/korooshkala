import { readCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ categories: await readCategories() });
}

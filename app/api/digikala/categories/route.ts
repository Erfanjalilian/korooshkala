import { NextResponse } from "next/server";
import { readCategories } from "@/lib/store";
import {
  readDigikalaCategoryMappings,
  writeDigikalaCategoryMappings,
} from "@/lib/digikala/storage";

export const runtime = "nodejs";

export async function GET() {
  const [categories, mappings] = await Promise.all([
    readCategories(),
    readDigikalaCategoryMappings(),
  ]);

  return NextResponse.json({
    categories,
    mappings,
    totalMappings: mappings.length,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    localCategoryId?: string;
    localCategoryName?: string;
    digikalaCategoryId?: string;
    digikalaCategoryName?: string;
  };

  const localCategoryId = String(payload.localCategoryId ?? "").trim();
  const digikalaCategoryId = String(payload.digikalaCategoryId ?? "").trim();

  if (!localCategoryId || !digikalaCategoryId) {
    return NextResponse.json({ error: "localCategoryId و digikalaCategoryId الزامی هستند." }, { status: 400 });
  }

  const mappings = await readDigikalaCategoryMappings();
  const now = new Date().toISOString();
  const existingIndex = mappings.findIndex((item) => item.localCategoryId === localCategoryId);

  const nextMapping = {
    id: existingIndex >= 0 ? mappings[existingIndex].id : `dig-cat-${Date.now()}`,
    localCategoryId,
    localCategoryName: payload.localCategoryName || localCategoryId,
    digikalaCategoryId,
    digikalaCategoryName: payload.digikalaCategoryName,
    createdAt: existingIndex >= 0 ? mappings[existingIndex].createdAt : now,
    updatedAt: now,
  };

  const nextMappings = existingIndex >= 0
    ? mappings.map((item) => item.localCategoryId === localCategoryId ? nextMapping : item)
    : [nextMapping, ...mappings];

  await writeDigikalaCategoryMappings(nextMappings);
  return NextResponse.json(nextMapping, { status: existingIndex >= 0 ? 200 : 201 });
}

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  defaultPages,
  readCategories,
  readOrders,
  readPages,
  readProducts,
  readUsers,
  writeJson,
  type Product,
} from "@/lib/store";

export const runtime = "nodejs";

const publicUploadsDirectory = path.join(process.cwd(), "public", "uploads");

const slugify = (value: string) =>
  value.trim().toLocaleLowerCase("fa-IR").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || randomUUID();

const numberValue = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const textValue = (value: FormDataEntryValue | null, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

async function saveImage(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string" || value.size === 0 || typeof value.arrayBuffer !== "function") return undefined;
  const originalName = value.name || "image";
  const extension = path.extname(originalName).replace(/[^a-zA-Z0-9.]/g, "").slice(0, 12) || ".bin";
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  await mkdir(publicUploadsDirectory, { recursive: true });
  await writeFile(path.join(publicUploadsDirectory, fileName), Buffer.from(await value.arrayBuffer()));
  return `/uploads/${fileName}`;
}

async function readProductForm(formData: FormData, current?: Product): Promise<Product> {
  const name = textValue(formData.get("name"), current?.name);
  const image = await saveImage(formData.get("image"));
  const category = textValue(formData.get("category"), current?.category);
  const categories = await readCategories();
  const categorySlug = textValue(
    formData.get("categorySlug"),
    categories.find((item) => item.name === category)?.slug ?? current?.categorySlug ?? slugify(category),
  );

  return {
    id: current?.id ?? `prd-${randomUUID().slice(0, 8)}`,
    sku: textValue(formData.get("sku"), current?.sku || `JK-${Date.now()}`),
    slug: textValue(formData.get("slug"), current?.slug || slugify(name)),
    name,
    description: textValue(formData.get("description"), current?.description),
    price: numberValue(formData.get("price"), current?.price),
    compareAtPrice: formData.get("isDiscounted") === "true"
      ? numberValue(formData.get("compareAtPrice"), current?.compareAtPrice)
      : numberValue(formData.get("price"), current?.price),
    currency: "IRR",
    category,
    categorySlug,
    brand: textValue(formData.get("brand"), current?.brand),
    stock: numberValue(formData.get("stock"), current?.stock),
    rating: current?.rating ?? 0,
    reviewCount: current?.reviewCount ?? 0,
    purchaseCount: current?.purchaseCount ?? 1001,
    tags: textValue(formData.get("tags"), current?.tags.join(", ")).split(",").map((tag) => tag.trim()).filter(Boolean),
    image: image ?? current?.image,
    featured: formData.has("featured")
      ? formData.get("featured") === "true"
      : current?.featured,
    isBestSelling: formData.get("isBestSelling") === "true",
    isNew: formData.get("isNew") === "true",
    isHot: formData.get("isHot") === "true",
    isDiscounted: formData.get("isDiscounted") === "true",
  };
}

export async function GET() {
  const [products, categories, users, orders, pages] = await Promise.all([
    readProducts(),
    readCategories(),
    readUsers(),
    readOrders(),
    readPages(),
  ]);
  return NextResponse.json({ products, categories, users, orders, pages });
}

export async function POST(request: Request) {
  const resource = new URL(request.url).searchParams.get("resource");

  if (resource === "products") {
    const products = await readProducts();
    const product = await readProductForm(await request.formData());
    await writeJson("products.json", [product, ...products]);
    return NextResponse.json(product, { status: 201 });
  }

  if (resource === "categories") {
    const categories = await readCategories();
    const formData = await request.formData();
    const name = textValue(formData.get("name"), "دسته جدید");
    const category = {
      slug: slugify(name),
      name,
      image: await saveImage(formData.get("image")),
    };
    await writeJson("categories.json", [...categories, category]);
    return NextResponse.json(category, { status: 201 });
  }

  return NextResponse.json({ error: "منبع نامعتبر است." }, { status: 400 });
}

export async function PATCH(request: Request) {
  const params = new URL(request.url).searchParams;
  const resource = params.get("resource");
  const id = params.get("id");

  if (resource === "products" && id) {
    const products = await readProducts();
    const current = products.find((product) => product.id === id);
    if (!current) return NextResponse.json({ error: "محصول پیدا نشد." }, { status: 404 });
    const updated = await readProductForm(await request.formData(), current);
    await writeJson("products.json", products.map((product) => product.id === id ? updated : product));
    return NextResponse.json(updated);
  }

  if (resource === "categories" && id) {
    const categories = await readCategories();
    const current = categories.find((category) => category.slug === id);
    if (!current) return NextResponse.json({ error: "دسته‌بندی پیدا نشد." }, { status: 404 });
    const formData = await request.formData();
    const name = textValue(formData.get("name"), current.name);
    const updated = {
      slug: current.slug,
      name,
      image: await saveImage(formData.get("image")) ?? current.image,
    };
    await writeJson("categories.json", categories.map((category) => category.slug === id ? updated : category));
    return NextResponse.json(updated);
  }

  const body = await request.json() as Record<string, unknown>;
  if (resource === "users" && id) {
    const users = await readUsers();
    const updatedUsers = users.map((user) => user.id === id ? { ...user, ...body } : user);
    await writeJson("users.json", updatedUsers);
    return NextResponse.json(updatedUsers.find((user) => user.id === id));
  }

  if (resource === "orders" && id) {
    const orders = await readOrders();
    const updatedOrders = orders.map((order) => order.id === id ? { ...order, ...body } : order);
    await writeJson("orders.json", updatedOrders);
    return NextResponse.json(updatedOrders.find((order) => order.id === id));
  }

  if (resource === "pages") {
    const pages = await readPages();
    const pageKey = String(body.page) as keyof typeof pages;
    const values = body.values && typeof body.values === "object" ? body.values : {};
    const nextPages = {
      ...pages,
      [pageKey]: { ...pages[pageKey], ...values },
    };
    await writeJson("pages.json", nextPages);
    return NextResponse.json(nextPages);
  }

  return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
}

export async function DELETE(request: Request) {
  const params = new URL(request.url).searchParams;
  const resource = params.get("resource");
  const id = params.get("id");
  if (!id) return NextResponse.json({ error: "شناسه الزامی است." }, { status: 400 });

  if (resource === "products") {
    const products = await readProducts();
    await writeJson("products.json", products.filter((product) => product.id !== id));
    return NextResponse.json({ ok: true });
  }

  if (resource === "categories") {
    const categories = await readCategories();
    await writeJson("categories.json", categories.filter((category) => category.slug !== id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "منبع نامعتبر است." }, { status: 400 });
}

export { defaultPages };

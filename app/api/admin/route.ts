import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  defaultPages,
  readFooter,
  readCategories,
  readOrders,
  readPages,
  readProducts,
  readStoreSettings,
  readUsers,
  writeJson,
  type FooterContent,
  type FooterLink,
  type Product,
} from "@/lib/store";
import { readCategoryPage, readCategoryPageRecords, saveCategoryPage } from "@/lib/categoryPages";
import { isAuthorizedAdminRequest, responseWithAdminUnauthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";

const publicUploadsDirectory = path.join(process.cwd(), "public", "uploads");

class InvalidImageError extends Error {}

const slugify = (value: string) =>
  value.trim().toLocaleLowerCase("fa-IR").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || randomUUID();

const numberValue = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ratingValue = (value: FormDataEntryValue | null, fallback = 0) =>
  Math.min(5, Math.max(0, numberValue(value, fallback)));

const purchaseCountValue = (value: FormDataEntryValue | null, fallback = 0) =>
  Math.max(0, Math.floor(numberValue(value, fallback)));

const textValue = (value: FormDataEntryValue | null, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

async function saveImage(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string" || value.size === 0 || typeof value.arrayBuffer !== "function") return undefined;
  const imageTypes: Record<string, { extension: string; signature: (bytes: Buffer) => boolean }> = {
    "image/jpeg": { extension: ".jpg", signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
    "image/png": { extension: ".png", signature: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
    "image/webp": { extension: ".webp", signature: (bytes) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" },
    "image/gif": { extension: ".gif", signature: (bytes) => ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6)) },
    "image/avif": { extension: ".avif", signature: (bytes) => bytes.toString("ascii", 4, 8) === "ftyp" },
  };
  const imageType = imageTypes[value.type];
  if (!imageType || value.size > 5 * 1024 * 1024) {
    throw new InvalidImageError("تصویر باید از نوع JPG، PNG، WEBP، GIF یا AVIF و حداکثر ۵ مگابایت باشد.");
  }
  const bytes = Buffer.from(await value.arrayBuffer());
  if (!imageType.signature(bytes)) {
    throw new InvalidImageError("محتوای فایل با نوع تصویر انتخاب‌شده مطابقت ندارد.");
  }
  const fileName = `${Date.now()}-${randomUUID()}${imageType.extension}`;
  await mkdir(publicUploadsDirectory, { recursive: true });
  await writeFile(path.join(publicUploadsDirectory, fileName), bytes);
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
  const subcategorySlug = textValue(formData.get("subcategorySlug"), current?.subcategorySlug);

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
    subcategorySlug: subcategorySlug || undefined,
    brand: textValue(formData.get("brand"), current?.brand),
    stock: numberValue(formData.get("stock"), current?.stock),
    rating: ratingValue(formData.get("rating"), current?.rating ?? 0),
    reviewCount: current?.reviewCount ?? 0,
    purchaseCount: purchaseCountValue(
      formData.get("purchaseCount"),
      current?.purchaseCount ?? 1001,
    ),
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

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return responseWithAdminUnauthorized();
  }

  const [products, categories, users, orders, pages, settings, footer, categoryPages] = await Promise.all([
    readProducts(),
    readCategories(),
    readUsers(),
    readOrders(),
    readPages(),
    readStoreSettings(),
    readFooter(),
    readCategoryPageRecords(),
  ]);
  const newestOrdersFirst = [...orders].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );
  return NextResponse.json({ products, categories, users, orders: newestOrdersFirst, pages, settings, footer, categoryPages });
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return responseWithAdminUnauthorized();
  }

  const resource = new URL(request.url).searchParams.get("resource");

  if (resource === "products") {
    const products = await readProducts();
    let product: Product;
    try {
      product = await readProductForm(await request.formData());
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    await writeJson("products.json", [product, ...products]);
    return NextResponse.json(product, { status: 201 });
  }

  if (resource === "categories") {
    const categories = await readCategories();
    const formData = await request.formData();
    const name = textValue(formData.get("name"), "دسته جدید");
    let image: string | undefined;
    try {
      image = await saveImage(formData.get("image"));
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    const category = { slug: slugify(name), name, image };
    await writeJson("categories.json", [...categories, category]);
    return NextResponse.json(category, { status: 201 });
  }

  return NextResponse.json({ error: "منبع نامعتبر است." }, { status: 400 });
}

export async function PATCH(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return responseWithAdminUnauthorized();
  }

  const params = new URL(request.url).searchParams;
  const resource = params.get("resource");
  const id = params.get("id");

  if (resource === "products" && id) {
    const products = await readProducts();
    const current = products.find((product) => product.id === id);
    if (!current) return NextResponse.json({ error: "محصول پیدا نشد." }, { status: 404 });
    let updated: Product;
    try {
      updated = await readProductForm(await request.formData(), current);
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    await writeJson("products.json", products.map((product) => product.id === id ? updated : product));
    return NextResponse.json(updated);
  }

  if (resource === "categories" && id) {
    const categories = await readCategories();
    const current = categories.find((category) => category.slug === id);
    if (!current) return NextResponse.json({ error: "دسته‌بندی پیدا نشد." }, { status: 404 });
    const formData = await request.formData();
    const name = textValue(formData.get("name"), current.name);
    let image: string | undefined;
    try {
      image = await saveImage(formData.get("image"));
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    const updated = { ...current, name, image: image ?? current.image };
    await writeJson("categories.json", categories.map((category) => category.slug === id ? updated : category));
    return NextResponse.json(updated);
  }

  if (resource === "pages" && request.headers.get("content-type")?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const pageKey = textValue(formData.get("page"));
    if (pageKey !== "about" && pageKey !== "contact") {
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    }
    const pages = await readPages();
    const currentPage = pages[pageKey];
    const imageValue = formData.get("image");
    let image: string | undefined;
    try {
      image = await saveImage(imageValue);
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    const values: Record<string, string> = {};
    for (const key of pageKey === "about"
      ? ["title", "description"]
      : ["title", "description", "email", "phone", "address", "hours"]) {
      const value = formData.get(key);
      if (typeof value === "string") values[key] = value.trim();
    }
    const nextPages = {
      ...pages,
      [pageKey]: { ...currentPage, ...values, ...(image ? { image } : {}) },
    };
    await writeJson("pages.json", nextPages);
    return NextResponse.json(nextPages);
  }

  if (resource === "category-pages") {
    const formData = await request.formData();
    const categorySlug = textValue(formData.get("categorySlug"));
    const subcategorySlug = textValue(formData.get("subcategorySlug"));
    const title = textValue(formData.get("title"));
    const description = textValue(formData.get("description"));
    const phone = textValue(formData.get("phone"));
    const imageEntry = formData.get("image");

    if (!categorySlug || !subcategorySlug || !title || !description || !phone) {
      return NextResponse.json({ error: "همه فیلدهای عنوان، توضیحات و شماره تماس الزامی هستند." }, { status: 400 });
    }
    const currentPage = (await readCategoryPageRecords()).find(
      (page) => page.categorySlug === categorySlug && page.subcategorySlug === subcategorySlug,
    );
    if (!currentPage) return NextResponse.json({ error: "صفحه دسته‌بندی پیدا نشد." }, { status: 404 });

    let image: string | undefined;
    try {
      image = await saveImage(imageEntry);
    } catch (error) {
      if (error instanceof InvalidImageError) return NextResponse.json({ error: error.message }, { status: 400 });
      throw error;
    }
    const saved = await saveCategoryPage(categorySlug, subcategorySlug, {
      title,
      description,
      phone,
      image: image ?? currentPage.image,
    });
    if (!saved) return NextResponse.json({ error: "صفحه دسته‌بندی پیدا نشد." }, { status: 404 });
    const updatedPage = await readCategoryPage(categorySlug, subcategorySlug);
    return NextResponse.json({ page: updatedPage });
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
    const pageKey = body.page;
    if (pageKey !== "about" && pageKey !== "contact") {
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    }
    const values = body.values && typeof body.values === "object" ? body.values : {};
    const nextPages = {
      ...pages,
      [pageKey]: { ...pages[pageKey], ...values },
    };
    await writeJson("pages.json", nextPages);
    return NextResponse.json(nextPages);
  }

  if (resource === "footer") {
    const currentFooter = await readFooter();
    const footerValues = body.values && typeof body.values === "object"
      ? body.values as Partial<FooterContent>
      : body as Partial<FooterContent>;
    const normalizeLinks = (value: unknown) => {
      if (!Array.isArray(value) || value.length > 20) return null;
      const links: FooterLink[] = [];
      for (const entry of value) {
        if (!entry || typeof entry !== "object") return null;
        const link = entry as Record<string, unknown>;
        if (typeof link.title !== "string" || typeof link.href !== "string" || !link.title.trim() || !link.href.trim()) return null;
        const href = link.href.trim();
        if (!(href.startsWith("/") && !href.startsWith("//")) && !/^https?:\/\//i.test(href)) return null;
        links.push({ title: link.title.trim().slice(0, 100), href: href.slice(0, 300) });
      }
      return links;
    };
    const quickLinks = footerValues.quickLinks === undefined
      ? currentFooter.quickLinks
      : normalizeLinks(footerValues.quickLinks);
    const customerLinks = footerValues.customerLinks === undefined
      ? currentFooter.customerLinks
      : normalizeLinks(footerValues.customerLinks);
    if (!quickLinks || !customerLinks) {
      return NextResponse.json({ error: "پیوندهای فوتر معتبر نیستند." }, { status: 400 });
    }
    const nextFooter: FooterContent = {
      ...currentFooter,
      ...footerValues,
      quickLinks,
      customerLinks,
      brandTitle: typeof footerValues.brandTitle === "string" ? footerValues.brandTitle.trim().slice(0, 100) : currentFooter.brandTitle,
      quickLinksTitle: typeof footerValues.quickLinksTitle === "string" ? footerValues.quickLinksTitle.trim().slice(0, 100) : currentFooter.quickLinksTitle,
      customerLinksTitle: typeof footerValues.customerLinksTitle === "string" ? footerValues.customerLinksTitle.trim().slice(0, 100) : currentFooter.customerLinksTitle,
      contactTitle: typeof footerValues.contactTitle === "string" ? footerValues.contactTitle.trim().slice(0, 100) : currentFooter.contactTitle,
      description: typeof footerValues.description === "string" ? footerValues.description.trim().slice(0, 1000) : currentFooter.description,
      managerCredit: typeof footerValues.managerCredit === "string" ? footerValues.managerCredit.trim().slice(0, 200) : currentFooter.managerCredit,
      designerCredit: typeof footerValues.designerCredit === "string" ? footerValues.designerCredit.trim().slice(0, 200) : currentFooter.designerCredit,
    };
    await writeJson("footer.json", nextFooter);
    return NextResponse.json(nextFooter);
  }

  if (resource === "settings") {
    const currentSettings = await readStoreSettings();
    const nextSettings = { ...currentSettings };

    if ("silentBoxPackagingFee" in body) {
      const packagingFee = Number(body.silentBoxPackagingFee);
      if (!Number.isSafeInteger(packagingFee) || packagingFee < 0) {
        return NextResponse.json({ error: "هزینه باید عدد صحیح و نامنفی باشد." }, { status: 400 });
      }
      nextSettings.silentBoxPackagingFee = packagingFee;
    }

    if ("otherProductsShippingFee" in body) {
      const shippingFee = Number(body.otherProductsShippingFee);
      if (!Number.isSafeInteger(shippingFee) || shippingFee < 0) {
        return NextResponse.json({ error: "هزینه باید عدد صحیح و نامنفی باشد." }, { status: 400 });
      }
      nextSettings.otherProductsShippingFee = shippingFee;
    }

    for (const key of ["rubikaId", "whatsappId", "telegramId"] as const) {
      if (!(key in body)) continue;
      const value = body[key];
      if (typeof value !== "string" || value.trim().length > 100) {
        return NextResponse.json({ error: "آیدی شبکه اجتماعی معتبر نیست." }, { status: 400 });
      }
      nextSettings[key] = value.trim().replace(/^@/, "");
    }

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "تنظیمی برای ذخیره ارسال نشده است." }, { status: 400 });
    }

    await writeJson("settings.json", nextSettings);
    return NextResponse.json(nextSettings);
  }

  return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return responseWithAdminUnauthorized();
  }

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

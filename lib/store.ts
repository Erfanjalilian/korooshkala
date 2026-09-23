import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency?: string;
  category: string;
  categorySlug: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  purchaseCount: number;
  tags: string[];
  image?: string;
  featured?: boolean;
  isBestSelling?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isDiscounted?: boolean;
};

export type Category = { slug: string; name: string; image?: string };
export type User = { id: string; phone?: string; email: string; name: string; role: string; createdAt: string };
export type OrderItem = { productId: string; name: string; price: number; quantity: number };
export type ShippingDetails = {
  fullName: string;
  postalCode: string;
  address: string;
  province: string;
  city: string;
};
export type Order = {
  id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  total: number;
  currency?: string;
  createdAt: string;
  shipping?: ShippingDetails;
  payment?: {
    gateway: string;
    status: string;
    authority?: string;
    referenceId?: string;
  };
};

const dataDirectory = path.join(process.cwd(), "data");

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(dataDirectory, fileName), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(fileName: string, value: unknown) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(path.join(dataDirectory, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export const readProducts = () => readJson<Product[]>("products.json", []);
export const readUsers = () => readJson<User[]>("users.json", []);
export const readOrders = () => readJson<Order[]>("orders.json", []);

export async function readCategories(): Promise<Category[]> {
  const savedCategories = await readJson<Category[]>("categories.json", []);
  if (savedCategories.length > 0) return savedCategories;

  const products = await readProducts();
  return Array.from(new Map(products.map((product) => [product.categorySlug, product.category])).entries())
    .map(([slug, name]) => ({ slug, name }));
}

export type PageContent = {
  about: { title: string; description: string };
  contact: { email: string; phone: string; address: string; hours: string; title: string; description: string };
};

export const defaultPages: PageContent = {
  about: {
    title: "خرید خوب، از انتخاب درست شروع می‌شود.",
    description: "فروشگاه من جایی است برای پیدا کردن محصولاتی کاربردی، دوست‌داشتنی و متناسب با نیازهای روزمره شما؛ با تجربه‌ای ساده و قابل اعتماد.",
  },
  contact: {
    email: "Siavash.m2020@gmail.com",
    phone: "۰۲۱۶۶۸۱۶۲۸۳",
    address: "تهران،خیابان شاد آباد خ سر حدی جنوبی کوچه ی چوپان",
    hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
    title: "با ما در ارتباط باشید",
    description: "سوالی دارید یا برای انتخاب محصول به راهنمایی نیاز دارید؟ پیام خود را برای ما بفرستید.",
  },
};

export const readPages = () => readJson<PageContent>("pages.json", defaultPages);

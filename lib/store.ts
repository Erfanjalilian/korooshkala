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
  guarantee?: string;
  currency?: string;
  category: string;
  categorySlug: string;
  subcategorySlug?: string;
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

export type CategorySubcategory = {
  slug: string;
  name: string;
  items?: CategorySubcategory[];
};
export type CategorySubcategoryGroup = {
  slug: string;
  name: string;
  items: CategorySubcategory[];
};
export type Category = {
  slug: string;
  name: string;
  image?: string;
  subcategories?: CategorySubcategoryGroup[];
};
export type StoreSettings = {
  silentBoxPackagingFee: number;
  otherProductsShippingFee: number;
  rubikaId: string;
  whatsappId: string;
  telegramId: string;
};
export type ShippingProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  address: string;
  province: string;
  city: string;
};
export type User = { id: string; phone?: string; email: string; name: string; role: string; createdAt: string; shippingProfile?: ShippingProfile };
export type OrderItem = { productId: string; name: string; price: number; quantity: number };
export type ShippingDetails = {
  fullName: string;
  postalCode: string;
  address: string;
  province: string;
  city: string;
  phone?: string;
  shippingMethod?: "tipax" | "bus";
};
export type Order = {
  id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  total: number;
  currency?: string;
  createdAt: string;
  notificationSmsAttemptedAt?: string;
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
export const defaultStoreSettings: StoreSettings = {
  silentBoxPackagingFee: 350_000,
  otherProductsShippingFee: 150_000,
  rubikaId: "",
  whatsappId: "",
  telegramId: "",
};
export async function readStoreSettings(): Promise<StoreSettings> {
  return { ...defaultStoreSettings, ...(await readJson<Partial<StoreSettings>>("settings.json", {})) };
}

export function calculateSilentBoxPackagingFee(
  items: Array<{ productId: string; quantity: number }>,
  products: Product[],
  unitFee: number,
) {
  return items.reduce((total, item) => {
    const product = products.find((current) => current.id === item.productId);
    return total + (product?.categorySlug === "سایلنت-باکس" ? item.quantity * unitFee : 0);
  }, 0);
}

export function calculateOtherProductsShippingFee(
  items: Array<{ productId: string; quantity: number }>,
  products: Product[],
  unitFee: number,
) {
  const otherProductsQuantity = items.reduce((total, item) => {
    const product = products.find((current) => current.id === item.productId);
    return total + (product && product.categorySlug !== "سایلنت-باکس" ? item.quantity : 0);
  }, 0);

  return Math.ceil(otherProductsQuantity / 5) * unitFee;
}

export async function readCategories(): Promise<Category[]> {
  const savedCategories = await readJson<Category[]>("categories.json", []);
  if (savedCategories.length > 0) return savedCategories;

  const products = await readProducts();
  return Array.from(new Map(products.map((product) => [product.categorySlug, product.category])).entries())
    .map(([slug, name]) => ({ slug, name }));
}

export type PageContent = {
  about: { title: string; description: string; image?: string };
  contact: { email: string; phone: string; address: string; hours: string; title: string; description: string; image?: string };
};
export type FooterLink = { title: string; href: string };
export type FooterContent = {
  brandTitle: string;
  description: string;
  quickLinksTitle: string;
  customerLinksTitle: string;
  contactTitle: string;
  quickLinks: FooterLink[];
  customerLinks: FooterLink[];
  managerCredit: string;
  designerCredit: string;
};

export const defaultPages: PageContent = {
  about: {
    title: "خرید خوب، از انتخاب درست شروع می‌شود.",
    description: "فروشگاه کوروش کالا جایی است برای پیدا کردن محصولاتی کاربردی، دوست‌داشتنی و متناسب با نیازهای روزمره شما؛ با تجربه‌ای ساده و قابل اعتماد.",
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

export const defaultFooter: FooterContent = {
  brandTitle: "فروشگاه کوروش کالا",
  description: "تجربه‌ای ساده، سریع و مطمئن برای پیدا کردن محصولاتی که دوستشان دارید.",
  quickLinksTitle: "دسترسی سریع",
  customerLinksTitle: "خدمات مشتریان",
  contactTitle: "ارتباط با ما",
  quickLinks: [
    { title: "صفحه اصلی", href: "/" },
    { title: "محصولات", href: "/products" },
    { title: "درباره ما", href: "/about" },
    { title: "تماس با ما", href: "/contact" },
  ],
  customerLinks: [
    { title: "راهنمای خرید", href: "/guide" },
    { title: "شرایط و روش ارسال", href: "/shipping" },
    { title: "تست و مرجوعی کالا", href: "/returns" },
    { title: "پرسش‌های متداول", href: "/faq" },
    { title: "قوانین و مقررات", href: "/terms" },
  ],
  managerCredit: "مدیر پروژه سیاوش: 09124541307",
  designerCredit: "طراحی‌شده توسط عرفان جلیلیان",
};

export async function readPages(): Promise<PageContent> {
  const savedPages = await readJson<Partial<PageContent>>("pages.json", {});
  return {
    about: { ...defaultPages.about, ...savedPages.about },
    contact: { ...defaultPages.contact, ...savedPages.contact },
  };
}

export async function readFooter(): Promise<FooterContent> {
  const savedFooter = await readJson<Partial<FooterContent>>("footer.json", {});
  return { ...defaultFooter, ...savedFooter };
}

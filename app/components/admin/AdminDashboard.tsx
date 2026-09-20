"use client";

function ProductFormModal({
  product,
  categories,
  onSave,
  onCancel,
  saving,
}: {
  product: Product;
  categories: Category[];
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [hasDiscount, setHasDiscount] = useState(
    Boolean(product.isDiscounted || product.compareAtPrice > product.price),
  );
  const [fileName, setFileName] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <button
        type="button"
        aria-label="بستن فرم"
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />
      <section className="relative z-10 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <h2
            id="product-form-title"
            className="text-lg font-extrabold text-[#111827]"
          >
            {product.id ? "ویرایش محصول" : "افزودن محصول"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="بستن فرم"
            className="flex size-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFC]"
          >
            <X size={19} />
          </button>
        </div>
        <form onSubmit={onSave} className="grid gap-4">
          <Field
            label="نام محصول"
            name="name"
            defaultValue={product.name}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="کد کالا" name="sku" defaultValue={product.sku} />
            <Field label="برند" name="brand" defaultValue={product.brand} />
          </div>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            دسته‌بندی
            <select
              name="category"
              defaultValue={product.category}
              className={inputClass}
              required
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-sm font-bold text-[#111827]">
            <input
              type="checkbox"
              name="isDiscounted"
              value="true"
              checked={hasDiscount}
              onChange={(event) => setHasDiscount(event.target.checked)}
              className="size-4 accent-[#2563EB]"
            />
            تخفیف‌های ویژه / نمایش در بخش تخفیف‌ها
          </label>
          {hasDiscount ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="قیمت قبل از تخفیف"
                name="compareAtPrice"
                type="number"
                defaultValue={product.compareAtPrice || product.price}
                required
              />
              <Field
                label="قیمت بعد از تخفیف"
                name="price"
                type="number"
                defaultValue={product.price}
                required
              />
            </div>
          ) : (
            <Field
              label="قیمت محصول"
              name="price"
              type="number"
              defaultValue={product.price}
              required
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="موجودی"
              name="stock"
              type="number"
              defaultValue={product.stock}
              required
            />
            <Field
              label="برچسب‌ها"
              name="tags"
              defaultValue={product.tags.join(", ")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="امتیاز محصول (از ۵)"
              name="rating"
              type="number"
              defaultValue={product.rating}
              min={0}
              max={5}
              step={0.1}
              required
            />
            <Field
              label="تعداد فروش"
              name="purchaseCount"
              type="number"
              defaultValue={product.purchaseCount}
              min={0}
              step={1}
              required
            />
          </div>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            توضیحات
            <textarea
              name="description"
              defaultValue={product.description}
              rows={4}
              className="resize-y rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            <span>تصویر محصول</span>
            <span className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#93C5FD] bg-[#EFF6FF] px-3 text-center text-sm text-[#2563EB]">
              <Upload size={19} />
              {fileName ||
                (product.image ? "انتخاب تصویر جدید" : "انتخاب تصویر محصول")}
              <input
                type="file"
                name="image"
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? "")
                }
                className="sr-only"
              />
            </span>
            {product.image ? (
              <img
                src={product.image}
                alt="تصویر فعلی محصول"
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : null}
          </label>
          <fieldset className="grid gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
            <legend className="px-1 text-sm font-bold text-[#111827]">
              نمایش در صفحه اصلی
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <FlagCheckbox
                name="isBestSelling"
                checked={Boolean(product.isBestSelling)}
                label="پرفروش‌ترین محصولات"
              />
              <FlagCheckbox
                name="isNew"
                checked={Boolean(product.isNew)}
                label="جدیدترین محصولات"
              />
              <FlagCheckbox
                name="isHot"
                checked={Boolean(product.isHot)}
                label="داغ‌ترین محصولات"
              />
            </div>
          </fieldset>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "در حال ذخیره..." : "ذخیره محصول"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm font-bold text-[#6B7280]"
            >
              انصراف
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Check,
  ChevronLeft,
  LayoutDashboard,
  ListPlus,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  category: string;
  categorySlug: string;
  brand: string;
  stock: number;
  rating: number;
  purchaseCount: number;
  tags: string[];
  image?: string;
  featured?: boolean;
  isBestSelling?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isDiscounted?: boolean;
};
type Category = { slug: string; name: string; image?: string };
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};
type Order = {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
};
type Pages = {
  about: { title: string; description: string };
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    title: string;
    description: string;
  };
};
type DashboardData = {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  pages: Pages;
};
type Tab =
  | "overview"
  | "products"
  | "categories"
  | "users"
  | "orders"
  | "pages";

const emptyProduct = (): Product => ({
  id: "",
  sku: "",
  slug: "",
  name: "",
  description: "",
  price: 0,
  compareAtPrice: 0,
  category: "",
  categorySlug: "",
  brand: "",
  stock: 0,
  rating: 0,
  purchaseCount: 0,
  tags: [],
});
const numberFormat = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);
const inputClass =
  "h-11 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "نمای کلی", icon: LayoutDashboard },
  { id: "products", label: "محصولات", icon: Package },
  { id: "categories", label: "دسته‌بندی‌ها", icon: ListPlus },
  { id: "users", label: "کاربران", icon: Users },
  { id: "orders", label: "سفارش‌ها", icon: ShoppingBag },
  { id: "pages", label: "صفحه‌ها", icon: BookOpenText },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const response = await fetch("/api/admin", { cache: "no-store" });
    if (response.ok) setData((await response.json()) as DashboardData);
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const remove = async (resource: string, id: string) => {
    if (!window.confirm("از حذف این مورد مطمئن هستید؟")) return;
    const response = await fetch(
      `/api/admin?resource=${resource}&id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (response.ok) {
      setMessage("حذف با موفقیت انجام شد.");
      await loadData();
    }
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const id = editingProduct?.id;
    const response = await fetch(
      `/api/admin?resource=products${id ? `&id=${id}` : ""}`,
      { method: id ? "PATCH" : "POST", body: formData },
    );
    setSaving(false);
    if (response.ok) {
      setEditingProduct(null);
      setMessage("محصول ذخیره شد.");
      await loadData();
    }
  };

  if (loading || !data)
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-[#2563EB]">
        <LoaderCircle className="animate-spin" size={30} />
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-7 flex flex-col gap-4 rounded-[2rem] bg-gradient-to-l from-[#172554] via-[#1D4ED8] to-[#2563EB] p-6 text-white shadow-[0_18px_45px_rgba(29,78,216,0.2)] sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-semibold text-blue-100">
            JAHANKALA / ADMIN1383
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">پنل مدیریت فروشگاه</h1>
          <p className="mt-2 text-sm text-blue-100">
            مدیریت متمرکز محصولات، سفارش‌ها و محتوای سایت
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-bold transition hover:bg-white/25"
        >
          بازگشت به فروشگاه
          <ChevronLeft size={16} />
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
        <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-sm lg:sticky lg:top-6 lg:grid-cols-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition ${activeTab === id ? "bg-[#EEF2FF] text-[#2563EB]" : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <main className="min-w-0">
          {message ? (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <span className="flex items-center gap-2">
                <Check size={17} />
                {message}
              </span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="بستن پیام"
              >
                <X size={16} />
              </button>
            </div>
          ) : null}
          {activeTab === "overview" ? <Overview data={data} /> : null}
          {activeTab === "products" ? (
            <Products
              data={data}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              onSave={saveProduct}
              onDelete={(id) => void remove("products", id)}
              saving={saving}
            />
          ) : null}
          {activeTab === "categories" ? (
            <Categories
              data={data}
              onRefresh={loadData}
              onDelete={(id) => void remove("categories", id)}
            />
          ) : null}
          {activeTab === "users" ? (
            <UsersPanel data={data} onRefresh={loadData} />
          ) : null}
          {activeTab === "orders" ? (
            <OrdersPanel data={data} onRefresh={loadData} />
          ) : null}
          {activeTab === "pages" ? (
            <PagesPanel data={data} onRefresh={loadData} />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#111827]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function Overview({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Stat title="محصولات" value={data.products.length} icon={Package} />
      <Stat
        title="دسته‌بندی‌ها"
        value={data.categories.length}
        icon={ListPlus}
      />
      <Stat title="کاربران" value={data.users.length} icon={Users} />
      <Stat title="سفارش‌ها" value={data.orders.length} icon={ShoppingBag} />
      <Panel title="آخرین سفارش‌ها">
        <div className="grid gap-3">
          {data.orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 text-sm last:border-0 last:pb-0"
            >
              <span className="font-bold text-[#111827]">{order.id}</span>
              <span className="text-[#6B7280]">
                {numberFormat(order.total)} تومان
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="وضعیت موجودی">
        <div className="grid gap-3">
          {data.products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="truncate font-semibold text-[#111827]">
                {product.name}
              </span>
              <span
                className={
                  product.stock < 5
                    ? "font-bold text-red-600"
                    : "text-[#6B7280]"
                }
              >
                {numberFormat(product.stock)} عدد
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
function Stat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2563EB]">
        <Icon size={22} />
      </div>
      <p className="mt-5 text-sm text-[#6B7280]">{title}</p>
      <strong className="mt-1 block text-3xl font-extrabold text-[#111827]">
        {numberFormat(value)}
      </strong>
    </div>
  );
}

function Products({
  data,
  editingProduct,
  setEditingProduct,
  onSave,
  onDelete,
  saving,
}: {
  data: DashboardData;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <Panel
        title="فهرست محصولات"
        action={
          <button
            type="button"
            onClick={() => setEditingProduct(emptyProduct())}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-3 text-sm font-bold text-white hover:bg-[#1D4ED8]"
          >
            <Plus size={17} />
            محصول جدید
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-right text-sm">
            <thead className="border-b border-[#E5E7EB] text-xs text-[#6B7280]">
              <tr>
                <th className="pb-3">محصول</th>
                <th className="pb-3">دسته</th>
                <th className="pb-3">قیمت</th>
                <th className="pb-3">موجودی</th>
                <th className="pb-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#F1F5F9] last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="size-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex size-11 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#2563EB]">
                          <Package size={19} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#111827]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-[#6B7280]">{product.category}</td>
                  <td className="py-4 font-semibold text-[#2563EB]">
                    {numberFormat(product.price)}
                  </td>
                  <td className="py-4 text-[#6B7280]">
                    {numberFormat(product.stock)}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        aria-label="ویرایش محصول"
                        className="flex size-9 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#EEF2FF]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        aria-label="حذف محصول"
                        className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {editingProduct ? (
        <ProductFormModal
          product={editingProduct}
          categories={data.categories}
          onSave={onSave}
          onCancel={() => setEditingProduct(null)}
          saving={saving}
        />
      ) : (
        <Panel title="راهنمای سریع">
          <div className="grid gap-4 text-sm leading-7 text-[#6B7280]">
            <p>برای ساخت محصول جدید روی «محصول جدید» بزنید.</p>
            <p>
              تصویر را با هر پسوندی انتخاب کنید؛ فایل در مسیر `public/uploads`
              ذخیره می‌شود.
            </p>
            <p>قیمت‌ها را به ریال وارد کنید.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}

function FlagCheckbox({
  name,
  checked,
  label,
}: {
  name: string;
  checked: boolean;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#111827]">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="size-4 accent-[#2563EB]"
      />
      {label}
    </label>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  min,
  max,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111827]">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        step={step}
        className={inputClass}
      />
    </label>
  );
}

function Categories({
  data,
  onRefresh,
  onDelete,
}: {
  data: DashboardData;
  onRefresh: () => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <Panel title="مدیریت دسته‌بندی‌ها">
      <button type="button" onClick={() => setEditingCategory({ slug: "", name: "" })} className="mb-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white">
        <Plus size={17} /> افزودن دسته‌بندی
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.categories.map((category) => (
          <div
            key={category.slug}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              {category.image ? <img src={category.image} alt="" className="size-12 shrink-0 rounded-xl object-cover" /> : <div className="size-12 shrink-0 rounded-xl bg-[#EEF2FF]" />}
              <span className="truncate font-bold text-[#111827]">{category.name}</span>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => setEditingCategory(category)} aria-label="ویرایش دسته‌بندی" className="flex size-9 items-center justify-center rounded-lg text-[#2563EB] hover:bg-[#EEF2FF]"><Pencil size={16} /></button>
              <button type="button" onClick={() => onDelete(category.slug)} aria-label="حذف دسته‌بندی" className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}
      </div>
      {editingCategory ? <CategoryFormModal category={editingCategory} onCancel={() => setEditingCategory(null)} onSaved={async () => { setEditingCategory(null); await onRefresh(); }} /> : null}
    </Panel>
  );
}

function CategoryFormModal({ category, onCancel, onSaved }: { category: Category; onCancel: () => void; onSaved: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`/api/admin?resource=categories${category.slug ? `&id=${encodeURIComponent(category.slug)}` : ""}`, { method: category.slug ? "PATCH" : "POST", body: new FormData(event.currentTarget) });
    setSaving(false);
    if (response.ok) await onSaved();
  };

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="category-form-title">
    <button type="button" aria-label="بستن فرم" onClick={onCancel} className="absolute inset-0 cursor-default" />
    <section className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
      <div className="mb-5 flex items-center justify-between border-b border-[#E5E7EB] pb-4"><h2 id="category-form-title" className="font-extrabold text-[#111827]">{category.slug ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}</h2><button type="button" onClick={onCancel} aria-label="بستن فرم"><X size={19} /></button></div>
      <form onSubmit={save} className="grid gap-4">
        <Field label="نام دسته‌بندی" name="name" defaultValue={category.name} required />
        <label className="grid gap-2 text-sm font-semibold text-[#111827]"><span>تصویر دسته‌بندی</span><span className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#93C5FD] bg-[#EFF6FF] px-3 text-center text-sm text-[#2563EB]"><Upload size={19} />{fileName || (category.image ? "انتخاب تصویر جدید" : "انتخاب تصویر")}<input type="file" name="image" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} className="sr-only" /></span>{category.image ? <img src={category.image} alt="تصویر فعلی دسته‌بندی" className="size-20 rounded-xl object-cover" /> : null}</label>
        <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60"><Save size={17} />{saving ? "در حال ذخیره..." : "ذخیره دسته‌بندی"}</button>
      </form>
    </section>
  </div>;
}

function UsersPanel({
  data,
  onRefresh,
}: {
  data: DashboardData;
  onRefresh: () => Promise<void>;
}) {
  const update = async (id: string, role: string) => {
    await fetch(`/api/admin?resource=users&id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    await onRefresh();
  };
  return (
    <Panel title="مدیریت کاربران">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-right text-sm">
          <thead className="border-b border-[#E5E7EB] text-xs text-[#6B7280]">
            <tr>
              <th className="pb-3">نام</th>
              <th className="pb-3">ایمیل</th>
              <th className="pb-3">نقش</th>
              <th className="pb-3">تاریخ ثبت‌نام</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#F1F5F9] last:border-0"
              >
                <td className="py-4 font-bold">{user.name}</td>
                <td className="py-4 text-[#6B7280]">{user.email}</td>
                <td className="py-4">
                  <select
                    value={user.role}
                    onChange={(event) =>
                      void update(user.id, event.target.value)
                    }
                    className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-xs"
                  >
                    <option value="customer">مشتری</option>
                    <option value="admin">مدیر</option>
                  </select>
                </td>
                <td className="py-4 text-[#6B7280]">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
function OrdersPanel({
  data,
  onRefresh,
}: {
  data: DashboardData;
  onRefresh: () => Promise<void>;
}) {
  const update = async (id: string, status: string) => {
    await fetch(`/api/admin?resource=orders&id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await onRefresh();
  };
  return (
    <Panel title="مدیریت سفارش‌ها">
      <div className="grid gap-3">
        {data.orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-[#111827]">{order.id}</p>
              <p className="mt-1 text-xs text-[#6B7280]">
                کاربر: {order.userId} |{" "}
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <strong className="text-sm text-[#2563EB]">
                {numberFormat(order.total)} تومان
              </strong>
              <select
                value={order.status}
                onChange={(event) => void update(order.id, event.target.value)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-xs"
              >
                <option value="pending">در انتظار</option>
                <option value="processing">در حال پردازش</option>
                <option value="shipped">ارسال شده</option>
                <option value="completed">تکمیل شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PagesPanel({
  data,
  onRefresh,
}: {
  data: DashboardData;
  onRefresh: () => Promise<void>;
}) {
  const [about, setAbout] = useState(data.pages.about);
  const [contact, setContact] = useState(data.pages.contact);
  const save = async (page: string, values: object) => {
    await fetch("/api/admin?resource=pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, values }),
    });
    await onRefresh();
  };
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="مدیریت صفحه درباره ما">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            عنوان اصلی
            <input
              value={about.title}
              onChange={(event) =>
                setAbout({ ...about, title: event.target.value })
              }
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            متن معرفی
            <textarea
              value={about.description}
              onChange={(event) =>
                setAbout({ ...about, description: event.target.value })
              }
              rows={7}
              className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>
          <button
            type="button"
            onClick={() => void save("about", about)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white"
          >
            <Save size={17} />
            ذخیره درباره ما
          </button>
        </div>
      </Panel>
      <Panel title="مدیریت صفحه تماس با ما">
        <div className="grid gap-4">
          {(
            [
              "title",
              "description",
              "email",
              "phone",
              "address",
              "hours",
            ] as const
          ).map((key) =>
            key === "description" ? (
              <label
                key={key}
                className="grid gap-2 text-sm font-semibold text-[#111827]"
              >
                توضیحات
                <textarea
                  value={contact[key]}
                  onChange={(event) =>
                    setContact({ ...contact, [key]: event.target.value })
                  }
                  rows={4}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB]"
                />
              </label>
            ) : (
              <label
                key={key}
                className="grid gap-2 text-sm font-semibold text-[#111827]"
              >
                {key === "title"
                  ? "عنوان"
                  : key === "email"
                    ? "ایمیل"
                    : key === "phone"
                      ? "تلفن"
                      : key === "address"
                        ? "نشانی"
                        : "ساعات پاسخ‌گویی"}
                <input
                  value={contact[key]}
                  onChange={(event) =>
                    setContact({ ...contact, [key]: event.target.value })
                  }
                  className={inputClass}
                />
              </label>
            ),
          )}
          <button
            type="button"
            onClick={() => void save("contact", contact)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white"
          >
            <Save size={17} />
            ذخیره تماس با ما
          </button>
        </div>
      </Panel>
    </div>
  );
}

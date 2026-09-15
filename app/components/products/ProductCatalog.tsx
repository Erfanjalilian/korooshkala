"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Coffee,
  Headphones,
  Home,
  Laptop,
  Search,
  Shirt,
  Sparkles,
  Star,
  Watch,
  X,
} from "lucide-react";

type Product = {
  id: string;
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
  reviewCount: number;
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isDiscounted?: boolean;
};

type Category = { slug: string; name: string };

type ApiResponse = {
  products: Product[];
  total: number;
  categories: Category[];
};

const categoryIcons = {
  clothing: Shirt,
  "watches-accessories": Watch,
  digital: Laptop,
  "coffee-drinks": Coffee,
  home: Home,
  "beauty-health": Sparkles,
} as const;

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

interface ProductCatalogProps {
  initialCategory?: string;
  initialQuery?: string;
}

export default function ProductCatalog({
  initialCategory,
  initialQuery,
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [activeQuery, setActiveQuery] = useState(initialQuery ?? "");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (activeQuery) params.set("q", activeQuery);
    if (category !== "all") params.set("category", category);
    if (sort !== "featured") params.set("sort", sort);

    fetch(`/api/products?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("دریافت محصولات ناموفق بود");
        return (await response.json()) as ApiResponse;
      })
      .then((data) => {
        setError("");
        setLoading(false);
        setProducts(data.products);
        setCategories(data.categories);
      })
      .catch((requestError: Error) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
          setLoading(false);
        }
      })

    return () => controller.abort();
  }, [activeQuery, category, sort]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveQuery(query.trim());
  };

  const uniqueCategories = Array.from(
    new Map(categories.map((item) => [item.slug, item])).values(),
  );

  const categoryFilter = (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={() => {
          setCategory("all");
          setMobileFiltersOpen(false);
        }}
        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-right text-sm transition ${
          category === "all"
            ? "bg-[#EEF2FF] font-bold text-[#2563EB]"
            : "text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#2563EB]"
        }`}
      >
        همه محصولات
        <span>{products.length}</span>
      </button>
      {uniqueCategories.map((item) => {
        const Icon = categoryIcons[item.slug as keyof typeof categoryIcons];
        return (
          <button
            key={`category-${item.slug}`}
            type="button"
            onClick={() => {
              setCategory(item.slug);
              setMobileFiltersOpen(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-right text-sm transition ${
              category === item.slug
                ? "bg-[#EEF2FF] font-bold text-[#2563EB]"
                : "text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#2563EB]"
            }`}
          >
            {Icon ? <Icon aria-hidden="true" size={16} /> : null}
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="rounded-[2rem] bg-gradient-to-l from-[#2563EB] to-[#7C3AED] px-6 py-8 text-white shadow-[0_16px_38px_rgba(37,99,235,0.16)] sm:px-10 sm:py-10">
        <p className="text-sm font-semibold text-white/80">فروشگاه من</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">همه محصولات</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
          از میان محصولات متنوع، گزینه مناسب خودت را پیدا کن و با خیال راحت سفارش بده.
        </p>

        <form onSubmit={handleSearch} className="relative mt-6 max-w-2xl">
          <Search
            aria-hidden="true"
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی نام، برند یا دسته‌بندی..."
            aria-label="جستجوی محصولات"
            className="h-13 w-full rounded-2xl border border-white/70 bg-white pr-12 pl-28 text-sm text-[#111827] shadow-sm outline-none placeholder:text-[#9CA3AF] focus:ring-4 focus:ring-white/25"
          />
          <button
            type="submit"
            className="absolute left-1.5 top-1.5 h-10 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#7C3AED]"
          >
            جستجو
          </button>
        </form>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#111827] shadow-sm lg:hidden"
        >
          <span>فیلتر دسته‌بندی</span>
          <span className="text-[#2563EB]">{category === "all" ? "همه محصولات" : uniqueCategories.find((item) => item.slug === category)?.name}</span>
        </button>

        {mobileFiltersOpen ? (
          <>
            <button
              type="button"
              aria-label="بستن فیلتر دسته‌بندی"
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            <aside className="fixed inset-x-3 bottom-3 z-50 max-h-[75vh] overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xl lg:hidden">
              <div className="mb-3 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h2 className="text-sm font-extrabold text-[#111827]">فیلتر دسته‌بندی</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="بستن فیلتر دسته‌بندی"
                  className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F5F7FA]"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              </div>
              {categoryFilter}
            </aside>
          </>
        ) : null}

        <aside className="hidden h-fit rounded-2xl border border-[#E5E7EB] bg-white p-4 lg:sticky lg:top-24 lg:block">
          <h2 className="text-sm font-extrabold text-[#111827]">دسته‌بندی محصولات</h2>
          <div className="mt-4 grid gap-1">
            {categoryFilter}
          </div>
        </aside>

        <section aria-labelledby="catalog-title">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#7C3AED]">موجود در فروشگاه</p>
              <h2 id="catalog-title" className="mt-1 text-xl font-extrabold text-[#111827]">
                {loading ? "در حال دریافت..." : `${products.length} محصول برای شما`}
              </h2>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#6B7280]">
              مرتب‌سازی
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-[#111827] outline-none focus:border-[#2563EB]"
              >
                <option value="featured">پیشنهاد شده</option>
                <option value="newest">جدیدترین</option>
                <option value="rating">بیشترین امتیاز</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
              </select>
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-[#E5E7EB]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#6B7280]">
              محصولی با این مشخصات پیدا نشد.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${encodeURIComponent(product.slug)}`}
                  className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#7C3AED] hover:shadow-[0_10px_24px_rgba(124,58,237,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#DBEAFE] to-[#F5F7FA]">
                    <div className="flex size-24 items-center justify-center rounded-3xl bg-white/80 text-[#2563EB] shadow-sm transition group-hover:text-[#7C3AED]">
                      <Headphones aria-hidden="true" size={48} strokeWidth={1.4} />
                    </div>
                    <span className="absolute right-3 top-3 rounded-full bg-[#7C3AED] px-2.5 py-1 text-[10px] font-bold text-white">
                      {product.isDiscounted ? "پیشنهاد ویژه" : product.isNew ? "جدید" : "محبوب"}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#7C3AED]">{product.category}</p>
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <Star aria-hidden="true" size={13} className="fill-[#7C3AED] text-[#7C3AED]" />
                        {product.rating}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-extrabold text-[#111827]">{product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B7280]">{product.description}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <span className="text-sm font-extrabold text-[#2563EB]">{formatPrice(product.price)}</span>
                      {product.compareAtPrice > product.price ? (
                        <del className="text-[10px] text-[#9CA3AF]">{formatPrice(product.compareAtPrice)}</del>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

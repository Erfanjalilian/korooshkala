"use client";

import { useEffect, useRef, useState } from "react";
import CategoryCard from "@/app/components/home/CategoryCard";
import CategorySubcategoryTree from "@/app/components/categories/CategorySubcategoryTree";
import type { Category } from "@/lib/store";

const categorySlogans: Record<string, string> = {
  aluminum: "آلومینیوم؛سبکی،هوشمندانه،استحکام ماندگار،آینده‌ای درخشان",
  stainless: "استیل؛قدرتی ضد زنگ،کیفیتی ماندگار",
  steel: "فولاد؛قدرتی که آینده را میسازد",
  "copper-alloys": "مس؛جریان قدرت در رگ های صنعت",
  polyamine: "پلی آمید؛قدرت مهندسی در قلب صنعت",
};

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const subcategoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expandedCategory) return;

    subcategoriesRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [expandedCategory]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/categories", { cache: "no-store", signal: controller.signal })
      .then((response) => response.json() as Promise<{ categories: Category[] }>)
      .then((data) => setCategories(data.categories))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setCategories([]);
      });
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="popular-categories-title" className="mt-10 sm:mt-12">
      <div className="mb-6">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">انتخاب سریع</p>
          <h2 id="popular-categories-title" className="text-xl font-extrabold text-[#111827] sm:text-2xl">
            همه دسته‌بندی‌ها
          </h2>
        </div>
      </div>

      <div
        dir="rtl"
        aria-label="دسته‌بندی‌های اصلی"
        className="category-grid grid grid-cols-2 gap-x-4 gap-y-3 py-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            title={category.name}
            image={category.image}
            subcategories={category.subcategories}
            subcategoriesExpanded={expandedCategory === category.slug}
            onSubcategoriesToggle={
              category.subcategories?.length
                ? () => setExpandedCategory((current) => current === category.slug ? null : category.slug)
                : undefined
            }
            href={`/products?category=${encodeURIComponent(category.slug)}`}
          />
        ))}
      </div>
      {categories
        .filter((category) => category.slug === expandedCategory && category.subcategories?.length)
        .map((category) => (
          <div
            key={`${category.slug}-subcategories`}
            ref={subcategoriesRef}
            className="mt-6 scroll-mt-28 rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFF7ED] via-white to-[#EFF6FF] p-4 shadow-sm sm:p-6"
          >
            <div className="mb-5">
              <h3 className="text-lg font-extrabold text-[#292524] sm:text-xl">
                زیرمجموعه‌های {category.name}
              </h3>
              {categorySlogans[category.slug] ? (
                <p className="mt-2 text-sm font-medium leading-7 text-[#78716C] sm:text-base">
                  {categorySlogans[category.slug]}
                </p>
              ) : null}
            </div>
            <CategorySubcategoryTree
              categorySlug={category.slug}
              groups={category.subcategories ?? []}
            />
          </div>
        ))}
    </section>
  );
}

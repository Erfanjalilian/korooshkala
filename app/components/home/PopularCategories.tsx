"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CategoryCard from "@/app/components/home/CategoryCard";
import CategorySubcategoryTree from "@/app/components/categories/CategorySubcategoryTree";
import type { Category } from "@/lib/store";

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
        dir="ltr"
        aria-label="دسته‌بندی‌های اصلی"
        className="category-slider overflow-hidden py-3"
      >
        <div dir="ltr" className="category-slider-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              dir="rtl"
              aria-hidden={copy === 1 ? true : undefined}
              className="category-slider-group"
            >
              {categories.map((category) => (
                <div
                  key={`${copy}-${category.slug}`}
                  dir="rtl"
                  className="w-28 shrink-0 sm:w-32 lg:w-36"
                >
                  <CategoryCard
                    title={category.name}
                    image={category.image}
                    subcategories={category.subcategories}
                    subcategoriesExpanded={expandedCategory === category.slug}
                    isDuplicate={copy === 1}
                    onSubcategoriesToggle={
                      category.subcategories?.length
                        ? () => setExpandedCategory((current) => current === category.slug ? null : category.slug)
                        : undefined
                    }
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {categories
        .filter((category) => category.slug === expandedCategory && category.subcategories?.length)
        .map((category) => (
          <div
            key={`${category.slug}-subcategories`}
            ref={subcategoriesRef}
            className="mt-6 scroll-mt-28 rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFF7ED] via-white to-[#EFF6FF] p-4 shadow-sm sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-[#292524]">
                زیرمجموعه‌های {category.name}
              </h3>
              <Link
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="text-xs font-semibold text-[#C2410C] transition hover:text-[#EA580C]"
              >
                مشاهده همهٔ {category.name}
              </Link>
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

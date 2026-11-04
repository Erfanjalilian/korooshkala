"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CategoryCard from "@/app/components/home/CategoryCard";
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
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">انتخاب سریع</p>
          <h2 id="popular-categories-title" className="text-xl font-extrabold text-[#111827] sm:text-2xl">
            همه دسته‌بندی‌ها
          </h2>
        </div>
      </div>

      <div className="category-grid grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-4">
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
            className="mt-6 scroll-mt-28 rounded-2xl border border-[#3F3F46] bg-[#121214] p-4 sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-[#F4F4F5]">
                زیرمجموعه‌های {category.name}
              </h3>
              <Link
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="text-xs font-semibold text-[#FDBA74] transition hover:text-[#FB923C]"
              >
                مشاهده همهٔ {category.name}
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {category.subcategories?.map((group) => (
                <section key={group.slug} aria-labelledby={`${category.slug}-${group.slug}`}>
                  <h4
                    id={`${category.slug}-${group.slug}`}
                    className="mb-3 text-sm font-bold text-[#D4D4D8]"
                  >
                    {group.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/products?category=${encodeURIComponent(category.slug)}&subcategory=${encodeURIComponent(item.slug)}`}
                        className="rounded-lg border border-[#3F3F46] bg-[#202024] px-2.5 py-1.5 text-xs text-[#D4D4D8] transition hover:border-[#F97316] hover:bg-[#292524] hover:text-[#FDBA74]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ))}
    </section>
  );
}

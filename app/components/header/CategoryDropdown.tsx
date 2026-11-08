"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/store";
import CategorySubcategoryTree from "@/app/components/categories/CategorySubcategoryTree";

export default function CategoryDropdown({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "inline";
  onNavigate?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const expandedCategoryRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!expandedCategory) return;

    expandedCategoryRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "nearest",
    });
  }, [expandedCategory]);

  return (
    <div className={variant === "desktop"
      ? "absolute right-full top-0 z-[70] max-h-[min(70vh,36rem)] w-72 overflow-y-auto rounded-2xl border border-[#E7E5E4] bg-white p-3 shadow-xl"
      : "mt-2 grid gap-1 border-r border-[#E7E5E4] pr-3"}>
      {variant === "desktop" ? (
        <div className="mb-2 border-b border-[#E7E5E4] px-2 py-2">
          <p className="text-xs font-medium text-[#78716C]">دسته‌بندی محصولات</p>
        </div>
      ) : null}
      <div className="grid gap-1">
        {categories.map((category) => (
          <div
            key={category.slug}
            ref={expandedCategory === category.slug ? expandedCategoryRef : undefined}
          >
            {category.subcategories?.length ? (
              <>
                <button
                  type="button"
                  onClick={() => setExpandedCategory((current) => current === category.slug ? null : category.slug)}
                  aria-expanded={expandedCategory === category.slug}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-sm text-[#292524] transition hover:bg-[#FFF4E6] hover:text-[#C2410C]"
                >
                  {category.name}
                  <ChevronDown
                    aria-hidden="true"
                    size={15}
                    className={`shrink-0 transition-transform ${expandedCategory === category.slug ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedCategory === category.slug ? (
                  <div className="mx-2 mb-2 mt-1 rounded-xl border border-[#FED7AA] bg-[#FFFAF3] p-2">
                    <CategorySubcategoryTree
                      categorySlug={category.slug}
                      groups={category.subcategories}
                      onNavigate={onNavigate}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <Link
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                onClick={onNavigate}
                className="block rounded-xl px-3 py-2.5 text-sm text-[#292524] transition hover:bg-[#FFF4E6] hover:text-[#C2410C]"
              >
                {category.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
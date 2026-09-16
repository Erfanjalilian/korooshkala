"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = { slug: string; name: string };

export default function CategoryDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);

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
    <div className="invisible pointer-events-none absolute right-full top-0 w-64 -translate-x-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover/product:pointer-events-auto group-hover/product:visible group-hover/product:translate-x-0 group-hover/product:opacity-100">
      <div className="mb-2 border-b border-[#E5E7EB] px-3 py-2">
        <p className="text-xs font-medium text-[#6B7280]">
          دسته‌بندی محصولات
        </p>
      </div>

      <div className="grid gap-1">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${encodeURIComponent(category.slug)}`}
            className="rounded-xl px-3 py-2.5 text-sm text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#7C3AED]"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/app/components/home/CategoryCard";

type Category = { slug: string; name: string; image?: string };

export default function PopularCategories() {
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
    <section aria-labelledby="popular-categories-title" className="mt-10 sm:mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">انتخاب سریع</p>
          <h2 id="popular-categories-title" className="text-xl font-extrabold text-[#111827] sm:text-2xl">
            همه دسته‌بندی‌ها
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            title={category.name}
            image={category.image}
            href={`/products?category=${encodeURIComponent(category.slug)}`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";

const productCategories = [
  {
    title: "پوشاک",
    href: "/products?category=clothing",
  },
  {
    title: "ساعت و اکسسوری",
    href: "/products?category=watches-accessories",
  },
  {
    title: "لوازم دیجیتال",
    href: "/products?category=digital",
  },
  {
    title: "مواد غذایی",
    href: "/products?category=food",
  },
  {
    title: "قهوه و نوشیدنی",
    href: "/products?category=coffee-drinks",
  },
  {
    title: "لوازم خانه",
    href: "/products?category=home",
  },
  {
    title: "زیبایی و سلامت",
    href: "/products?category=beauty-health",
  },
  {
    title: "کتاب و لوازم فرهنگی",
    href: "/products?category=books",
  },
  {
    title: "ورزش و سفر",
    href: "/products?category=sport-travel",
  },
  {
    title: "سایر محصولات",
    href: "/products?category=other",
  },
];

export default function CategoryDropdown() {
  return (
    <div className="invisible pointer-events-none absolute right-full top-0 w-64 -translate-x-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover/product:pointer-events-auto group-hover/product:visible group-hover/product:translate-x-0 group-hover/product:opacity-100">
      <div className="mb-2 border-b border-[#E5E7EB] px-3 py-2">
        <p className="text-xs font-medium text-[#6B7280]">
          دسته‌بندی محصولات
        </p>
      </div>

      <div className="grid gap-1">
        {productCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="rounded-xl px-3 py-2.5 text-sm text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#7C3AED]"
          >
            {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
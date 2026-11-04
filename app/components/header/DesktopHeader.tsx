"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";
import CategoryDropdown from "@/app/components/header/CategoryDropdown";

const navigationItems = [
  {
    title: "صفحه اصلی",
    href: "/",
  },
  {
    title: "محصولات",
    href: "/products",
    hasCategories: true,
  },
  {
    title: "درباره ما",
    href: "/about",
  },
  {
    title: "تماس با ما",
    href: "/contact",
  },
];

export default function DesktopHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <div className="relative hidden h-24 items-center justify-between px-6 lg:flex xl:px-12">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="group/menu relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] transition hover:border-[#2563EB] hover:bg-[#F8FAFC] hover:text-[#2563EB] ${
              menuOpen ? "border-[#2563EB] text-[#2563EB]" : ""
            }`}
          >
            <Menu size={22} />
          </button>

          <div
            className={`absolute right-0 top-full z-[60] mt-3 w-60 overflow-visible rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl transition-all duration-200 ${
              menuOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible translate-y-2 opacity-0"
            }`}
          >
            {navigationItems.map((item) => (
              <div key={item.title} className="group/product relative">
                {item.hasCategories ? (
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((open) => !open)}
                    aria-expanded={categoriesOpen}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-right text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                  >
                    <span>{item.title}</span>
                    <ChevronLeft
                      aria-hidden="true"
                      size={16}
                      className={`shrink-0 text-[#7C3AED] transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                  >
                    <span>{item.title}</span>
                  </Link>
                )}

                {item.hasCategories && categoriesOpen ? (
                  <CategoryDropdown variant="desktop" onNavigate={() => {
                    setCategoriesOpen(false);
                    setMenuOpen(false);
                  }} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="absolute left-6 top-1/2 flex size-21 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 border-[#FED7AA] bg-white shadow-md xl:left-10"
        aria-label="صفحه اصلی"
      >
        <Image
          src="/logo/IMG_20261104_175835_543.jpg"
          alt="لوگوی روشن سپهر آماد صنعت"
          width={890}
          height={1280}
          className="size-full object-cover [object-position:center_20%]"
        />
      </Link>

    </div>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import CategoryDropdown from "@/app/components/header/CategoryDropdown";
import CartCount from "@/app/components/header/CartCount";

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

  return (
    <div className="hidden h-24 items-center justify-between px-6 lg:flex xl:px-12">
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
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
                >
                  <span>{item.title}</span>

                  {item.hasCategories && (
                    <ChevronLeft
                      aria-hidden="true"
                      size={16}
                      className="shrink-0 text-[#7C3AED]"
                    />
                  )}
                </Link>

                {item.hasCategories && <CategoryDropdown />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center */}
      <Link
        href="/"
        className="absolute left-1/2 flex -translate-x-1/2 items-center py-2"
        aria-label="صفحه اصلی"
      >
        <div className="flex items-center gap-2">
          <Image
            src="/logo/IMG_20260918_171528_557.jpg"
            alt="لوگوی فروشگاه"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          aria-label="سبد خرید"
          className="relative flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
        >
          <ShoppingCart size={20} />

          <span>سبد خرید</span>

          <CartCount />
        </Link>

        <Link
          href="/auth"
          aria-label="ورود و ثبت نام"
          className="flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
        >
          <User size={19} />

          <span>ورود به فروشگاه</span>
        </Link>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Grid2X2, Home, ShoppingCart, User } from "lucide-react";

interface MobileBottomNavProps {
  categoriesOpen: boolean;
  onCategoriesToggle: () => void;
}

const navigationItems = [
  {
    title: "خانه",
    href: "/",
    icon: Home,
  },
  {
    title: "دسته‌بندی",
    icon: Grid2X2,
  },
  {
    title: "سبد خرید",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "پروفایل",
    href: "/auth",
    icon: User,
  },
];

export default function MobileBottomNav({
  categoriesOpen,
  onCategoriesToggle,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(17,24,39,0.08)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (!item.href) {
            return (
              <button
                key={item.title}
                type="button"
                onClick={onCategoriesToggle}
                aria-label="نمایش دسته‌بندی‌ها"
                aria-expanded={categoriesOpen}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition ${
                  categoriesOpen
                    ? "text-[#7C3AED]"
                    : "text-[#6B7280] hover:text-[#2563EB]"
                }`}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                <span>{item.title}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-[#6B7280] transition hover:text-[#2563EB]"
            >
              <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

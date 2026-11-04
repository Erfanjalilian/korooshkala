"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import MobileMenu from "@/app/components/header/MobileMenu";
import MobileBottomNav from "@/app/components/header/MobileBottomNav";
import MobileCategories from "@/app/components/header/MobileCategories";
import { useState } from "react";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export default function MobileHeader({
  isMenuOpen,
  onMenuToggle,
}: MobileHeaderProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex h-[88px] items-center justify-between px-4">
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <Link href="/" aria-label="صفحه اصلی" className="flex shrink-0 items-center py-2">
            <Image
              src="/logo/kourosh-steel.svg"
              alt="لوگوی کوروش کالا، فروش آهن‌آلات"
              width={64}
              height={64}
              className="size-16"
            />
          </Link>
        </div>

      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={onMenuToggle} />
      <MobileCategories
        isOpen={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
      <MobileBottomNav
        categoriesOpen={categoriesOpen}
        onCategoriesToggle={() => setCategoriesOpen((prev) => !prev)}
      />
    </div>
  );
}
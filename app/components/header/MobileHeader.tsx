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
      <div className="relative flex h-[78px] items-center justify-between px-4">
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

        </div>
        <Link
          href="/"
          aria-label="صفحه اصلی"
          className="absolute left-4 top-1/2 flex size-[4.5rem] -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 border-[#FED7AA] bg-white shadow-md"
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
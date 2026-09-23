"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import MobileMenu from "@/app/components/header/MobileMenu";
import MobileBottomNav from "@/app/components/header/MobileBottomNav";
import MobileCategories from "@/app/components/header/MobileCategories";
import { useState } from "react";
import CartCount from "@/app/components/header/CartCount";
import { useStoredAuthUser } from "@/app/components/auth/auth-storage";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export default function MobileHeader({
  isMenuOpen,
  onMenuToggle,
}: MobileHeaderProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const authUser = useStoredAuthUser();

  return (
    <div className="lg:hidden">
      <div className="relative flex h-[88px] items-center justify-between px-4">
        {/* Left */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Center */}
        <Link
          href="/"
          aria-label="صفحه اصلی"
          className="absolute left-1/2 flex -translate-x-1/2 items-center py-2"
        >
          <Image
            src="/logo/IMG_20260918_171528_557.jpg"
            alt="لوگوی فروشگاه"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href={authUser ? "/account" : "/auth"}
            aria-label={authUser?.phone || "ورود و ثبت نام"}
            className="relative flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] px-3 text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <User size={19} />
            {authUser ? <span dir="ltr" className="text-xs font-semibold">{authUser.phone}</span> : null}
          </Link>

          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <ShoppingCart size={19} />

            <CartCount />
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
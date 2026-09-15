"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 top-16 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-[85%] max-w-sm overflow-y-auto border-l border-[#E5E7EB] bg-white p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              منوی سایت
            </h2>

            <p className="mt-1 text-xs text-[#6B7280]">
              دسترسی سریع به بخش‌های سایت
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          >
            صفحه اصلی
          </Link>

          <Link
            href="/products"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          >
            محصولات
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          >
            درباره ما
          </Link>

          <Link
            href="/contact"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#F8FAFC] hover:text-[#2563EB]"
          >
            تماس با ما
          </Link>
        </nav>
      </aside>
    </>
  );
}
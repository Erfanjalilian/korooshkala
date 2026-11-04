"use client";

import { X } from "lucide-react";
import CategoryDropdown from "@/app/components/header/CategoryDropdown";

interface MobileCategoriesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategories({
  isOpen,
  onClose,
}: MobileCategoriesProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="بستن دسته‌بندی‌ها"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
      />

      <section
        aria-label="دسته‌بندی محصولات"
        className="fixed inset-x-3 bottom-[5.75rem] z-50 max-h-[min(70vh,30rem)] overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xl lg:hidden"
      >
        <div className="mb-3 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h2 className="text-base font-bold text-[#111827]">
            دسته‌بندی محصولات
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن دسته‌بندی‌ها"
            className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] transition hover:bg-[#F8FAFC] hover:text-[#111827]"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <CategoryDropdown variant="inline" onNavigate={onClose} />
      </section>
    </>
  );
}

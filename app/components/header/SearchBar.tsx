"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="border-t border-[#E5E7EB] bg-white px-4 py-3">
      <div className="relative">
        <Search
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />

        <input
          type="search"
          placeholder="جستجوی محصولات..."
          aria-label="جستجوی محصولات"
          className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pr-11 pl-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10"
        />
      </div>
    </div>
  );
}
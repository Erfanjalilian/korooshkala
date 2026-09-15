import { Search } from "lucide-react";

export default function HeroSearch() {
  return (
    <form
      action="/products"
      method="get"
      className="relative w-full max-w-lg"
      role="search"
    >
      <button
        type="submit"
        aria-label="جستجوی محصولات"
        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#6B7280] transition hover:bg-[#F5F7FA] hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <Search aria-hidden="true" size={20} />
      </button>
      <input
        type="search"
        name="q"
        placeholder="جستجوی محصولات..."
        aria-label="جستجوی محصولات"
        className="h-12 w-full rounded-2xl border border-white/70 bg-white pr-14 pl-4 text-sm text-[#111827] shadow-[0_8px_24px_rgba(17,24,39,0.08)] outline-none transition placeholder:text-[#9CA3AF] focus:border-white focus:ring-4 focus:ring-white/25"
      />
    </form>
  );
}
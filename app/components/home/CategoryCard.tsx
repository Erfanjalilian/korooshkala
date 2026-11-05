import Link from "next/link";
import { ChevronDown, Package, type LucideIcon } from "lucide-react";
import type { CategorySubcategoryGroup } from "@/lib/store";

interface CategoryCardProps {
  title: string;
  href: string;
  icon?: LucideIcon;
  image?: string;
  subcategories?: CategorySubcategoryGroup[];
  subcategoriesExpanded?: boolean;
  onSubcategoriesToggle?: () => void;
}

export default function CategoryCard({
  title,
  href,
  icon: Icon = Package,
  image,
  subcategories,
  subcategoriesExpanded = false,
  onSubcategoriesToggle,
}: CategoryCardProps) {
  return (
    <article className="category-card group flex min-w-0 flex-col items-center gap-3 rounded-2xl px-1 py-2 text-center">
      <Link
        href={href}
        className="flex flex-col items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
      >
        <span className="flex size-20 items-center justify-center rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFF7ED] to-[#E0F2FE] text-[#EA580C] shadow-[0_4px_16px_rgba(234,88,12,0.1)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#F97316] group-hover:text-[#C2410C] group-hover:shadow-[0_8px_20px_rgba(249,115,22,0.2)] sm:size-24">
          {image ? <img src={image} alt="" className="size-full rounded-2xl object-cover" /> : <Icon aria-hidden="true" size={28} strokeWidth={1.8} />}
        </span>
        <span className="text-sm font-semibold leading-6 text-[#111827] transition-colors group-hover:text-[#7C3AED]">
          {title}
        </span>
      </Link>
      {subcategories?.length && onSubcategoriesToggle ? (
        <button
          type="button"
          onClick={onSubcategoriesToggle}
          aria-expanded={subcategoriesExpanded}
          className="inline-flex items-center gap-1 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-semibold text-[#C2410C] transition hover:border-[#F97316] hover:text-[#EA580C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
        >
          زیرمجموعه‌ها
          <ChevronDown
            aria-hidden="true"
            size={13}
            className={`transition-transform ${subcategoriesExpanded ? "rotate-180" : ""}`}
          />
        </button>
      ) : null}
    </article>
  );
}
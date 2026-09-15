import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
}

export default function CategoryCard({
  title,
  href,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col items-center gap-3 rounded-2xl px-1 py-2 text-center outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
    >
      <span className="flex size-[4.5rem] items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_16px_rgba(17,24,39,0.04)] transition-all duration-200 group-hover:border-[#7C3AED] group-hover:bg-[#F8FAFC] group-hover:text-[#7C3AED] group-hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] sm:size-20">
        <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
      </span>
      <span className="text-sm font-semibold leading-6 text-[#111827] transition-colors group-hover:text-[#7C3AED]">
        {title}
      </span>
    </Link>
  );
}
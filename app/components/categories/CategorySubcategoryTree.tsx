"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CategorySubcategory, CategorySubcategoryGroup } from "@/lib/store";

function SubcategoryNode({
  categorySlug,
  item,
  onNavigate,
}: {
  categorySlug: string;
  item: CategorySubcategory;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!item.items?.length) {
    return (
      <Link
        href={`/products?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(item.slug)}`}
        onClick={onNavigate}
        className="block rounded-lg px-2.5 py-2 text-xs text-[#475569] transition hover:bg-[#FFF4E6] hover:text-[#C2410C]"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-right text-xs font-semibold text-[#334155] transition hover:bg-[#FFF4E6] hover:text-[#C2410C]"
      >
        {item.name}
        <ChevronDown
          aria-hidden="true"
          size={14}
          className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded ? (
        <div className="mr-3 mt-1 grid gap-0.5 border-r border-[#FED7AA] pr-2">
          {item.items.map((child) => (
            <SubcategoryNode
              key={child.slug}
              categorySlug={categorySlug}
              item={child}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CategorySubcategoryTree({
  categorySlug,
  groups,
  onNavigate,
}: {
  categorySlug: string;
  groups: CategorySubcategoryGroup[];
  onNavigate?: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <section key={group.slug}>
          <h4 className="mb-1 px-2.5 py-1 text-xs font-bold text-[#78716C]">
            {group.name}
          </h4>
          <div className="grid gap-0.5">
            {group.items.map((item) => (
              <SubcategoryNode
                key={item.slug}
                categorySlug={categorySlug}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

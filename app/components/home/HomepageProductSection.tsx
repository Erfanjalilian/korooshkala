"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice: number;
  image?: string;
  tags: string[];
  isBestSelling?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isDiscounted?: boolean;
};

type ProductFlag = "isBestSelling" | "isDiscounted" | "isNew" | "isHot";

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

export default function HomepageProductSection({
  flag,
  eyebrow,
  title,
  badge,
  href,
}: {
  flag: ProductFlag;
  eyebrow: string;
  title: string;
  badge: string;
  href: string;
}) {
  const productsRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { products?: Product[] } | null) => {
        if (!active) return;
        const allProducts = result?.products ?? [];
        setProducts(
          allProducts.filter((product) =>
            flag === "isBestSelling"
              ? product.isBestSelling || product.tags.includes("پرفروش")
              : Boolean(product[flag]),
          ),
        );
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => {
      active = false;
    };
  }, [flag]);

  const scrollProducts = (direction: "left" | "right") => {
    productsRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={`${flag}-title`} className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">
            {eyebrow}
          </p>
          <h2
            id={`${flag}-title`}
            className="text-xl font-extrabold text-[#111827] sm:text-2xl"
          >
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#2563EB] transition hover:text-[#7C3AED]"
        >
          مشاهده همه
          <ArrowLeft aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="relative" dir="ltr">
        <button
          type="button"
          onClick={() => scrollProducts("left")}
          aria-label="نمایش محصولات قبلی"
          className="absolute left-0 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </button>

        <div
          ref={productsRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${encodeURIComponent(product.slug)}`}
              dir="rtl"
              className="group w-[min(78vw,17rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#7C3AED] hover:shadow-[0_10px_24px_rgba(124,58,237,0.1)] sm:w-64"
            >
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#DBEAFE] to-[#F5F7FA]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-white/80 text-[#2563EB] shadow-sm transition group-hover:text-[#7C3AED]">
                    <Package aria-hidden="true" size={42} strokeWidth={1.5} />
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-[#7C3AED] px-2.5 py-1 text-[10px] font-bold text-white">
                  {badge}
                </span>
              </div>
              <div className="p-4">
                <p className="truncate text-xs font-medium text-[#7C3AED]">
                  {product.category || product.brand}
                </p>
                <h3 className="mt-1 truncate text-sm font-bold text-[#111827]">
                  {product.name}
                </h3>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="text-sm font-extrabold text-[#2563EB]">
                    {formatPrice(product.price)}
                  </span>
                  {flag === "isDiscounted" ? (
                    <del className="text-[10px] text-[#9CA3AF]">
                      {formatPrice(product.compareAtPrice)}
                    </del>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollProducts("right")}
          aria-label="نمایش محصولات بعدی"
          className="absolute right-0 top-1/2 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
        >
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}
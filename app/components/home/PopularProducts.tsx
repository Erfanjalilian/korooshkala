"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Headphones, LampDesk, Shirt, Watch } from "lucide-react";

const popularProducts = [
  {
    title: "هدفون بی‌سیم پرو",
    slug: "هدفون-بی-سیم-پرو",
    category: "لوازم دیجیتال",
    price: "۲٬۴۹۰٬۰۰۰ تومان",
    oldPrice: "۲٬۸۰۰٬۰۰۰ تومان",
    icon: Headphones,
    accent: "from-[#DBEAFE] to-[#EEF2FF]",
  },
  {
    title: "ساعت کلاسیک مینیمال",
    slug: "ساعت-کلاسیک-مینیمال",
    category: "ساعت و اکسسوری",
    price: "۱٬۸۹۰٬۰۰۰ تومان",
    oldPrice: "۲٬۱۵۰٬۰۰۰ تومان",
    icon: Watch,
    accent: "from-[#EDE9FE] to-[#F5F3FF]",
  },
  {
    title: "چراغ مطالعه مدرن",
    slug: "چراغ-مطالعه-مدرن",
    category: "لوازم خانه",
    price: "۸۹۰٬۰۰۰ تومان",
    oldPrice: "۱٬۰۵۰٬۰۰۰ تومان",
    icon: LampDesk,
    accent: "from-[#E0E7FF] to-[#F5F7FA]",
  },
  {
    title: "پیراهن روزمره کتان",
    slug: "پیراهن-روزمره-کتان",
    category: "پوشاک",
    price: "۶۹۰٬۰۰۰ تومان",
    oldPrice: "۸۲۰٬۰۰۰ تومان",
    icon: Shirt,
    accent: "from-[#EDE9FE] to-[#EEF2FF]",
  },
  {
    title: "هدفون سبک روزانه",
    slug: "هدفون-بی-سیم-پرو",
    category: "لوازم دیجیتال",
    price: "۱٬۲۹۰٬۰۰۰ تومان",
    oldPrice: "۱٬۴۹۰٬۰۰۰ تومان",
    icon: Headphones,
    accent: "from-[#DBEAFE] to-[#F5F7FA]",
  },
];

export default function PopularProducts() {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: "left" | "right") => {
    productsRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby="popular-products-title" className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">
            انتخاب مشتری‌ها
          </p>
          <h2
            id="popular-products-title"
            className="text-xl font-extrabold text-[#111827] sm:text-2xl"
          >
            پرفروش‌ترین محصولات
          </h2>
        </div>
        <Link
          href="/products"
          className="shrink-0 text-sm font-semibold text-[#2563EB] transition hover:text-[#7C3AED]"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="relative" dir="ltr">
        <button
          type="button"
          onClick={() => scrollProducts("left")}
          aria-label="نمایش محصولات قبلی"
          className="absolute left-0 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </button>

        <div
          ref={productsRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {popularProducts.map((product) => {
            const Icon = product.icon;

            return (
              <Link
                key={product.title}
                href={`/products/${encodeURIComponent(product.slug)}`}
                dir="rtl"
                className="group w-[min(78vw,17rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#7C3AED] hover:shadow-[0_10px_24px_rgba(124,58,237,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] sm:w-64"
              >
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${product.accent}`}>
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-white/80 text-[#2563EB] shadow-sm backdrop-blur-sm transition group-hover:text-[#7C3AED]">
                    <Icon aria-hidden="true" size={42} strokeWidth={1.5} />
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-[#7C3AED] px-2.5 py-1 text-[10px] font-bold text-white">
                    پیشنهاد ویژه
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-[#7C3AED]">{product.category}</p>
                  <h3 className="mt-1 truncate text-sm font-bold text-[#111827]">
                    {product.title}
                  </h3>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <span className="text-sm font-extrabold text-[#2563EB]">
                      {product.price}
                    </span>
                    <del className="text-[10px] text-[#9CA3AF]">{product.oldPrice}</del>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollProducts("right")}
          aria-label="نمایش محصولات بعدی"
          className="absolute right-0 top-1/2 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Laptop,
  Sparkles,
  Watch,
} from "lucide-react";

const specialOffers = [
  {
    title: "لپ‌تاپ سبک و سریع",
    slug: "لپ-تاپ-باریک-نسل-جدید",
    category: "لوازم دیجیتال",
    price: "۲۴٬۹۰۰٬۰۰۰ تومان",
    oldPrice: "۲۸٬۵۰۰٬۰۰۰ تومان",
    discount: "۱۳٪ تخفیف",
    icon: Laptop,
    accent: "from-[#DBEAFE] to-[#EEF2FF]",
  },
  {
    title: "ساعت هوشمند روزمره",
    slug: "ساعت-هوشمند-اسپرت",
    category: "ساعت و اکسسوری",
    price: "۳٬۴۹۰٬۰۰۰ تومان",
    oldPrice: "۴٬۲۰۰٬۰۰۰ تومان",
    discount: "۱۷٪ تخفیف",
    icon: Watch,
    accent: "from-[#EDE9FE] to-[#F5F3FF]",
  },
  {
    title: "قهوه تازه‌برشت",
    slug: "قهوه-تک-خاستگاه-تازه",
    category: "قهوه و نوشیدنی",
    price: "۴۹۰٬۰۰۰ تومان",
    oldPrice: "۶۲۰٬۰۰۰ تومان",
    discount: "۲۱٪ تخفیف",
    icon: Coffee,
    accent: "from-[#F5F7FA] to-[#E0E7FF]",
  },
  {
    title: "ست مراقبت و زیبایی",
    slug: "ست-مراقبت-پوست-جدید",
    category: "زیبایی و سلامت",
    price: "۱٬۱۹۰٬۰۰۰ تومان",
    oldPrice: "۱٬۵۰۰٬۰۰۰ تومان",
    discount: "۲۰٪ تخفیف",
    icon: Sparkles,
    accent: "from-[#EEF2FF] to-[#EDE9FE]",
  },
  {
    title: "اسپیکر قابل حمل",
    slug: "اسپیکر-رومیزی-هوشمند",
    category: "لوازم دیجیتال",
    price: "۱٬۷۹۰٬۰۰۰ تومان",
    oldPrice: "۲٬۱۰۰٬۰۰۰ تومان",
    discount: "۱۵٪ تخفیف",
    icon: Laptop,
    accent: "from-[#DBEAFE] to-[#F5F7FA]",
  },
  {
    title: "ساعت بند چرمی",
    slug: "ساعت-کلاسیک-مینیمال",
    category: "ساعت و اکسسوری",
    price: "۱٬۴۹۰٬۰۰۰ تومان",
    oldPrice: "۱٬۸۰۰٬۰۰۰ تومان",
    discount: "۱۷٪ تخفیف",
    icon: Watch,
    accent: "from-[#EDE9FE] to-[#EEF2FF]",
  },
  {
    title: "قهوه اسپرسو ویژه",
    slug: "قهوه-تک-خاستگاه-تازه",
    category: "قهوه و نوشیدنی",
    price: "۳۹۰٬۰۰۰ تومان",
    oldPrice: "۵۲۰٬۰۰۰ تومان",
    discount: "۲۵٪ تخفیف",
    icon: Coffee,
    accent: "from-[#F5F7FA] to-[#DBEAFE]",
  },
  {
    title: "ست ابزار مراقبت پوست",
    slug: "ست-مراقبت-پوست-جدید",
    category: "زیبایی و سلامت",
    price: "۸۹۰٬۰۰۰ تومان",
    oldPrice: "۱٬۱۰۰٬۰۰۰ تومان",
    discount: "۱۹٪ تخفیف",
    icon: Sparkles,
    accent: "from-[#F5F3FF] to-[#EDE9FE]",
  },
];

export default function SpecialOffers() {
  const offersRef = useRef<HTMLDivElement>(null);

  const scrollOffers = (direction: "left" | "right") => {
    offersRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby="special-offers-title" className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">
            فرصت محدود
          </p>
          <h2
            id="special-offers-title"
            className="text-xl font-extrabold text-[#111827] sm:text-2xl"
          >
            تخفیف‌های ویژه
          </h2>
        </div>
        <Link
          href="/products?discounted=true"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#2563EB] transition hover:text-[#7C3AED]"
        >
          همه تخفیف‌ها
          <ArrowLeft aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="relative" dir="ltr">
        <button
          type="button"
          onClick={() => scrollOffers("left")}
          aria-label="نمایش تخفیف‌های قبلی"
          className="absolute left-0 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </button>

        <div
          ref={offersRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {specialOffers.map((product) => {
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
                    {product.discount}
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
          onClick={() => scrollOffers("right")}
          aria-label="نمایش تخفیف‌های بعدی"
          className="absolute right-0 top-1/2 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(17,24,39,0.1)] transition hover:border-[#7C3AED] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}

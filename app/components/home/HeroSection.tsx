import Link from "next/link";
import { ArrowLeft, Package, ShoppingBag, Sparkles } from "lucide-react";
import HeroSearch from "@/app/components/home/HeroSearch";
import PopularCategories from "@/app/components/home/PopularCategories";
import PopularProducts from "@/app/components/home/PopularProducts";
import PromoBanner from "@/app/components/home/PromoBanner";
import ServiceBanner from "@/app/components/home/ServiceBanner";
import SpecialOffers from "@/app/components/home/SpecialOffers";
import NewestProducts from "@/app/components/home/NewestProducts";
import HottestProducts from "@/app/components/home/HottestProducts";
import FinalBanner from "@/app/components/home/FinalBanner";
import PopularBrands from "@/app/components/home/PopularBrands";

export default function HeroSection() {
  const heroImage = "/logo/IMG_20260918_171528_557.JPG";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section
        className="relative isolate overflow-hidden rounded-[2rem] bg-cover bg-center bg-no-repeat px-6 py-5 text-white shadow-[0_18px_45px_rgba(37,99,235,0.18)] sm:px-10 sm:py-7 lg:min-h-[12.5rem] lg:px-16 lg:py-8"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >
        {/* Overlay برای خوانایی متن */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l from-black/60 via-black/35 to-black/20" />

        {/* افکت نور روی عکس */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,white_0,transparent_28%),radial-gradient(circle_at_90%_80%,white_0,transparent_32%)]" />

        <div className="pointer-events-none absolute -left-16 -top-20 -z-10 size-56 rounded-full border border-white/15 bg-white/5 sm:size-72" />

        <div className="pointer-events-none absolute -bottom-32 right-1/3 -z-10 size-72 rounded-full border border-white/10 bg-white/5" />

        <div className="relative z-10 flex max-w-2xl flex-col items-start">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
            <Sparkles aria-hidden="true" size={14} />
            تجربه‌ای تازه برای خرید
          </span>

          <h1 className="max-w-xl text-3xl font-extrabold leading-[1.35] sm:text-4xl lg:text-5xl">
            هر چیزی که نیاز داری، همینجاست
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
            به دنیای محصولات متنوع ما سر بزن و محصول مورد علاقه‌ات را پیدا کن.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#2563EB] transition hover:bg-[#F8FAFC] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            مشاهده محصولات
            <ArrowLeft aria-hidden="true" size={18} />
          </Link>

          <div className="mt-7 w-full lg:mt-8">
            <HeroSearch />
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block"
          aria-hidden="true"
        >
          <div className="relative flex size-64 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <div className="absolute inset-5 rounded-full border border-white/15" />

            <div className="flex size-28 items-center justify-center rounded-[2rem] bg-white text-[#2563EB] shadow-2xl shadow-[#111827]/20">
              <ShoppingBag size={58} strokeWidth={1.4} />
            </div>

            <div className="absolute right-3 top-8 flex size-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Package size={24} />
            </div>
          </div>
        </div>
      </section>

      <PopularCategories />
      <PromoBanner />
      <PopularProducts />
      <ServiceBanner />
      <SpecialOffers />
      <NewestProducts />
      <HottestProducts />
      <FinalBanner />
      <PopularBrands />
    </div>
  );
}
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";

export default function FinalBanner() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#2563EB] to-[#7C3AED] px-6 py-9 text-white shadow-[0_16px_38px_rgba(37,99,235,0.18)] sm:mt-12 sm:px-10 sm:py-11">
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_10%_20%,white_0,transparent_28%),radial-gradient(circle_at_90%_80%,white_0,transparent_32%)]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full border border-white/15 bg-white/5" />

      <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-white/85">
            <Sparkles aria-hidden="true" size={15} />
            انتخاب بعدی تو آماده است
          </span>
          <h2 className="mt-2 text-2xl font-extrabold leading-9 sm:text-3xl">
            خرید بعدی‌ات را همین حالا شروع کن
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            از میان هزاران محصول متنوع، چیزی را که دوست داری سریع و راحت پیدا کن.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 sm:flex">
            <ShoppingBag aria-hidden="true" size={32} strokeWidth={1.5} />
          </div>
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#2563EB] transition hover:bg-[#F5F7FA] hover:text-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            مشاهده محصولات
            <ArrowLeft aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

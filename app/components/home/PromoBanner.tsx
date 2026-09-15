import Link from "next/link";
import { ArrowLeft, BadgePercent, Gift } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="relative isolate mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white px-6 py-7 shadow-[0_8px_28px_rgba(17,24,39,0.05)] sm:mt-12 sm:px-10 sm:py-9">
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/5 bg-gradient-to-r from-[#EEF2FF] to-transparent" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 -z-10 size-40 rounded-full bg-[#EDE9FE] opacity-70 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2563EB]">
            <BadgePercent aria-hidden="true" size={25} strokeWidth={1.8} />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold text-[#7C3AED]">
              پیشنهاد ویژه امروز
            </p>
            <h2 className="text-xl font-extrabold text-[#111827] sm:text-2xl">
              خرید بهتر، با تخفیف بیشتر
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              محصولات منتخب را با پیشنهادهای ویژه و ارسال سریع تهیه کنید.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="hidden size-14 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8FAFC] text-[#7C3AED] sm:flex">
            <Gift aria-hidden="true" size={25} strokeWidth={1.7} />
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20"
          >
            مشاهده پیشنهادها
            <ArrowLeft aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

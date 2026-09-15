import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export default function ServiceBanner() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl bg-[#F5F7FA] px-6 py-7 sm:mt-12 sm:px-10 sm:py-9">
      <div className="pointer-events-none absolute -left-12 -top-16 size-48 rounded-full bg-[#DBEAFE] opacity-70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/3 size-56 rounded-full bg-[#EDE9FE] opacity-70 blur-3xl" />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
            <ShieldCheck aria-hidden="true" size={15} />
            خریدی مطمئن و راحت
          </span>
          <h2 className="mt-2 text-xl font-extrabold leading-8 text-[#111827] sm:text-2xl">
            انتخاب کن، سفارش بده، با خیال راحت تحویل بگیر
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            محصولات مورد علاقه‌ات را از فروشگاه ما پیدا کن و از تجربه‌ای سریع و مطمئن لذت ببر.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-sm">
              <Truck aria-hidden="true" size={23} strokeWidth={1.8} />
            </span>
            ارسال سریع سفارش‌ها
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20"
          >
            شروع خرید
            <ArrowLeft aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

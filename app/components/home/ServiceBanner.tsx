import Link from "next/link";
import { ArrowLeft, Factory, Truck } from "lucide-react";

export default function ServiceBanner() {
  return (
    <section
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-[#52525B] bg-cover bg-center px-6 py-7 sm:mt-12 sm:px-10 sm:py-9"
      style={{ backgroundImage: "url('/banners/steel-delivery.svg')" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-transparent" />
      <div dir="ltr" className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div dir="rtl" className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-300">
            <Factory aria-hidden="true" size={15} />
            همراه تأمین پروژه‌های عمرانی
          </span>
          <h2 className="mt-2 text-xl font-extrabold leading-8 text-white sm:text-2xl">
            از انتخاب مقطع تا هماهنگی ارسال بار
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            انواع آهن‌آلات ساختمانی و صنعتی را بررسی کنید و برای استعلام و هماهنگی تحویل با ما تماس بگیرید.
          </p>
        </div>

        <div dir="rtl" className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-orange-300">
              <Truck aria-hidden="true" size={23} strokeWidth={1.8} />
            </span>
            هماهنگی ارسال به محل پروژه
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/30"
          >
            مشاهده مقاطع فولادی
            <ArrowLeft aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

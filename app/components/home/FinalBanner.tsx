import Link from "next/link";
import { ArrowLeft, Boxes, Sparkles } from "lucide-react";

export default function FinalBanner() {
  return (
    <section
      className="relative isolate mt-10 overflow-hidden rounded-[2rem] border border-[#52525B] bg-cover bg-center px-6 py-9 text-white sm:mt-12 sm:px-10 sm:py-11"
      style={{ backgroundImage: "url('/banners/steel-project.svg')" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-transparent" />
      <div dir="ltr" className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div dir="rtl" className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-300">
            <Sparkles aria-hidden="true" size={15} />
            تأمین آهن‌آلات پروژه
          </span>
          <h2 className="mt-2 text-2xl font-extrabold leading-9 sm:text-3xl">
            برای ساخت‌وساز، از مقطع مناسب شروع کنید
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            دسته‌بندی آهن‌آلات را ببینید، مشخصات را مقایسه کنید و برای ثبت سفارش و استعلام تماس بگیرید.
          </p>
        </div>

        <div dir="rtl" className="flex items-center gap-4">
          <div className="hidden size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-orange-300 sm:flex">
            <Boxes aria-hidden="true" size={32} strokeWidth={1.5} />
          </div>
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/30"
          >
            مشاهده دسته‌بندی‌ها
            <ArrowLeft aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

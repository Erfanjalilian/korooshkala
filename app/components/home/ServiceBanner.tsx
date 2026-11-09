import { Factory, Truck } from "lucide-react";
import Image from "next/image";

export default function ServiceBanner() {
  return (
    <section
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-[#52525B] bg-cover bg-center px-6 py-7 sm:mt-12 sm:px-10 sm:py-9"
    >
      <Image
        src="/Images/IMG_20261108_182514_110.jpg"
        alt=""
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="-z-20 object-cover"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-transparent" />
      <div dir="ltr" className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div dir="rtl" className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-300">
            <Factory aria-hidden="true" size={15} />
            همراه تأمین پروژه‌های عمرانی
          </span>
          <h2 className="mt-2 text-xl font-extrabold leading-8 text-white sm:text-2xl">
            از انتخاب مقطع تا هماهنگی ارسال، از یک کیلو تا .....
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            انواع متریال ساختمانی و صنعتی را بررسی کنید و برای استعلام و هماهنگی تحویل با ما تماس بگیرید.
          </p>
        </div>

        <div dir="rtl">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-orange-300">
              <Truck aria-hidden="true" size={23} strokeWidth={1.8} />
            </span>
            هماهنگی ارسال به محل پروژه
          </div>
        </div>
      </div>
    </section>
  );
}

import { BadgeCheck } from "lucide-react";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-[#52525B] bg-cover bg-center px-6 py-7 shadow-[0_8px_28px_rgba(0,0,0,0.25)] sm:mt-12 sm:px-10 sm:py-9"
    >
      <Image
        src="/Images/IMG_20261108_182513_821.jpg"
        alt=""
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="-z-20 object-cover"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-transparent" />
      <div dir="ltr" className="relative z-10 flex flex-col gap-6">
        <div dir="rtl" className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-400/10 text-orange-300">
            <BadgeCheck aria-hidden="true" size={25} strokeWidth={1.8} />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold text-orange-300">
              تأمین تخصصی آلومینیوم
            </p>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              مقاطع آلومینیومی موردنیاز پروژه‌تان را پیدا کنید
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
              مشخصات و قیمت روز انواع مقاطع و ورق آلومینیومی را بررسی کنید.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

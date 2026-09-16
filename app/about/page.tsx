import Link from "next/link";
import { ArrowLeft, Check, Heart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { readPages } from "@/lib/store";

const values = [
  {
    title: "انتخاب مطمئن",
    description: "محصولات متنوع را با اطلاعات شفاف و جزئیات کامل بررسی کنید.",
    icon: ShieldCheck,
  },
  {
    title: "تجربه ساده",
    description: "از جست‌وجو تا ثبت سفارش، مسیر خرید را برای شما کوتاه و روشن کرده‌ایم.",
    icon: Sparkles,
  },
  {
    title: "همراه مشتری",
    description: "رضایت شما برای ما مهم است و همیشه برای بهتر شدن گوش می‌دهیم.",
    icon: Heart,
  },
];

const highlights = [
  "دسته‌بندی‌های متنوع برای سبک‌های مختلف زندگی",
  "قیمت‌گذاری شفاف و اطلاعات کامل محصولات",
  "پشتیبانی همراه در مسیر خرید",
];

export default async function AboutPage() {
  const { about } = await readPages();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#2563EB] to-[#7C3AED] px-6 py-10 text-white shadow-[0_16px_38px_rgba(37,99,235,0.16)] sm:px-10 sm:py-14 lg:px-16">
        <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full border border-white/15 bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 size-80 rounded-full border border-white/10 bg-white/5" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-bold text-white/75">داستان فروشگاه من</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl lg:text-5xl">
            {about.title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
            {about.description}
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <article className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-9">
          <div className="flex items-center gap-3 text-[#2563EB]">
            <Users aria-hidden="true" size={22} />
            <h2 className="text-xl font-extrabold text-[#111827]">ما چه کاری انجام می‌دهیم؟</h2>
          </div>
          <p className="mt-5 text-sm leading-8 text-[#6B7280]">
            ما محصولات مختلف را در دسته‌بندی‌های کاربردی کنار هم جمع کرده‌ایم تا بتوانید بدون پیچیدگی، گزینه مناسب خود را پیدا کنید. هدف ما ساختن تجربه‌ای است که در آن مقایسه، انتخاب و خرید حس خوبی داشته باشد.
          </p>
          <div className="mt-6 grid gap-3">
            {highlights.map((highlight) => (
              <p key={highlight} className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2563EB]">
                  <Check aria-hidden="true" size={15} />
                </span>
                {highlight}
              </p>
            ))}
          </div>
        </article>

        <div className="rounded-3xl bg-[#F5F7FA] p-6 sm:p-9">
          <p className="text-xs font-bold text-[#7C3AED]">یک قدم جلوتر</p>
          <h2 className="mt-3 text-2xl font-extrabold leading-9 text-[#111827]">برای خرید بعدی‌تان آماده‌ایم.</h2>
          <p className="mt-4 text-sm leading-7 text-[#6B7280]">محصولات محبوب را ببینید و با خیال راحت انتخاب کنید.</p>
          <Link href="/products" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#7C3AED]">
            مشاهده محصولات
            <ArrowLeft aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <article key={value.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 transition hover:-translate-y-1 hover:border-[#7C3AED]">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2563EB]"><Icon aria-hidden="true" size={22} /></div>
              <h2 className="mt-4 font-extrabold text-[#111827]">{value.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#6B7280]">{value.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

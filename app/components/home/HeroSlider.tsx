"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

const slides = [
  {
    title: "آلومینیوم؛سبکی،هوشمندانه،استحکام ماندگار،آینده‌ای درخشان",
    image: `/Images/${encodeURI("آلومینیوم؛سبکی،هوشمندانه،استحکام ماندگار،آینده‌ای درخشان.jpg")}`,
  },
  {
    title: "استیل؛قدرتی ضد زنگ،کیفیتی ماندگار",
    image: `/Images/${encodeURI("استیل؛قدرتی ضد زنگ،کیفیتی ماندگار.jpg")}`,
  },
  {
    title: "فولاد؛قدرتی که آینده را میسازد",
    image: `/Images/${encodeURI("فولاد؛قدرتی که آینده را میسازد.jpg")}`,
  },
  {
    title: "مس؛جریان قدرت در رگ های صنعت",
    image: `/Images/${encodeURI("مس؛جریان قدرت در رگ های صنعت.jpg")}`,
  },
  {
    title: "پلی آمید؛قدرت مهندسی در قلب صنعت",
    image: `/Images/${encodeURI("پلی آمید؛قدرت مهندسی در قلب صنعت.jpg")}`,
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      aria-label="دسته‌بندی‌های منتخب"
      aria-roledescription="اسلایدر"
      className="relative isolate h-[500px] overflow-hidden rounded-[2rem] bg-[#111827] text-white shadow-[0_18px_45px_rgba(37,99,235,0.18)] sm:h-[430px] lg:h-[410px]"
      dir="rtl"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.image}
            role="group"
            aria-hidden={!isActive}
            inert={!isActive}
            aria-label={`${slide.title}، اسلاید ${index + 1} از ${slides.length}`}
            aria-roledescription="اسلاید"
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            } motion-reduce:transition-none`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-slate-950/85 via-slate-950/55 to-slate-950/15" />

            <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 pb-12 pt-7 sm:px-10 lg:px-16">
              <div className="w-full max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/25 bg-orange-300/10 px-3 py-1.5 text-xs font-bold text-orange-200 backdrop-blur-sm">
                  <Sparkles aria-hidden="true" size={14} />
                  محصولات صنعتی
                </p>
                <h1 className="max-w-xl text-3xl font-extrabold leading-[1.4] sm:text-4xl lg:text-[2.75rem]">
                  {slide.title}
                </h1>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-5 bottom-4 z-20 flex items-center justify-between sm:inset-x-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="رفتن به اسلاید قبلی"
            className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight aria-hidden="true" size={19} />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="رفتن به اسلاید بعدی"
            className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft aria-hidden="true" size={19} />
          </button>
        </div>

        <div className="flex items-center gap-2" aria-label="انتخاب اسلاید">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`نمایش اسلاید ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] ${
                index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "ادامهٔ حرکت اسلایدها" : "توقف حرکت اسلایدها"}
            className="mr-1 flex size-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {isPaused ? <Play aria-hidden="true" size={15} /> : <Pause aria-hidden="true" size={15} />}
          </button>
        </div>
      </div>
    </section>
  );
}

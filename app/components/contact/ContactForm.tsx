"use client";

import { FormEvent, useState } from "react";
import { Check, Send } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return sent ? (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-[#F5F7FA] p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2563EB]"><Check aria-hidden="true" size={28} /></div>
      <h2 className="mt-4 text-lg font-extrabold text-[#111827]">پیام شما ثبت شد</h2>
      <p className="mt-2 text-sm leading-7 text-[#6B7280]">در نسخه فعلی این فرم نمایشی است؛ به‌زودی به سیستم پیام‌ها متصل می‌شود.</p>
      <button type="button" onClick={() => setSent(false)} className="mt-5 text-sm font-bold text-[#2563EB] hover:text-[#7C3AED]">ارسال پیام جدید</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#111827]">
          نام و نام خانوادگی
          <input required name="name" className="h-11 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] px-3 outline-none focus:border-[#2563EB] focus:bg-white" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#111827]">
          ایمیل
          <input required type="email" name="email" className="h-11 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] px-3 outline-none focus:border-[#2563EB] focus:bg-white" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[#111827]">
        موضوع پیام
        <input required name="subject" className="h-11 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] px-3 outline-none focus:border-[#2563EB] focus:bg-white" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#111827]">
        پیام شما
        <textarea required name="message" rows={5} className="resize-none rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] p-3 outline-none focus:border-[#2563EB] focus:bg-white" />
      </label>
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20">
        ارسال پیام
        <Send aria-hidden="true" size={17} />
      </button>
    </form>
  );
}

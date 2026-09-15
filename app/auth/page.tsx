import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthForm from "@/app/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_18px_50px_rgba(17,24,39,0.08)] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full border border-white/15 bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-0 size-72 rounded-full border border-white/15 bg-white/5" />
          <Link href="/" className="relative inline-flex items-center gap-2 text-sm font-bold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-lg">M</span>
            فروشگاه من
          </Link>
          <div className="relative">
            <p className="text-sm font-semibold text-white/75">خرید ساده و امن</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.45]">خوش آمدی؛ خرید خوب از همین‌جا شروع می‌شود.</h2>
            <p className="mt-5 text-sm leading-7 text-white/75">با ورود به حساب کاربری، سفارش‌ها و علاقه‌مندی‌هایت همیشه در دسترس تو هستند.</p>
          </div>
          <p className="relative text-xs text-white/60">ورود سریع با رمز یک‌بارمصرف</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition hover:text-[#2563EB] lg:hidden">
            <ArrowRight aria-hidden="true" size={17} />
            بازگشت به فروشگاه
          </Link>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

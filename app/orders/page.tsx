"use client";

import { FormEvent, useState } from "react";
import { Check, Package, Truck } from "lucide-react";
import CustomerPage from "@/app/components/customer/CustomerPage";

export default function OrdersPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <CustomerPage icon="order" eyebrow="خدمات مشتریان" title="پیگیری سفارش" description="کد سفارش خود را وارد کنید تا آخرین وضعیت سفارش‌تان را ببینید.">
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
        <label className="grid gap-2 text-sm font-bold text-[#111827]">
          کد سفارش
          <input required name="orderId" placeholder="مثلاً ORD-1001" className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] px-4 uppercase outline-none focus:border-[#2563EB] focus:bg-white" />
        </label>
        <button type="submit" className="mt-4 h-12 w-full rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#7C3AED]">پیگیری سفارش</button>
        {submitted ? (
          <div className="mt-6 rounded-2xl bg-[#F5F7FA] p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-[#111827]"><Check className="text-[#2563EB]" size={18} /> سفارش شما در حال آماده‌سازی است.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <p className="flex items-center gap-2 text-xs text-[#6B7280]"><Package className="text-[#7C3AED]" size={17} /> آماده‌سازی سفارش</p>
              <p className="flex items-center gap-2 text-xs text-[#6B7280]"><Truck className="text-[#2563EB]" size={17} /> ارسال به‌زودی</p>
            </div>
          </div>
        ) : null}
      </form>
    </CustomerPage>
  );
}

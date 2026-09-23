"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Package, Phone, UserRound } from "lucide-react";
import { clearStoredAuthUser } from "@/app/components/auth/auth-storage";

type AccountData = {
  user: { name: string; phone?: string; createdAt: string };
  orders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    shipping?: {
      fullName?: string;
      postalCode?: string;
      address?: string;
      province?: string;
      city?: string;
    };
  }[];
};

export default function AccountPage() {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const payment = search.get("payment");
    const nextPaymentStatus = payment === "success"
      ? "خرید با موفقیت انجام شد."
      : payment === "failed"
        ? "پرداخت انجام نشد. لطفاً دوباره تلاش کنید."
        : null;
    window.setTimeout(() => setPaymentStatus(nextPaymentStatus), 0);

    fetch("/api/auth", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) setData((await response.json()) as AccountData);
        else {
          clearStoredAuthUser();
          window.location.href = "/auth";
        }
        setLoading(false);
      })
      .catch(() => {
        clearStoredAuthUser();
        window.location.href = "/auth";
      });
  }, []);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    clearStoredAuthUser();
    window.location.href = "/auth";
  };

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-[#6B7280]">در حال بارگذاری حساب کاربری...</main>;
  if (!data) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm font-bold text-[#2563EB]">حساب کاربری</p><h1 className="mt-2 text-3xl font-extrabold text-[#111827]">سلام، {data.user.name}</h1></div>
        <button type="button" onClick={logout} className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 text-sm font-bold text-[#6B7280] hover:border-red-200 hover:text-red-600"><LogOut size={17} /> خروج</button>
      </div>
      {paymentStatus ? <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{paymentStatus}</div> : null}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><UserRound className="text-[#2563EB]" size={21} /><p className="mt-4 text-xs text-[#6B7280]">نام</p><p className="mt-1 font-bold text-[#111827]">{data.user.name}</p></div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><Phone className="text-[#2563EB]" size={21} /><p className="mt-4 text-xs text-[#6B7280]">شماره موبایل</p><p dir="ltr" className="mt-1 text-right font-bold text-[#111827]">{data.user.phone}</p></div>
      </section>
      <section className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7"><div className="flex items-center gap-2"><Package className="text-[#2563EB]" size={21} /><h2 className="font-extrabold text-[#111827]">سفارش‌های من</h2></div>{data.orders.length === 0 ? <p className="mt-6 text-sm text-[#6B7280]">هنوز سفارشی ثبت نشده است.</p> : <div className="mt-5 grid gap-3">{data.orders.map((order) => <div key={order.id} className="rounded-xl bg-[#F8FAFC] p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold">{order.id}</span><span>{order.status}</span><span>{new Intl.NumberFormat("fa-IR").format(order.total)} تومان</span></div>{order.shipping ? <div className="mt-3 space-y-1 text-xs text-[#475569]"><p><span className="font-bold text-[#111827]">گیرنده:</span> {order.shipping.fullName}</p><p><span className="font-bold text-[#111827]">استان:</span> {order.shipping.province} | <span className="font-bold text-[#111827]">شهر:</span> {order.shipping.city}</p><p><span className="font-bold text-[#111827]">کد پستی:</span> {order.shipping.postalCode}</p><p><span className="font-bold text-[#111827]">آدرس:</span> {order.shipping.address}</p></div> : null}</div>)}</div>}</section>
      <Link href="/" className="mt-6 inline-block text-sm font-bold text-[#2563EB]">بازگشت به فروشگاه</Link>
    </main>
  );
}
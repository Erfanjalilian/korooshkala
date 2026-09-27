"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { LogOut, Package, Phone, Save, UserRound } from "lucide-react";
import { clearStoredAuthUser } from "@/app/components/auth/auth-storage";

type ShippingProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  address: string;
  province: string;
  city: string;
};

const emptyShippingProfile: ShippingProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  postalCode: "",
  address: "",
  province: "",
  city: "",
};

const provinceOptions = [
  "آذربایجان‌شرقی", "آذربایجان‌غربی", "اصفهان", "البرز", "ایلام", "بوشهر", "تهران",
  "چهارمحال و بختیاری", "خراسان رضوی", "خراسان شمالی", "خراسان جنوبی", "خوزستان", "زنجان",
  "سمنان", "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه",
  "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان",
  "همدان", "یزد",
];

type AccountData = {
  user: { name: string; phone?: string; createdAt: string; shippingProfile?: ShippingProfile };
  orders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    shipping?: {
      fullName?: string;
      phone?: string;
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
  const [shippingProfile, setShippingProfile] = useState<ShippingProfile>(emptyShippingProfile);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState<{ text: string; error: boolean } | null>(null);

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
        if (response.ok) {
          const account = await response.json() as AccountData;
          setData(account);
          setShippingProfile({
            ...emptyShippingProfile,
            ...account.user.shippingProfile,
            phone: account.user.shippingProfile?.phone || account.user.phone || "",
          });
        }
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

  useEffect(() => {
    if (!loading && window.location.hash === "#shipping-profile") {
      document.getElementById("shipping-profile")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const saveShippingProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileNotice(null);
    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingProfile }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "ذخیره اطلاعات انجام نشد.");
      setData((current) => current ? {
        ...current,
        user: { ...current.user, name: `${shippingProfile.firstName} ${shippingProfile.lastName}`, shippingProfile },
      } : current);
      setProfileNotice({ text: "اطلاعات ارسال ذخیره شد.", error: false });
    } catch (saveError) {
      setProfileNotice({
        text: saveError instanceof Error ? saveError.message : "ذخیره اطلاعات انجام نشد.",
        error: true,
      });
    } finally {
      setProfileSaving(false);
    }
  };

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
      <section id="shipping-profile" className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold text-[#2563EB]">اطلاعات ذخیره‌شده برای خریدهای بعدی</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#111827]">اطلاعات ارسال</h2>
        </div>
        <form onSubmit={saveShippingProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            نام
            <input required value={shippingProfile.firstName} onChange={(event) => setShippingProfile((current) => ({ ...current, firstName: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            نام خانوادگی
            <input required value={shippingProfile.lastName} onChange={(event) => setShippingProfile((current) => ({ ...current, lastName: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:col-span-2">
            شماره تماس گیرنده
            <input required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={shippingProfile.phone} onChange={(event) => setShippingProfile((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-left text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:col-span-2">
            آدرس کامل
            <textarea required rows={3} value={shippingProfile.address} onChange={(event) => setShippingProfile((current) => ({ ...current, address: event.target.value }))} className="resize-y rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            استان
            <select required value={shippingProfile.province} onChange={(event) => setShippingProfile((current) => ({ ...current, province: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white">
              <option value="">انتخاب کنید</option>
              {provinceOptions.map((province) => <option key={province} value={province}>{province}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            شهر
            <input required value={shippingProfile.city} onChange={(event) => setShippingProfile((current) => ({ ...current, city: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:col-span-2">
            کد پستی
            <input required inputMode="numeric" dir="ltr" value={shippingProfile.postalCode} onChange={(event) => setShippingProfile((current) => ({ ...current, postalCode: event.target.value }))} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-left text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
          </label>
          {profileNotice ? <p role={profileNotice.error ? "alert" : "status"} className={`sm:col-span-2 rounded-xl px-3 py-2 text-sm ${profileNotice.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{profileNotice.text}</p> : null}
          <button type="submit" disabled={profileSaving} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#7C3AED] disabled:cursor-wait disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
            <Save aria-hidden="true" size={17} />
            {profileSaving ? "در حال ذخیره..." : "ذخیره اطلاعات ارسال"}
          </button>
        </form>
      </section>
      <section className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7"><div className="flex items-center gap-2"><Package className="text-[#2563EB]" size={21} /><h2 className="font-extrabold text-[#111827]">سفارش‌های من</h2></div>{data.orders.length === 0 ? <p className="mt-6 text-sm text-[#6B7280]">هنوز سفارشی ثبت نشده است.</p> : <div className="mt-5 grid gap-3">{data.orders.map((order) => <div key={order.id} className="rounded-xl bg-[#F8FAFC] p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold">{order.id}</span><span>{order.status}</span><span>{new Intl.NumberFormat("fa-IR").format(order.total)} تومان</span></div>{order.shipping ? <div className="mt-3 space-y-1 text-xs text-[#475569]"><p><span className="font-bold text-[#111827]">گیرنده:</span> {order.shipping.fullName}</p><p><span className="font-bold text-[#111827]">استان:</span> {order.shipping.province} | <span className="font-bold text-[#111827]">شهر:</span> {order.shipping.city}</p><p><span className="font-bold text-[#111827]">کد پستی:</span> {order.shipping.postalCode}</p><p><span className="font-bold text-[#111827]">آدرس:</span> {order.shipping.address}</p></div> : null}</div>)}</div>}</section>
      <Link href="/" className="mt-6 inline-block text-sm font-bold text-[#2563EB]">بازگشت به فروشگاه</Link>
    </main>
  );
}
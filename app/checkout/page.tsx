"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = "jahankala-cart";
const provinceOptions = [
  "آذربایجان‌شرقی",
  "آذربایجان‌غربی",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان رضوی",
  "خراسان شمالی",
  "خراسان جنوبی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];

const formatPrice = (price: number) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"tipax" | "bus">("tipax");
  const [packagingEstimate, setPackagingEstimate] = useState<{ key: string; fee: number; quantity: number } | null>(null);
  const estimateKey = JSON.stringify(items.map(({ productId, quantity }) => [productId, quantity]));

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const currentEstimate = packagingEstimate?.key === estimateKey ? packagingEstimate : null;
  const packagingFee = currentEstimate?.fee ?? 0;
  const packagingQuantity = currentEstimate?.quantity ?? 0;

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        setItems(storedCart ? JSON.parse(storedCart) as CartItem[] : []);

        const authResponse = await fetch("/api/auth", { cache: "no-store" });
        if (!authResponse.ok) {
          window.location.href = "/auth?redirect=/checkout";
          return;
        }
      } catch {
        window.location.href = "/auth?redirect=/checkout";
        return;
      } finally {
        setCheckingAuth(false);
        setLoaded(true);
      }
    };

    const timeoutId = window.setTimeout(() => {
      void loadCart();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!loaded || items.length === 0) return;

    const controller = new AbortController();
    void fetch("/api/shipping/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map(({ productId, quantity }) => ({ productId, quantity })) }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return;
      const estimate = await response.json() as { packagingFee: number; packagingQuantity: number };
      setPackagingEstimate({ key: estimateKey, fee: estimate.packagingFee, quantity: estimate.packagingQuantity });
    }).catch(() => undefined);

    return () => controller.abort();
  }, [items, estimateKey, loaded]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const shipping = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      province: String(formData.get("province") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      shippingMethod,
    };

    if (!shipping.firstName || !shipping.lastName || !shipping.postalCode || !shipping.address || !shipping.province || !shipping.city) {
      setError("لطفاً تمام فیلدهای اطلاعات ارسال را کامل وارد کنید.");
      return;
    }
    if (shipping.shippingMethod === "bus" && shipping.province === "تهران") {
      setError("ارسال فوری با اتوبوس فقط برای مقصدهای خارج از تهران امکان‌پذیر است.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping }),
      });
      const result = await response.json() as { error?: string; orderId?: string; paymentUrl?: string };
      if (!response.ok) throw new Error(result.error || "ثبت سفارش انجام نشد.");
      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        window.location.href = result.paymentUrl;
        return;
      }
      window.location.href = "/account?payment=success";
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "ثبت سفارش انجام نشد.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded || checkingAuth) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-[#6B7280]">در حال آماده‌سازی فرم پرداخت...</div>;
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <ShoppingBag className="mx-auto text-[#2563EB]" size={40} />
          <h1 className="mt-4 text-2xl font-extrabold text-[#111827]">سبد خرید خالی است</h1>
          <p className="mt-2 text-sm text-[#6B7280]">برای تکمیل خرید، ابتدا محصولی به سبد خود اضافه کنید.</p>
          <Link href="/products" className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white hover:bg-[#7C3AED]">
            بازگشت به محصولات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#2563EB]">تکمیل خرید</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#111827]">ثبت سفارش و پرداخت</h1>
        </div>
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#2563EB]">
          <ArrowLeft size={17} />
          بازگشت به سبد خرید
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-extrabold text-[#111827]">اطلاعات ارسال</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              نام
              <input name="firstName" required className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              نام خانوادگی
              <input name="lastName" required className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:col-span-2">
              آدرس کامل
              <textarea name="address" required rows={4} className="resize-none rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              استان
              <select name="province" required value={selectedProvince} onChange={(event) => {
                const province = event.target.value;
                setSelectedProvince(province);
                if (province === "تهران") setShippingMethod("tipax");
              }} className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white">
                <option value="">انتخاب کنید</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </label>
            <fieldset className="grid gap-2 sm:col-span-2">
              <legend className="mb-2 text-sm font-semibold text-[#111827]">روش ارسال</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] p-3 text-sm">
                <input type="radio" name="shippingMethod" value="tipax" checked={shippingMethod === "tipax"} onChange={() => setShippingMethod("tipax")} className="mt-1 accent-[#2563EB]" />
                <span><strong className="text-[#111827]">تیپاکس</strong><span className="block text-xs text-[#6B7280]">قابل انتخاب برای تهران و سایر شهرها</span></span>
              </label>
              {selectedProvince && selectedProvince !== "تهران" ? (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] p-3 text-sm">
                  <input type="radio" name="shippingMethod" value="bus" checked={shippingMethod === "bus"} onChange={() => setShippingMethod("bus")} className="mt-1 accent-[#2563EB]" />
                  <span><strong className="text-[#111827]">ارسال فوری با اتوبوس</strong><span className="block text-xs text-[#6B7280]">فقط برای مقصدهای خارج از تهران</span></span>
                </label>
              ) : null}
            </fieldset>
            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              شهر
              <input name="city" required className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:col-span-2">
              کد پستی
              <input name="postalCode" required inputMode="numeric" className="h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white" />
            </label>
          </div>

          <p className="mt-5 rounded-xl bg-[#F8FAFC] p-3 text-xs leading-6 text-[#475569]">هزینه ارسال در هر دو روش بر عهده مشتری است. هزینه حمل محصول تا ترمینال نیز به‌صورت پس‌کرایه دریافت می‌شود.</p>

          {error ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              <AlertCircle size={17} />
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? "در حال ثبت سفارش..." : "ادامه به پرداخت"}
          </button>

          {paymentUrl ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={17} />
              در حال هدایت به درگاه پرداخت...
            </div>
          ) : null}
        </form>

        <aside className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-extrabold text-[#111827]">خلاصه سفارش</h2>
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-3 text-sm">
                <div>
                  <p className="font-bold text-[#111827]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">تعداد: {item.quantity}</p>
                </div>
                <span className="font-bold text-[#2563EB]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#E5E7EB] pt-5">
            <div className="flex items-center justify-between text-sm text-[#6B7280]">
              <span>جمع سفارش</span>
              <strong className="text-[#111827]">{formatPrice(total)}</strong>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#6B7280]">
              <span>هزینه ارسال</span>
              <strong className="text-[#111827]">به عهده مشتری</strong>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#6B7280]">
              <span>روش ارسال</span>
              <strong className="text-[#111827]">{shippingMethod === "bus" ? "اتوبوس فوری" : "تیپاکس"}</strong>
            </div>
            {packagingQuantity > 0 ? <>
              <div className="mt-3 flex items-center justify-between text-sm text-[#6B7280]">
                <span>نایلون ضربه‌گیر ({packagingQuantity} عدد)</span>
                <strong className="text-[#111827]">{formatPrice(packagingFee)}</strong>
              </div>
              <p className="mt-3 rounded-xl bg-[#F8FAFC] p-3 text-xs leading-6 text-[#6B7280]">برای هر محصول سایلنت باکس، مبلغ {formatPrice(packagingFee / packagingQuantity)} بابت نایلون ضربه‌گیر دریافت می‌شود.</p>
            </> : null}
            <div className="mt-5 flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-lg font-extrabold text-[#111827]">
              <span>مبلغ نهایی</span>
              <span className="text-[#2563EB]">{formatPrice(total + packagingFee)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

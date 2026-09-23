"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT } from "@/app/components/header/CartCount";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = "jahankala-cart";
const formatPrice = (price: number) => `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      setItems(storedCart ? JSON.parse(storedCart) : []);

      try {
        const response = await fetch("/api/auth", { cache: "no-store" });
        if (!response.ok) {
          window.location.href = "/auth?redirect=/cart";
          return;
        }
      } catch {
        window.location.href = "/auth?redirect=/cart";
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

  const updateCart = (nextItems: CartItem[]) => {
    setItems(nextItems);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!loaded || checkingAuth) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-[#6B7280]">در حال آماده‌سازی سبد خرید...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#2563EB]">
        <ArrowRight aria-hidden="true" size={17} />
        ادامه خرید
      </Link>
      <h1 className="text-3xl font-extrabold text-[#111827]">سبد خرید</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center">
          <ShoppingBag aria-hidden="true" size={42} className="mx-auto text-[#2563EB]" />
          <h2 className="mt-4 text-lg font-bold text-[#111827]">سبد خرید شما خخی است</h2>
          <Link href="/products" className="mt-5 inline-flex rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#7C3AED]">مشاهده محصولات</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[#111827]">{item.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#2563EB]">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#E5E7EB]">
                    <button type="button" aria-label="افزایش تعداد" onClick={() => updateCart(items.map((current) => current.productId === item.productId ? { ...current, quantity: current.quantity + 1 } : current))} className="flex size-9 items-center justify-center text-[#2563EB]"><Plus size={16} /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" aria-label="کاهش تعداد" onClick={() => updateCart(items.map((current) => current.productId === item.productId ? { ...current, quantity: Math.max(1, current.quantity - 1) } : current))} className="flex size-9 items-center justify-center text-[#2563EB]"><Minus size={16} /></button>
                  </div>
                  <button type="button" aria-label="حذف محصول" onClick={() => updateCart(items.filter((current) => current.productId !== item.productId))} className="text-[#7C3AED] hover:text-[#2563EB]"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="font-extrabold text-[#111827]">خلاصه سفارش</h2>
            <div className="mt-5 flex items-center justify-between text-sm text-[#6B7280]"><span>مجموع</span><strong className="text-[#2563EB]">{formatPrice(total)}</strong></div>
            <Link href="/checkout" className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white hover:bg-[#7C3AED]">ادامه ثبت سفارش</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

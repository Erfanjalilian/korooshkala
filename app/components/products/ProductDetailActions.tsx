"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { CART_UPDATED_EVENT } from "@/app/components/header/CartCount";

type ProductDetailActionsProps = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
};

const CART_STORAGE_KEY = "jahankala-cart";

export default function ProductDetailActions({
  product,
}: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = async () => {
    try {
      const authResponse = await fetch("/api/auth", { cache: "no-store" });
      if (!authResponse.ok) {
        window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
    } catch {
      window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const existingItem = cart.find(
      (item: { productId: string }) => item.productId === product.id,
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        existingItem.quantity + quantity,
        product.stock,
      );
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="mt-7 border-t border-[#E5E7EB] pt-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[#111827]">تعداد</span>
        <div className="flex items-center rounded-xl border border-[#E5E7EB] bg-white">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(value + 1, product.stock))}
            aria-label="افزایش تعداد"
            className="flex size-10 items-center justify-center text-[#2563EB] transition hover:bg-[#F5F7FA]"
          >
            <Plus aria-hidden="true" size={17} />
          </button>
          <span className="flex w-10 justify-center text-sm font-bold text-[#111827]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
            aria-label="کاهش تعداد"
            className="flex size-10 items-center justify-center text-[#2563EB] transition hover:bg-[#F5F7FA]"
          >
            <Minus aria-hidden="true" size={17} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={addToCart}
        className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20"
      >
        {added ? <Check aria-hidden="true" size={19} /> : <ShoppingCart aria-hidden="true" size={19} />}
        {added ? "به سبد خرید اضافه شد" : "افزودن به سبد خرید"}
      </button>

      <p className="mt-3 text-center text-xs text-[#6B7280]">
        {product.stock} عدد موجود است
      </p>
    </div>
  );
}

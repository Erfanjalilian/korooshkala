"use client";

import { useEffect, useState } from "react";

export const CART_UPDATED_EVENT = "jahankala-cart-updated";

const CART_STORAGE_KEY = "jahankala-cart";

type CartEntry = { quantity?: number };

function readCartCount() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const cart = storedCart ? (JSON.parse(storedCart) as CartEntry[]) : [];
    return cart.reduce((total, item) => total + (item.quantity ?? 0), 0);
  } catch {
    return 0;
  }
}

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refreshCount = () => setCount(readCartCount());
    const timeoutId = window.setTimeout(refreshCount, 0);

    window.addEventListener(CART_UPDATED_EVENT, refreshCount);
    window.addEventListener("storage", refreshCount);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(CART_UPDATED_EVENT, refreshCount);
      window.removeEventListener("storage", refreshCount);
    };
  }, []);

  return (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

import { Phone } from "lucide-react";

export default function ProductDetailActions() {
  return (
    <div className="mt-7 border-t border-[#E5E7EB] pt-6">
      <a
        href="tel:09213570389"
        className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-[#7C3AED] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20"
      >
        <Phone aria-hidden="true" size={19} />
        سفارش تلفنی: ۰۹۲۱۳۵۷۰۳۸۹
      </a>
      <p className="mt-3 text-center text-xs text-[#6B7280]">
        برای استعلام موجودی و ثبت سفارش تماس بگیرید
      </p>
    </div>
  );
}

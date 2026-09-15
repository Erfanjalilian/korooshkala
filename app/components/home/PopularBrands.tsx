import Link from "next/link";

const popularBrands = [
  { name: "اپل", latinName: "APPLE", href: "/products?brand=apple" },
  { name: "سامسونگ", latinName: "SAMSUNG", href: "/products?brand=samsung" },
  { name: "شیائومی", latinName: "XIAOMI", href: "/products?brand=xiaomi" },
  { name: "نایکی", latinName: "NIKE", href: "/products?brand=nike" },
  { name: "آدیداس", latinName: "ADIDAS", href: "/products?brand=adidas" },
  { name: "سونی", latinName: "SONY", href: "/products?brand=sony" },
  { name: "نسپرسو", latinName: "NESPRESSO", href: "/products?brand=nespresso" },
  { name: "فیلیپس", latinName: "PHILIPS", href: "/products?brand=philips" },
];

export default function PopularBrands() {
  return (
    <section aria-labelledby="popular-brands-title" className="mt-10 sm:mt-12">
      <div className="mb-5">
        <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">
          انتخاب‌های قابل اعتماد
        </p>
        <h2
          id="popular-brands-title"
          className="text-xl font-extrabold text-[#111827] sm:text-2xl"
        >
          محبوب‌ترین برندها
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {popularBrands.map((brand, index) => (
          <Link
            key={brand.name}
            href={brand.href}
            className="group flex min-w-36 shrink-0 items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 transition duration-200 hover:-translate-y-1 hover:border-[#7C3AED] hover:shadow-[0_8px_20px_rgba(124,58,237,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] sm:min-w-40"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F7FA] text-sm font-extrabold text-[#2563EB] transition group-hover:bg-[#EEF2FF] group-hover:text-[#7C3AED]">
              {brand.latinName.charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#111827]">
                {brand.name}
              </span>
              <span className="mt-0.5 block truncate text-[9px] font-semibold tracking-widest text-[#9CA3AF]">
                {brand.latinName}
              </span>
            </span>
            <span className="mr-auto text-xs font-bold text-[#E5E7EB]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

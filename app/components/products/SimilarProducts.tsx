import Link from "next/link";
import { ArrowLeft, Package, Star } from "lucide-react";
import { readProducts } from "@/lib/store";

interface SimilarProductsProps {
  productId: string;
  categorySlug?: string;
}

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;

export default async function SimilarProducts({
  productId,
  categorySlug,
}: SimilarProductsProps) {
  const products = await readProducts();
  const similarProducts = products
    .filter(
      (product) =>
        Boolean(categorySlug) &&
        product.id !== productId &&
        product.categorySlug === categorySlug,
    )
    .slice(0, 4);

  if (similarProducts.length === 0) return null;

  return (
    <section aria-labelledby="similar-products-title" className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold text-[#7C3AED]">انتخاب‌های نزدیک</p>
          <h2
            id="similar-products-title"
            className="text-xl font-extrabold text-[#111827] sm:text-2xl"
          >
            محصولات مشابه
          </h2>
        </div>
        <Link
          href={`/products?category=${categorySlug}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#2563EB] transition hover:text-[#7C3AED]"
        >
          مشاهده همه
          <ArrowLeft aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {similarProducts.map((similarProduct) => (
          <Link
            key={similarProduct.id}
            href={`/products/${encodeURIComponent(similarProduct.slug)}`}
            className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#7C3AED] hover:shadow-[0_10px_24px_rgba(124,58,237,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#DBEAFE] to-[#F5F7FA] sm:h-36">
              {similarProduct.image ? <img src={similarProduct.image} alt={similarProduct.name} className="h-full w-full object-cover" /> : <div className="flex size-16 items-center justify-center rounded-2xl bg-white/80 text-[#2563EB] shadow-sm transition group-hover:text-[#7C3AED] sm:size-20"><Package aria-hidden="true" size={38} strokeWidth={1.4} /></div>}
              <span className="absolute right-2 top-2 rounded-full bg-[#7C3AED] px-2 py-1 text-[10px] font-bold text-white">
                {similarProduct.isDiscounted ? "ویژه" : "محبوب"}
              </span>
            </div>
            <div className="p-3 sm:p-4">
              <p className="truncate text-xs font-semibold text-[#7C3AED]">
                {similarProduct.brand}
              </p>
              <h3 className="mt-1 truncate text-sm font-bold text-[#111827]">
                {similarProduct.name}
              </h3>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#2563EB]">
                  {formatPrice(similarProduct.price)}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                  <Star aria-hidden="true" size={12} className="fill-[#7C3AED] text-[#7C3AED]" />
                  {similarProduct.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

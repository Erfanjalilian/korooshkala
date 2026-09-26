import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Package, ShieldCheck, Star, Truck } from "lucide-react";
import { readProducts } from "@/lib/store";
import ProductDetailActions from "@/app/components/products/ProductDetailActions";
import SimilarProducts from "@/app/components/products/SimilarProducts";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

function getAbsoluteImageUrl(image?: string) {
  if (!image?.trim()) return undefined;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://korooshkala.ir";
    const imageUrl = new URL(image, baseUrl);
    return imageUrl.protocol === "http:" || imageUrl.protocol === "https:"
      ? imageUrl.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const products = await readProducts();
  const product = products.find(
    (item) => item.slug === slug || item.id === slug,
  );

  if (!product) return {};

  const parentMetadata = await parent;
  const other: NonNullable<Metadata["other"]> = { ...parentMetadata.other };
  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

  if (isNonEmptyString(product.id)) other.product_id = product.id;
  if (isNonEmptyString(product.name)) other.product_name = product.name;
  if (typeof product.price === "number" && Number.isFinite(product.price)) {
    other.product_price = String(product.price);
    other.product_old_price = String(
      typeof product.compareAtPrice === "number" &&
        Number.isFinite(product.compareAtPrice) &&
        product.compareAtPrice > product.price
        ? product.compareAtPrice
        : product.price,
    );
  }
  if (typeof product.stock === "number" && Number.isFinite(product.stock)) {
    other.availability = product.stock > 0 ? "instock" : "outofstock";
  }
  if (isNonEmptyString(product.guarantee)) {
    other.guarantee = product.guarantee;
  }

  const imageUrl = getAbsoluteImageUrl(product.image);

  return {
    other,
    ...(imageUrl
      ? {
          openGraph: {
            ...parentMetadata.openGraph,
            images: [imageUrl, ...(parentMetadata.openGraph?.images ?? [])],
          },
        }
      : {}),
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const products = await readProducts();
  const product = products.find(
    (item) => item.slug === slug || item.id === slug,
  );

  if (!product) notFound();

  const discount =
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition hover:text-[#2563EB]"
      >
        <ArrowRight aria-hidden="true" size={17} />
        بازگشت به همه محصولات
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#DBEAFE] via-[#EEF2FF] to-[#EDE9FE] sm:min-h-[30rem]">
          <div className="absolute -left-16 -top-16 size-56 rounded-full border border-white/60 bg-white/20" />
          <div className="absolute -bottom-20 right-1/4 size-64 rounded-full border border-white/50 bg-white/20" />
          {product.image ? <img src={product.image} alt={product.name} className="relative h-full w-full object-cover" /> : <div className="relative flex size-44 items-center justify-center rounded-[2.5rem] bg-white/80 text-[#2563EB] shadow-[0_18px_45px_rgba(37,99,235,0.16)] backdrop-blur-sm sm:size-56"><Package aria-hidden="true" size={92} strokeWidth={1.2} /></div>}
          <span className="absolute right-5 top-5 rounded-full bg-[#7C3AED] px-3 py-1.5 text-xs font-bold text-white">
            {discount > 0 ? `${discount}٪ تخفیف` : product.isNew ? "جدید" : "محبوب"}
          </span>
        </div>

        <article className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-bold text-[#7C3AED]">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-[#6B7280]">
              <Star aria-hidden="true" size={16} className="fill-[#7C3AED] text-[#7C3AED]" />
              {product.rating} ({product.purchaseCount.toLocaleString("fa-IR")} خرید)
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold leading-9 text-[#111827] sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#6B7280]">{product.description}</p>

          <div className="mt-7 flex items-end gap-3 border-y border-[#E5E7EB] py-5">
            <span className="text-2xl font-extrabold text-[#2563EB]">
              {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
            </span>
            {product.compareAtPrice > product.price ? (
              <del className="text-xl font-extrabold text-red-600 sm:text-2xl">
                {new Intl.NumberFormat("fa-IR").format(product.compareAtPrice)} تومان
              </del>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-[#6B7280] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Check aria-hidden="true" size={17} className="text-[#2563EB]" />
              برند: {product.brand}
            </p>
            <p className="flex items-center gap-2">
              <Check aria-hidden="true" size={17} className="text-[#2563EB]" />
              کد کالا: {product.sku}
            </p>
          </div>

          <ProductDetailActions product={product} />

          <div className="mt-6 grid gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#6B7280] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Truck aria-hidden="true" size={17} className="text-[#2563EB]" />
              ارسال سریع به سراسر کشور
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" size={17} className="text-[#2563EB]" />
              ضمانت سلامت و اصالت کالا
            </p>
          </div>
        </article>
      </div>

      <SimilarProducts
        productId={product.id}
        categorySlug={product.categorySlug}
      />
    </div>
  );
}

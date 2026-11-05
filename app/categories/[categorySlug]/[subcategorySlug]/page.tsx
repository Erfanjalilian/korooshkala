import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { readCategoryPage, readCategoryPageSlugs } from "@/lib/categoryPages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return readCategoryPageSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const page = await readCategoryPage(categorySlug, subcategorySlug);
  return page ? { title: page.title, description: page.description } : {};
}

function getTelephoneHref(phone: string) {
  const normalizedPhone = phone
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\d+]/g, "");

  return `tel:${normalizedPhone}`;
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug, subcategorySlug } = await params;
  const page = await readCategoryPage(categorySlug, subcategorySlug);

  if (!page) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition hover:text-[#C2410C]"
      >
        <ArrowRight aria-hidden="true" size={17} />
        بازگشت به صفحهٔ اصلی
      </Link>

      <article className="overflow-hidden rounded-[2rem] border border-[#E7E5E4] bg-white shadow-[0_18px_45px_rgba(41,37,36,0.08)]">
        <div className="relative min-h-64 bg-gradient-to-br from-[#FFF7ED] to-[#E0F2FE] sm:min-h-96">
          <Image
            src={page.image}
            alt={page.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 960px"
            className="object-contain p-8 sm:p-12"
          />
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold text-[#C2410C]">{page.categoryName}</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-10 text-[#292524] sm:text-3xl">
            {page.title}
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#57534E] sm:text-base">
            {page.description}
          </p>

          <a
            href={getTelephoneHref(page.phone)}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
          >
            <Phone aria-hidden="true" size={18} />
            برای سفارش تماس بگیرید
          </a>
        </div>
      </article>
    </div>
  );
}

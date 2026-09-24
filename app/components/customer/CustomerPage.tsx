import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, HelpCircle, PackageSearch, RotateCcw, ShieldCheck, Truck } from "lucide-react";

interface CustomerPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: "order" | "guide" | "faq" | "terms" | "payment" | "shipping" | "returns";
  children: React.ReactNode;
}

const icons = {
  order: PackageSearch,
  guide: CheckCircle2,
  faq: HelpCircle,
  terms: ShieldCheck,
  payment: CreditCard,
  shipping: Truck,
  returns: RotateCcw,
};

export default function CustomerPage({
  eyebrow,
  title,
  description,
  icon,
  children,
}: CustomerPageProps) {
  const Icon = icons[icon];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#2563EB] to-[#7C3AED] px-6 py-10 text-white shadow-[0_16px_38px_rgba(37,99,235,0.16)] sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full border border-white/15 bg-white/5" />
        <div className="relative max-w-2xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><Icon aria-hidden="true" size={25} /></div>
          <p className="mt-5 text-sm font-bold text-white/75">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm leading-8 text-white/80">{description}</p>
        </div>
      </section>

      <div className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-9">{children}</div>

      <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition hover:text-[#2563EB]">
        بازگشت به صفحه اصلی
        <ArrowLeft aria-hidden="true" size={17} />
      </Link>
    </div>
  );
}

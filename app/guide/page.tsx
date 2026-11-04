import CustomerPage from "@/app/components/customer/CustomerPage";

const steps = [
  ["محصول را پیدا کنید", "از جست‌وجو یا دسته‌بندی‌ها محصول موردنظرتان را پیدا کنید."],
  ["جزئیات را بررسی کنید", "مشخصات و قیمت محصول را ببینید و برای استعلام موجودی تماس بگیرید."],
  ["سفارش تلفنی", "در صفحهٔ محصول روی دکمهٔ سفارش تلفنی بزنید تا شماره‌گیر گوشی باز شود."],
  ["هماهنگی سفارش", "جزئیات سفارش و روش تحویل را مستقیم با کارشناسان فروش هماهنگ کنید."],
];

export default function GuidePage() {
  return (
    <CustomerPage icon="guide" eyebrow="خدمات مشتریان" title="راهنمای سفارش" description="محصول موردنظرتان را پیدا کنید و برای سفارش تلفنی با ما در ارتباط باشید.">
      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map(([title, description], index) => (
          <article key={title} className="rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] p-5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-extrabold text-[#2563EB]">{index + 1}</span>
            <h2 className="mt-4 font-extrabold text-[#111827]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}

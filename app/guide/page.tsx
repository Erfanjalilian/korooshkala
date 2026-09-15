import CustomerPage from "@/app/components/customer/CustomerPage";

const steps = [
  ["محصول را پیدا کنید", "از جست‌وجو، دسته‌بندی‌ها یا فیلترهای صفحه محصولات استفاده کنید."],
  ["جزئیات را بررسی کنید", "قیمت، موجودی، امتیاز و توضیحات محصول را قبل از خرید ببینید."],
  ["به سبد خرید اضافه کنید", "تعداد موردنظر را انتخاب و محصول را به سبد خرید منتقل کنید."],
  ["سفارش را نهایی کنید", "در سبد خرید، خلاصه سفارش را بررسی و مراحل ثبت را ادامه دهید."],
];

export default function GuidePage() {
  return (
    <CustomerPage icon="guide" eyebrow="خدمات مشتریان" title="راهنمای خرید" description="با چند قدم ساده، محصول موردنظرتان را پیدا و خریدتان را کامل کنید.">
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

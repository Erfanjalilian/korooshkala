import CustomerPage from "@/app/components/customer/CustomerPage";

const terms = [
  ["ثبت سفارش", "ثبت سفارش به معنی پذیرش اطلاعات محصول، قیمت و شرایط نمایش‌داده‌شده در زمان خرید است."],
  ["قیمت و موجودی", "قیمت و موجودی محصولات ممکن است به‌روزرسانی شود؛ مبلغ نهایی همان مبلغ نمایش‌داده‌شده هنگام ثبت سفارش است."],
  ["ارسال سفارش", "سفارش‌ها پس از آماده‌سازی در بازه اعلام‌شده برای مشتری ارسال می‌شوند."],
  ["حریم خصوصی", "اطلاعات کاربران فقط برای ارائه خدمات بهتر استفاده می‌شود و بدون مجوز در اختیار شخص ثالث قرار نمی‌گیرد."],
];

export default function TermsPage() {
  return (
    <CustomerPage icon="terms" eyebrow="خدمات مشتریان" title="قوانین و مقررات" description="شرایط استفاده از فروشگاه، ثبت سفارش و خدمات مشتریان را در این صفحه بخوانید.">
      <div className="grid gap-4">
        {terms.map(([title, description], index) => (
          <article key={title} className="border-b border-[#E5E7EB] pb-5 last:border-b-0 last:pb-0">
            <h2 className="text-base font-extrabold text-[#111827]"><span className="ml-2 text-[#7C3AED]">۰{index + 1}</span>{title}</h2>
            <p className="mt-2 text-sm leading-8 text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}

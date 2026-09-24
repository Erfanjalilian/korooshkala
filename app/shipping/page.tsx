import CustomerPage from "@/app/components/customer/CustomerPage";

const shippingSteps = [
  ["آماده‌سازی سفارش", "پس از ثبت موفق سفارش، کالاها بررسی و برای ارسال بسته‌بندی می‌شوند. زمان آماده‌سازی با توجه به نوع و موجودی کالا اعلام خواهد شد."],
  ["ارسال به سراسر کشور", "سفارش‌ها به آدرس ثبت‌شده در زمان خرید ارسال می‌شوند. لطفاً نشانی، کدپستی و شماره تماس گیرنده را با دقت وارد کنید."],
  ["زمان تحویل", "زمان رسیدن سفارش به شهر مقصد به روش ارسال و مقصد بستگی دارد و در زمان ثبت سفارش اطلاع‌رسانی می‌شود. در روزهای تعطیل ممکن است این زمان تغییر کند."],
  ["پیگیری سفارش", "پس از ارسال، وضعیت سفارش در صفحه پیگیری سفارش به‌روزرسانی می‌شود. در صورت تغییر آدرس، پیش از ارسال با پشتیبانی تماس بگیرید."],
];

export default function ShippingPage() {
  return (
    <CustomerPage icon="shipping" eyebrow="خدمات مشتریان" title="شرایط و روش ارسال" description="فرآیند آماده‌سازی، ارسال و تحویل سفارش از فروشگاه را قدم‌به‌قدم ببینید.">
      <div className="grid gap-5">
        {shippingSteps.map(([title, description], index) => (
          <article key={title} className="border-b border-[#E5E7EB] pb-5 last:border-b-0 last:pb-0">
            <h2 className="text-base font-extrabold text-[#111827]"><span className="ml-2 text-[#2563EB]">۰{index + 1}</span>{title}</h2>
            <p className="mt-2 text-sm leading-8 text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}
import CustomerPage from "@/app/components/customer/CustomerPage";

const paymentMethods = [
  ["پرداخت آنلاین", "پس از ثبت اطلاعات سفارش، با انتخاب گزینه پرداخت آنلاین به درگاه امن زرین‌پال منتقل می‌شوید و مبلغ سفارش را با کارت‌های عضو شتاب پرداخت می‌کنید."],
  ["بررسی نتیجه پرداخت", "پس از بازگشت از درگاه، وضعیت سفارش در حساب کاربری شما ثبت می‌شود. تا زمانی که پیام موفقیت پرداخت را ندیده‌اید، صفحه را نبندید و سفارش را دوباره ثبت نکنید."],
  ["مبلغ نهایی سفارش", "مبلغ قابل پرداخت شامل قیمت کالا و هزینه ارسال است و پیش از انتقال به درگاه در خلاصه سفارش نمایش داده می‌شود."],
  ["پرداخت ناموفق یا لغوشده", "اگر پرداخت ناموفق بود یا از درگاه بازگشتید، سفارش در وضعیت پرداخت‌نشده باقی می‌ماند. چند دقیقه بعد وضعیت حساب خود را بررسی و در صورت نیاز با پشتیبانی تماس بگیرید."],
];

export default function PaymentPage() {
  return (
    <CustomerPage icon="payment" eyebrow="خدمات مشتریان" title="شرایط و روش پرداخت" description="همه چیز درباره پرداخت آنلاین، مبلغ نهایی سفارش و پیگیری تراکنش را اینجا بخوانید.">
      <div className="grid gap-5">
        {paymentMethods.map(([title, description], index) => (
          <article key={title} className="border-b border-[#E5E7EB] pb-5 last:border-b-0 last:pb-0">
            <h2 className="text-base font-extrabold text-[#111827]"><span className="ml-2 text-[#2563EB]">۰{index + 1}</span>{title}</h2>
            <p className="mt-2 text-sm leading-8 text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}
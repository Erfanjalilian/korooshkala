import CustomerPage from "@/app/components/customer/CustomerPage";

const questions = [
  ["چطور محصولی را سفارش بدهم؟", "در صفحه جزئیات محصول روی دکمه سفارش تلفنی بزنید تا شماره‌گیر گوشی با شماره فروشگاه باز شود."],
  ["چطور از موجودی و قیمت روز مطلع شوم؟", "برای استعلام موجودی و قیمت روز با شماره ۰۹۲۱۳۵۷۰۳۸۹ تماس بگیرید."],
  ["چطور با پشتیبانی تماس بگیرم؟", "از صفحه تماس با ما استفاده کنید یا با ایمیل erfanjaaliliyan83@gmail.com در ارتباط باشید."],
  ["آیا امکان ثبت سفارش آنلاین وجود دارد؟", "خیر، ثبت سفارش از طریق تماس تلفنی با کارشناسان فروش انجام می‌شود."],
];

export default function FaqPage() {
  return (
    <CustomerPage icon="faq" eyebrow="خدمات مشتریان" title="پرسش‌های متداول" description="پاسخ پرسش‌های رایج درباره خرید، سفارش و پشتیبانی فروشگاه.">
      <div className="grid gap-3">
        {questions.map(([question, answer]) => (
          <details key={question} className="group rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] p-4">
            <summary className="cursor-pointer list-none text-sm font-extrabold text-[#111827] marker:hidden">{question}</summary>
            <p className="mt-3 border-t border-[#E5E7EB] pt-3 text-sm leading-7 text-[#6B7280]">{answer}</p>
          </details>
        ))}
      </div>
    </CustomerPage>
  );
}

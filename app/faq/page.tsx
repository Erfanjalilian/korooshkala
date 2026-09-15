import CustomerPage from "@/app/components/customer/CustomerPage";

const questions = [
  ["چطور سفارش خود را پیگیری کنم؟", "به صفحه پیگیری سفارش بروید و کد سفارش خود را وارد کنید."],
  ["چطور محصولی را به سبد خرید اضافه کنم؟", "در صفحه جزئیات محصول، تعداد را انتخاب و روی افزودن به سبد خرید کلیک کنید."],
  ["آیا امکان تغییر تعداد محصول در سبد خرید وجود دارد؟", "بله، در صفحه سبد خرید می‌توانید تعداد هر محصول را افزایش یا کاهش دهید."],
  ["چطور با پشتیبانی تماس بگیرم؟", "از صفحه تماس با ما استفاده کنید یا با ایمیل erfanjaaliliyan83@gmail.com در ارتباط باشید."],
  ["آیا اطلاعات سفارش من محفوظ می‌ماند؟", "بله، حفظ حریم خصوصی و امنیت اطلاعات کاربران از اولویت‌های فروشگاه است."],
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

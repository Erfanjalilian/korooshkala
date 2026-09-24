import CustomerPage from "@/app/components/customer/CustomerPage";

const returnRules = [
  ["تست کالا هنگام تحویل", "هنگام دریافت، سلامت ظاهری بسته و کالا را بررسی کنید. در صورت مشاهده آسیب‌دیدگی بسته، موضوع را همان لحظه به مأمور ارسال اطلاع دهید و با پشتیبانی تماس بگیرید."],
  ["مهلت درخواست مرجوعی", "اگر کالا با سفارش مغایرت دارد، ایراد فنی دارد یا آسیب‌دیده به دستتان رسیده است، در اولین فرصت و حداکثر تا ۷ روز پس از تحویل درخواست خود را ثبت کنید."],
  ["شرایط پذیرش", "کالا باید استفاده‌نشده، همراه با بسته‌بندی، لوازم جانبی و فاکتور باشد. کالاهایی که به‌دلیل استفاده نادرست یا آسیب پس از تحویل معیوب شده‌اند، شامل مرجوعی نمی‌شوند."],
  ["بررسی و بازپرداخت", "پس از دریافت کالا، کارشناسان وضعیت آن را بررسی می‌کنند. در صورت تأیید، مبلغ کالا از همان روش پرداخت به شما بازگردانده می‌شود."],
];

export default function ReturnsPage() {
  return (
    <CustomerPage icon="returns" eyebrow="خدمات مشتریان" title="روش‌های تست و مرجوعی" description="پیش از تحویل و پس از خرید، این راهنما را برای بررسی کالا و ثبت درخواست مرجوعی بخوانید.">
      <div className="grid gap-5">
        {returnRules.map(([title, description], index) => (
          <article key={title} className="border-b border-[#E5E7EB] pb-5 last:border-b-0 last:pb-0">
            <h2 className="text-base font-extrabold text-[#111827]"><span className="ml-2 text-[#7C3AED]">۰{index + 1}</span>{title}</h2>
            <p className="mt-2 text-sm leading-8 text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </CustomerPage>
  );
}
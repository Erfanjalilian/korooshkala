import { Mail, MapPin, Phone, Clock } from "lucide-react";
import ContactForm from "@/app/components/contact/ContactForm";
import { readPages } from "@/lib/store";

export default async function ContactPage() {
  const { contact } = await readPages();
  const contactItems = [
    { title: "ایمیل", value: contact.email, icon: Mail },
    { title: "تلفن پشتیبانی", value: contact.phone, icon: Phone },
    { title: "نشانی", value: contact.address, icon: MapPin },
    { title: "ساعات پاسخ‌گویی", value: contact.hours, icon: Clock },
  ];
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] bg-gradient-to-l from-[#2563EB] to-[#7C3AED] px-6 py-10 text-white shadow-[0_16px_38px_rgba(37,99,235,0.16)] sm:px-10 sm:py-14 lg:px-16">
        <p className="text-sm font-bold text-white/75">پشتیبانی فروشگاه من</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{contact.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80">{contact.description}</p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2563EB]"><Icon aria-hidden="true" size={19} /></span><h2 className="text-sm font-extrabold text-[#111827]">{item.title}</h2></div>
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">{item.value}</p>
              </div>
            );
          })}
        </aside>
        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-9">
          <h2 className="text-xl font-extrabold text-[#111827]">پیام خود را ارسال کنید</h2>
          <p className="mt-2 text-sm leading-7 text-[#6B7280]">فرم زیر فعلاً استاتیک است و برای اتصال به backend آماده شده.</p>
          <div className="mt-6"><ContactForm /></div>
        </section>
      </div>
    </div>
  );
}

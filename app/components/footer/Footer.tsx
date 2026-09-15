import Link from "next/link";
import { Mail, MapPin, Phone, Send, Star } from "lucide-react";

const quickLinks = [
  { title: "صفحه اصلی", href: "/" },
  { title: "محصولات", href: "/products" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
];

const customerLinks = [
  { title: "پیگیری سفارش", href: "/orders" },
  { title: "راهنمای خرید", href: "/guide" },
  { title: "پرسش‌های متداول", href: "/faq" },
  { title: "قوانین و مقررات", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="صفحه اصلی">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">
                M
              </span>
              <span className="text-xl font-extrabold text-[#111827]">فروشگاه من</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
              تجربه‌ای ساده، سریع و مطمئن برای پیدا کردن محصولاتی که دوستشان دارید.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href="/contact"
                aria-label="اینستاگرام"
                className="flex size-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] transition hover:border-[#7C3AED] hover:text-[#7C3AED]"
              >
                <Star aria-hidden="true" size={18} />
              </Link>
              <Link
                href="/contact"
                aria-label="کانال تلگرام"
                className="flex size-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] transition hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                <Send aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#111827]">دسترسی سریع</h2>
            <nav className="mt-4 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6B7280] transition hover:text-[#2563EB]"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#111827]">خدمات مشتریان</h2>
            <nav className="mt-4 grid gap-3">
              {customerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6B7280] transition hover:text-[#7C3AED]"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#111827]">ارتباط با ما</h2>
            <div className="mt-4 grid gap-4 text-sm text-[#6B7280]">
              <p className="flex items-start gap-3">
                <MapPin aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#2563EB]" />
                تهران، خیابان ولیعصر، مرکز خرید جهان
              </p>
              <p className="flex items-center gap-3">
                <Phone aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
                ۰۲۱-۱۲۳۴۵۶۷۸
              </p>
              <p className="flex items-center gap-3">
                <Mail aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
                erfanjaaliliyan83@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
          <p>© ۱۴۰۴ فروشگاه من. تمامی حقوق محفوظ است.</p>
          <p>طراحی‌شده توسط عرفان جلیلیان</p>
        </div>
      </div>
    </footer>
  );
}

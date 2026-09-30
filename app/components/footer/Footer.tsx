import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { readStoreSettings } from "@/lib/store";

const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - (digit >= "٠" && digit <= "٩" ? 0x0660 : 0x06f0) + 48),
  );

function WhatsAppMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-9">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.4 22l5.2-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.5a7.7 7.7 0 0 1-3.9-1.1l-.3-.2-3 .8.8-2.9-.2-.3A7.8 7.8 0 1 1 12 19.7Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.4 0-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.8 3.3.5.2.9.4 1.2.4.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

const quickLinks = [
  { title: "صفحه اصلی", href: "/" },
  { title: "محصولات", href: "/products" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
];

const customerLinks = [
  { title: "پیگیری سفارش", href: "/orders" },
  { title: "راهنمای خرید", href: "/guide" },
  { title: "شرایط و روش پرداخت", href: "/payment" },
  { title: "شرایط و روش ارسال", href: "/shipping" },
  { title: "تست و مرجوعی کالا", href: "/returns" },
  { title: "پرسش‌های متداول", href: "/faq" },
  { title: "قوانین و مقررات", href: "/terms" },
];

export default async function Footer() {
  await connection();
  const settings = await readStoreSettings();
  const rubikaId = settings.rubikaId.trim().replace(/^@/, "");
  const whatsappNumber = toEnglishDigits(settings.whatsappId).replace(/\D/g, "");

  return (
    <footer className="mt-16 border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="صفحه اصلی">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">
                M
              </span>
              <span className="text-xl font-extrabold text-[#111827]">فروشگاه کوروش کالا</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
              تجربه‌ای ساده، سریع و مطمئن برای پیدا کردن محصولاتی که دوستشان دارید.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={rubikaId ? `https://rubika.ir/${encodeURIComponent(rubikaId)}` : "/contact"}
                target={rubikaId ? "_blank" : undefined}
                rel={rubikaId ? "noopener noreferrer" : undefined}
                aria-label="روبیکا"
                className="flex size-14 items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] transition hover:bg-[#DBEAFE]"
              >
                <Image src="/logo/rubikapng.parspng.com_-300x300.png" alt="" width={36} height={36} className="size-9 object-contain" />
              </a>
              <a
                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/contact"}
                target={whatsappNumber ? "_blank" : undefined}
                rel={whatsappNumber ? "noopener noreferrer" : undefined}
                aria-label="واتساپ"
                className="flex size-14 items-center justify-center rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A] transition hover:bg-[#DCFCE7]"
              >
                <WhatsAppMark />
              </a>
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
                تهران . بازار مبل . شاداباد کوی ۱۷ .شهریور خیابان سر حد جنوبی کوچه ی چوپان
              </p>
              <p className="flex items-center gap-3">
                <Phone aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
۰۲۱۶۶۸۱۶۲۸۳              </p>
              <p className="flex items-center gap-3">
                <Mail aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
Siavash.m2020@gmail.com              </p>
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://trustseal.enamad.ir/?id=7781646&Code=VXMzZy5jqN38yQL0dTSTEE2FL6cdldXZ"
                aria-label="مشاهده نماد اعتماد الکترونیکی"
                className="inline-flex w-fit rounded-lg border border-[#E5E7EB] bg-white p-2 transition hover:border-[#2563EB]"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=7781646&Code=VXMzZy5jqN38yQL0dTSTEE2FL6cdldXZ"
                  alt="نماد اعتماد الکترونیکی"
                  style={{ cursor: "pointer" }}
                  {...({ code: "VXMzZy5jqN38yQL0dTSTEE2FL6cdldXZ" } as Record<string, string>)}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
          
          <p>طراحی‌شده توسط عرفان جلیلیان</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { connection } from "next/server";
import { MapPin, MessageCircle, MessagesSquare, Phone, Send } from "lucide-react";
import { readFooter, readPages } from "@/lib/store";

const socialLinks = [
  { name: "واتساپ", href: "https://wa.me/Rsamadsanat", Icon: MessageCircle },
  { name: "روبیکا", href: "https://rubika.ir/Rsamadsanat", Icon: MessagesSquare },
  { name: "تلگرام", href: "https://t.me/Rsamadsanat", Icon: Send },
];

export default async function Footer() {
  await connection();
  const [pages, footer] = await Promise.all([
    readPages(),
    readFooter(),
  ]);

  return (
    <footer className="mt-16 border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="صفحه اصلی">
              <span className="text-xl font-extrabold text-[#111827]">روشن سپهر آماد صنعت</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
              {footer.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#111827]">{footer.quickLinksTitle}</h2>
            <nav className="mt-4 grid gap-3">
              {footer.quickLinks.map((link) => (
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
            <h2 className="text-sm font-extrabold text-[#111827]">{footer.contactTitle}</h2>
            <div className="mt-4 grid gap-4 text-sm text-[#6B7280]">
              <p className="flex items-start gap-3">
                <MapPin aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#2563EB]" />
                {pages.contact.address}
              </p>
              <p className="flex items-center gap-3">
                <Phone aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
                66391110
              </p>
              <div className="grid gap-3">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-3 transition hover:text-[#2563EB]"
                  >
                    <Icon aria-hidden="true" size={18} className="shrink-0 text-[#2563EB]" />
                    <span>{name}</span>
                    <span dir="ltr">@Rsamadsanat</span>
                  </a>
                ))}
              </div>
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://trustseal.enamad.ir/?id=8575206&Code=YxGfPEbac1aO9IjjLQk3FqqlPaw6Y7T3"
                aria-label="مشاهده نماد اعتماد الکترونیکی"
                className="inline-flex w-fit rounded-lg border border-[#E5E7EB] bg-white p-2 transition hover:border-[#2563EB]"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=8575206&Code=YxGfPEbac1aO9IjjLQk3FqqlPaw6Y7T3"
                  alt="نماد اعتماد الکترونیکی"
                  style={{ cursor: "pointer" }}
                  {...({ code: "YxGfPEbac1aO9IjjLQk3FqqlPaw6Y7T3" } as Record<string, string>)}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.managerCredit}</p>
          <p>{footer.designerCredit}</p>
        </div>
      </div>
    </footer>
  );
}

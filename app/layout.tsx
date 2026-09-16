import type { Metadata } from "next";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "فروشگاه من",
  description: "فروشگاه اینترنتی",
  other: {
    enamad: "65076408",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#F8FAFC] text-[#111827]">
        <Header />

        <main className="pb-20 lg:pb-0">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "روشن سپهر آماد صنعت",
  description: "",
  other: {
    enamad: "59943728",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#FFFAF3] text-[#292524]">
        <Header />

        <main className="pb-20 lg:pb-0">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
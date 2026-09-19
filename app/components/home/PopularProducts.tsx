import HomepageProductSection from "@/app/components/home/HomepageProductSection";

export default function PopularProducts() {
  return (
    <HomepageProductSection
      flag="isBestSelling"
      eyebrow="انتخاب مشتری‌ها"
      title="پرفروش‌ترین محصولات"
      badge="پرفروش"
      href="/products"
    />
  );
}
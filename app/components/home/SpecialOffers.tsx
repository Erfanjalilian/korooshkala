import HomepageProductSection from "@/app/components/home/HomepageProductSection";

export default function SpecialOffers() {
  return (
    <HomepageProductSection
      flag="isDiscounted"
      eyebrow="فرصت محدود"
      title="تخفیف‌های ویژه"
      badge="تخفیف ویژه"
      href="/products?discounted=true"
    />
  );
}
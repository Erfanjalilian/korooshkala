import HomepageProductSection from "@/app/components/home/HomepageProductSection";

export default function HottestProducts() {
  return (
    <HomepageProductSection
      flag="isHot"
      eyebrow="پرطرفدار بین کاربران"
      title="داغ‌ترین محصولات"
      badge="داغ"
      href="/products?sort=popular"
    />
  );
}
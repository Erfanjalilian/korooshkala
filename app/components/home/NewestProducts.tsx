import HomepageProductSection from "@/app/components/home/HomepageProductSection";

export default function NewestProducts() {
  return (
    <HomepageProductSection
      flag="isNew"
      eyebrow="تازه از راه رسیده"
      title="جدیدترین محصولات"
      badge="جدید"
      href="/products?sort=newest"
    />
  );
}
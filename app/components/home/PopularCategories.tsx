import { Coffee, Home, Laptop, Shirt, Sparkles, Watch } from "lucide-react";
import CategoryCard from "@/app/components/home/CategoryCard";

const popularCategories = [
  {
    title: "پوشاک",
    href: "/products?category=clothing",
    icon: Shirt,
  },
  {
    title: "ساعت و اکسسوری",
    href: "/products?category=watches-accessories",
    icon: Watch,
  },
  {
    title: "لوازم دیجیتال",
    href: "/products?category=digital",
    icon: Laptop,
  },
  {
    title: "قهوه و نوشیدنی",
    href: "/products?category=coffee-drinks",
    icon: Coffee,
  },
  {
    title: "لوازم خانه",
    href: "/products?category=home",
    icon: Home,
  },
  {
    title: "زیبایی و سلامت",
    href: "/products?category=beauty-health",
    icon: Sparkles,
  },
];

export default function PopularCategories() {
  return (
    <section aria-labelledby="popular-categories-title" className="mt-10 sm:mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-wide text-[#7C3AED]">
            انتخاب سریع
          </p>
          <h2
            id="popular-categories-title"
            className="text-xl font-extrabold text-[#111827] sm:text-2xl"
          >
            دسته‌بندی‌های محبوب
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-4">
        {popularCategories.map((category) => (
          <CategoryCard key={category.href} {...category} />
        ))}
      </div>
    </section>
  );
}
import HeroSlider from "@/app/components/home/HeroSlider";
import PopularCategories from "@/app/components/home/PopularCategories";
import PopularProducts from "@/app/components/home/PopularProducts";
import PromoBanner from "@/app/components/home/PromoBanner";
import ServiceBanner from "@/app/components/home/ServiceBanner";
import SpecialOffers from "@/app/components/home/SpecialOffers";
import NewestProducts from "@/app/components/home/NewestProducts";
import HottestProducts from "@/app/components/home/HottestProducts";
import FinalBanner from "@/app/components/home/FinalBanner";

export default function HeroSection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <HeroSlider />

      <PopularCategories />
      <PromoBanner />
      <PopularProducts />
      <ServiceBanner />
      <SpecialOffers />
      <NewestProducts />
      <HottestProducts />
      <FinalBanner />
    </div>
  );
}
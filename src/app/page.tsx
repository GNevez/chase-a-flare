import HeroSection from "@/components/HeroSection";
import { BenefitsBar } from "@/components/BenefitsBar";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PromoBar } from "@/components/PromoBar";
import { LifestyleShowcase } from "@/components/LifestyleShowcase";
import { BannerSection } from "@/components/BannerSection";
import NewCollection from "@/components/newCollection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <BenefitsBar />
        <ProductShowcase />
        <PromoBar />
        <NewCollection />
        <LifestyleShowcase />
        <BannerSection />
      </main>
    </div>
  );
}

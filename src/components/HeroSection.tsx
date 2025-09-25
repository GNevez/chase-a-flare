"use client";
import heroBanner from "@/assets/hero-banner.jpg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-80 md:min-h-screen md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner}
          alt="Young people wearing Chase a Flare sunglasses in urban environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>
      </div>
    </section>
  );
};

export default HeroSection;

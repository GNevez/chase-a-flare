"use client";
import React from "react";
import { LifestyleCard } from "./LifestyleCard";
import { motion } from "framer-motion"; 
import { useLifestyleShowcase } from "@/hooks/useLifestyleShowcase";

export const LifestyleShowcase: React.FC = () => {
  const { items, loading } = useLifestyleShowcase(5);

  // 2. Definir as variantes da animação para os cards
  const cardVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15, // Delay em cascata
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {(loading ? Array.from({ length: 5 }) : items).map(
            (item: any, index: number) => (
              // 3. Aplicar a animação no wrapper do card
              <motion.div
                key={item?.id ?? index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {loading ? (
                  <div className="aspect-[1/2] w-full bg-gray-200 animate-pulse rounded-2xl" />
                ) : (
                  <LifestyleCard
                    id={item.id}
                    name={item.name}
                    image={item.image}
                    videoUrl={item.videoUrl}
                    poster={item.poster}
                    slug={item.slug}
                  />
                )}
              </motion.div>
            )
          )}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {(loading ? Array.from({ length: 5 }) : items).map(
              (item: any, index: number) => (
                // 4. Aplicar a mesma animação no wrapper do carrossel
                <motion.div
                  key={item?.id ?? index}
                  className="flex-none w-48 snap-center"
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  {loading ? (
                    <div className="aspect-[1/2] w-full bg-gray-200 animate-pulse rounded-2xl" />
                  ) : (
                    <LifestyleCard
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      videoUrl={item.videoUrl}
                      poster={item.poster}
                      slug={item.slug}
                    />
                  )}
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

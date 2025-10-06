"use client";
import React from "react";
import { LifestyleCard } from "./LifestyleCard";
import { motion } from "framer-motion"; 

export const LifestyleShowcase: React.FC = () => {
  const products = [
    {
      id: "1",
      name: "Óculos de Sol Bali",
      price: 159.0,
      image:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      name: "Óculos de Sol Barra",
      price: 159.0,
      image:
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "3",
      name: "Óculos de Sol Diamond",
      price: 159.0,
      image:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "4",
      name: "Óculos de Sol Monaco",
      price: 159.0,
      image:
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "5",
      name: "Óculos de Sol Caraíva",
      price: 159.0,
      image:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

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
          {products.map((product, index) => (
            // 3. Aplicar a animação no wrapper do card
            <motion.div
              key={product.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <LifestyleCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {products.map((product, index) => (
              // 4. Aplicar a mesma animação no wrapper do carrossel
              <motion.div
                key={product.id}
                className="flex-none w-48 snap-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <LifestyleCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";
import React from "react";
import { LifestyleCard } from "./LifestyleCard";

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

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <LifestyleCard key={product.id} {...product} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-48 snap-center">
                <LifestyleCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

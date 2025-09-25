"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

export const ProductShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const itemsPerView = 4;

  const categories = [
    "ÓCULOS ANTI LUZ AZUL",
    "ÓCULOS DE SOL",
    "ÓCULOS 2 EM 1 CLIP-ON",
  ];

  const products = [
    {
      id: "1",
      name: "Óculos Aros - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 219.9,
      discount: 26,
      colors: 3,
      installments: "3x de R$ 73,30 sem juros",
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      name: "Óculos Sofia - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 199.9,
      discount: 33,
      colors: 2,
      installments: "3x de R$ 66,63 sem juros",
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/372787/pexels-photo-372787.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "3",
      name: "Óculos Bari - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 219.9,
      discount: 26,
      colors: 3,
      installments: "3x de R$ 73,30 sem juros",
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/372787/pexels-photo-372787.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "4",
      name: "Óculos Meco - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 229.9,
      colors: 2,
      installments: "3x de R$ 99,96 sem juros",
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1161458/pexels-photo-1161458.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "5",
      name: "Óculos Rivo - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 249.9,
      colors: 4,
      installments: "3x de R$ 83,30 sem juros",
      isOutOfStock: true,
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/1161458/pexels-photo-1161458.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "6",
      name: "Óculos Luna - Anti Luz Azul",
      originalPrice: 299.9,
      salePrice: 199.9,
      discount: 33,
      colors: 3,
      installments: "3x de R$ 66,63 sem juros",
      category: "ÓCULOS ANTI LUZ AZUL",
      image:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    // Produtos de Óculos de Sol
    {
      id: "7",
      name: "Óculos Ray-Ban - Aviador",
      originalPrice: 399.9,
      salePrice: 299.9,
      discount: 25,
      colors: 4,
      installments: "3x de R$ 99,97 sem juros",
      category: "ÓCULOS DE SOL",
      image:
        "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1161458/pexels-photo-1161458.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "8",
      name: "Óculos Oakley - Esportivo",
      originalPrice: 449.9,
      salePrice: 349.9,
      discount: 22,
      colors: 3,
      installments: "3x de R$ 116,63 sem juros",
      category: "ÓCULOS DE SOL",
      image:
        "https://images.pexels.com/photos/372787/pexels-photo-372787.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "9",
      name: "Óculos Prada - Clássico",
      originalPrice: 599.9,
      salePrice: 449.9,
      discount: 25,
      colors: 2,
      installments: "3x de R$ 149,97 sem juros",
      category: "ÓCULOS DE SOL",
      image:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1127000/pexels-photo-1127000.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    // Produtos de Óculos 2 em 1 Clip-on
    {
      id: "10",
      name: "Óculos Clip-on Premium",
      originalPrice: 199.9,
      salePrice: 149.9,
      discount: 25,
      colors: 3,
      installments: "3x de R$ 49,97 sem juros",
      category: "ÓCULOS 2 EM 1 CLIP-ON",
      image:
        "https://images.pexels.com/photos/1161458/pexels-photo-1161458.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/372787/pexels-photo-372787.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "11",
      name: "Óculos Clip-on Magnético",
      originalPrice: 249.9,
      salePrice: 179.9,
      discount: 28,
      colors: 2,
      installments: "3x de R$ 59,97 sem juros",
      category: "ÓCULOS 2 EM 1 CLIP-ON",
      image:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
      image2:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  // Filtrar produtos pela categoria ativa
  const filteredProducts = products.filter(
    (product) => product.category === categories[activeCategory]
  );

  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };


  const handleCategoryChange = (categoryIndex: number) => {
    setActiveCategory(categoryIndex);
    setCurrentIndex(0); 
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Botões de categoria - responsivos */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(index)}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  index === activeCategory
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Carousel com botões */}
        <div className="hidden md:block relative">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          <div className="overflow-hidden mx-12">
            <div
              className="flex space-x-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex-none w-64">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Carousel horizontal arrastável */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex-none w-64 snap-center">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/collection/productCard";
import { Product, Category } from "@/interface/collection/products";

import productsData from "@/hooks/temp-data/products.json";
import categoriesData from "@/hooks/temp-data/categories.json";

export const ProductShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(1);
  const itemsPerView = 4;

  const categories: Category[] = categoriesData;

  const products: Product[] = productsData;

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
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
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  category.id === activeCategory
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-gray-100"
                }`}
              >
                {category.name}
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
                  <ProductCard product={product} key={product.id} />
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
                <ProductCard product={product} key={product.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

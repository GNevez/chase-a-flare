// components/RelatedProducts.tsx
import React, { useRef } from "react";
import { ProductCard } from "@/components/collection/productCard";

interface Product {
  id: number;
  nome: string;
  sku: string;
  slug: string;
  preco: number;
  precoOriginal?: number;
  isSale?: boolean;
  isNew?: boolean;
  imagemPrincipal: string;
  imagemHover?: string;
  categoriaNome: string;
  coresDisponiveis: Array<{
    id: number;
    nome: string;
    hex1?: string;
    hex2?: string;
    quantidadeEstoque: number;
    imagens: Array<{
      id: number;
      url: string;
    }>;
  }>;
}

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 lg:mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
          Talvez você goste
        </h2>
        <p className="text-primary/60 text-lg">
          Produtos selecionados especialmente para você
        </p>
      </div>

      {/* Carrossel Container */}
      <div className="relative group">
        {/* Botões de navegação */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-accent text-primary hover:text-white shadow-xl rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-accent text-primary hover:text-white shadow-xl rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Carrossel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
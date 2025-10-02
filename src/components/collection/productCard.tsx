import React, { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Product } from "@/interface/collection/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <div
      key={product.id}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
    >
      {/* Imagem com hover */}
      <div className="relative w-full h-80">
        {/* Hover image */}
        <Image
          src={(product as any).imageHover || product.image}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
        />
        {/* Default image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-700 group-hover:opacity-0"
        />
        {product.isSale && product.originalPrice && (
          <Badge
            variant="none"
            className="absolute top-3 left-3 bg-accent text-primary font-semibold rounded-md"
          >
            -{calculateDiscount(product.originalPrice, product.price)}%
          </Badge>
        )}
      </div>

      {/* Overlay só com blur */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="p-4 text-white">
          <h3 className="text-lg md:text-xl font-bold mb-1">{product.name}</h3>
          <p className="text-md font-semibold">{formatPrice(product.price)}</p>
          {/* Cores */}
          <div className="flex space-x-2 mt-2">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-white shadow"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

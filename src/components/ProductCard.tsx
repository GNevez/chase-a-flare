import React, { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  originalPrice: number;
  salePrice?: number;
  discount?: number;
  colors: number;
  installments?: string;
  isOutOfStock?: boolean;
  category?: string;
  image: string;
  image2: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  originalPrice,
  salePrice,
  discount,
  colors,
  installments,
  isOutOfStock,
  category,
  image,
  image2,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) =>
    `R$ ${price.toFixed(2).replace(".", ",")}`;

  return (
    <div className="rounded-2xl transition-shadow duration-300 overflow-hidden">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={isHovered && image2 ? image2 : image}
          alt={name}
          width={400}
          height={400}
          className="w-full h-48 object-contain bg-gray-50 p-4 transition-opacity duration-300"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm font-medium">
            -{discount}%
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-primary px-3 py-1 rounded text-sm font-bold">
            ESGOTADO
          </span>
        )}
      </div>

      <div className="p-4">
        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
            {category}
          </span>
        )}

        <h3
          className="font-semibold text-primary mb-2 line-clamp-2 cursor-pointer hover:text-primary/80 transition-colors duration-200"
        >
          {name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          {salePrice ? (
            <>
              <span className="text-lg text-primary">
                {formatPrice(salePrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {installments && (
          <p className="text-xs text-gray-500 mb-2">{installments}</p>
        )}

        <p className="text-xs text-gray-500 mb-4">{colors} CORES DISPONÍVEIS</p>
      </div>
    </div>
  );
};

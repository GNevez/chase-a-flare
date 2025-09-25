"use client";
import React from "react";

export const PromoBar: React.FC = () => {
  const promoText =
    "RELÂMPAGO | COMPRE 2 LEVE 3 | CUPOM: PROMO3X2 | PROMO RELÂMPAGO | COMPRE 2 LEVE 3 | CUPOM: PROMO3X2 | PROMO RELÂMPAGO | COMPRE 2 LEVE 3 | CUPOM: PROMO3X2";

  return (
    <div className="bg-yellow-400 text-gray-800 py-2 overflow-hidden relative">
      <div className="flex animate-marquee">
        <span className="text-sm font-bold tracking-wider whitespace-nowrap flex-shrink-0">
          {promoText}
        </span>
        <span className="text-sm font-bold tracking-wider whitespace-nowrap flex-shrink-0 ml-8">
          {promoText}
        </span>
      </div>
    </div>
  );
};

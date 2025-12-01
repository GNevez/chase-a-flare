"use client";
import React from "react";
import { useMarqueeQueue } from "../hooks/useMarqueeQueue";

export const PromoBar: React.FC = () => {
  const PHRASE_LIST = [
    "RELÂMPAGO",
    "COMPRE 2 LEVE 3",
    "CUPOM: CAF10OFF",
    "CHASE A FLARE",
    "FRETE GRÁTIS ACIMA DE R$150",
  ];
  const phrases = PHRASE_LIST; // pass raw list; hook will append separator

  const options = {
    pixelsPerSecond: 100,
    gapPx: 8,
    separator: " | ",
    textClass: "text-gray-800",
    bgClass: "bg-yellow-400",
  };

  const {
    containerRef,
    innerRef,
    measureRef,
    measureNodes,
    setPixelsPerSecond,
  } = useMarqueeQueue(phrases, options);

  // example: you can call setPixelsPerSecond(220) to adjust speed dynamically

  return (
    <div
      className={`${options.bgClass} ${options.textClass} py-2 overflow-hidden relative`}
    >
      <div ref={containerRef} className="overflow-hidden">
        <div
          ref={innerRef}
          className="flex promo-inner"
          style={{ transform: "translateX(0)" }}
        />
      </div>

      {/* measurement container (hidden) */}
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          height: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {measureNodes as React.ReactNode}
      </div>
    </div>
  );
};

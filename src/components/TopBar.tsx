"use client";
import React from "react";
import { useMarqueeQueue } from "../hooks/useMarqueeQueue";

type TopBarProps = {
  isFixed?: boolean;
};

export const TopBar: React.FC<TopBarProps> = ({ isFixed = true }) => {
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
    gapPx: 1,
    separator: " • ",
    textClass: "text-accent",
    bgClass: "bg-trasnparent",
  };

  const {
    containerRef,
    innerRef,
    measureRef,
    measureNodes,
    setPixelsPerSecond,
  } = useMarqueeQueue(phrases, options);

  const rootPositionClass = isFixed ? "fixed top-0 left-0 right-0" : "relative w-full";

  return (
    // root is always full-width (background spans viewport). inner wrapper aligns content when embedded
    <div className={`${options.bgClass} ${options.textClass} py-2 overflow-hidden ${rootPositionClass}`}>
      <div className={isFixed ? "w-full" : ""}>
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
    </div>
  );
};

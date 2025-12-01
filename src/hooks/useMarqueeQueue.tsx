"use client";
import React, { useEffect, useRef, useState } from "react";

export type MarqueeOptions = {
  pixelsPerSecond?: number;
  gapPx?: number; // extra padding between phrases
  pauseOnHover?: boolean;
  separator?: string; // string placed after each phrase, e.g. ' | '
  // Use Tailwind class names (or any CSS class) to style text and background
  textClass?: string; // e.g. 'text-gray-800'
  bgClass?: string; // e.g. 'bg-yellow-400'
};

export type MarqueeHookReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  innerRef: React.RefObject<HTMLDivElement | null>;
  measureRef: React.RefObject<HTMLDivElement | null>;
  measureNodes: React.ReactNode[];
  setPixelsPerSecond: (v: number) => void;
  pause: () => void;
  resume: () => void;
};

export function useMarqueeQueue(phrases: string[], opts?: MarqueeOptions): MarqueeHookReturn {
  const { pixelsPerSecond = 160, gapPx = 8, pauseOnHover = false, separator = ' | ', textClass, bgClass } = opts || {};

  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const nextIndexRef = useRef(0);
  const widthsRef = useRef<number[]>([]);

  const [currentSpeed, setCurrentSpeed] = useState(pixelsPerSecond);

  // measure widths and populate inner container imperatively
  const measureAll = () => {
    const measureEl = measureRef.current;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!measureEl || !container || !inner) return;

    const spans = Array.from(
      measureEl.querySelectorAll("span[data-measure-key]")
    ) as HTMLElement[];
    const newWidths = spans.map((s) => s.offsetWidth + gapPx || 0);
    widthsRef.current = newWidths;

    const cw = container.getBoundingClientRect().width;

    inner.innerHTML = "";
    let total = 0;
    let idx = 0;
    while (total < cw + (newWidths[0] || 100) && idx < 2000) {
      const i = idx % phrases.length;
      const span = document.createElement("span");
      span.className = [
        "text-sm font-bold tracking-wider whitespace-nowrap flex-shrink-0 pr-2",
        textClass || "",
      ]
        .filter(Boolean)
        .join(" ");
      span.textContent = `${phrases[i]}${separator}`;
      span.setAttribute("data-phrase-index", String(i));
      inner.appendChild(span);
      total += newWidths[i] || 0;
      idx++;
    }

    nextIndexRef.current = idx % phrases.length;
    posRef.current = 0;
    inner.style.transform = "translateX(0px)";
  };

  useEffect(() => {
    measureAll();
    window.addEventListener("resize", measureAll);
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(measureAll).catch(() => {});
    }
    return () => window.removeEventListener("resize", measureAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join("||")]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || widthsRef.current.length === 0) return;

    const step = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      posRef.current -= currentSpeed * delta;

      const firstEl = inner.children[0] as HTMLElement | undefined;
      if (!firstEl) return;
      const firstWidth = firstEl.offsetWidth || (widthsRef.current[0] || 100);

      if (-posRef.current >= firstWidth) {
        posRef.current += firstWidth;
        const moved = inner.children[0] as HTMLElement;
        const next = nextIndexRef.current;
        moved.textContent = `${phrases[next]}${separator}`;
        moved.setAttribute("data-phrase-index", String(next));
        inner.appendChild(moved);
        nextIndexRef.current = (next + 1) % phrases.length;
      }

      inner.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
    // currentSpeed intentionally included so changing speed updates the loop
  }, [currentSpeed, phrases]);

  const setPixelsPerSecond = (v: number) => setCurrentSpeed(v);
  const pause = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };
  const resume = () => {
    if (!rafRef.current) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame((ts) => {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(() => {});
      });
      setCurrentSpeed((s) => s);
    }
  };

  const measureNodes: React.ReactNode[] = phrases.map((p, i) => (
    <span
      key={i}
      data-measure-key={i}
      className={["text-sm font-bold tracking-wider whitespace-nowrap", textClass || ""].filter(Boolean).join(" ")}
    >
      {`${p}${separator}`}
    </span>
  ));
  return {
    containerRef,
    innerRef,
    measureRef,
    measureNodes,
    setPixelsPerSecond,
    pause,
    resume,
  } as MarqueeHookReturn;
}

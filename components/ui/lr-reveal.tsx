"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wrapper that gives its children the home-hero checklist reveal (`.lr-pain` / `.lr-gain` rules in
 * globals.css). Adds `lr-check` and switches on `lr-play` once it scrolls into view.
 * Give list items `style={{ "--i": index }}` to stagger them.
 */
export function LrReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setPlay(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`lr-check ${play ? "lr-play" : ""} ${className}`}>{children}</div>;
}

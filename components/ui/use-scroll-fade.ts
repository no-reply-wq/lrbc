"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Site-wide "quote" animation: the words of a statement start faint and fill in one by one as the
 * visitor scrolls past it. Use it on every quote / statement paragraph so they all behave the same.
 *
 *   const ref = useScrollFadeWords<HTMLParagraphElement>();
 *   <Et as="p" ref={ref} reload id="..." def="..." />
 *
 * Pass `reload` on the Et so the backend editor re-renders it after a text edit.
 * Does nothing when the visitor prefers reduced motion.
 */
export function useScrollFadeWords<T extends HTMLElement = HTMLElement>(wordsClass?: string) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create(el, { type: "words", ...(wordsClass ? { wordsClass } : {}) });
      gsap.set(split.words, { opacity: 0.35 });
      gsap.to(split.words, {
        opacity: 1,
        ease: "none",
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: "top 85%", end: "+=480", scrub: true },
      });
      return () => split.revert();
    },
    { scope: ref }
  );
  return ref;
}


/** Same idea as useScrollFadeWords, but each LINE of the statement fills in, one after another. */
export function useScrollFadeLines<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create(el, { type: "lines", autoSplit: true });
      gsap.set(split.lines, { opacity: 0.3 });
      gsap.to(split.lines, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: { trigger: el, start: "top 85%", end: "+=320", scrub: true },
      });
      return () => split.revert();
    },
    { scope: ref }
  );
  return ref;
}

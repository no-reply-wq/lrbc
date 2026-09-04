"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface Props {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: Props) {
  useGSAP(() => {
    let smoother = ScrollSmoother.get();

    if (!smoother) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true,
      });
    }

    return () => {
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}
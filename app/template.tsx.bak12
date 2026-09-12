"use client";

import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const tl = gsap.timeline();

    // Start hidden above viewport
    gsap.set(overlayRef.current, {
      yPercent: 0,
    });

    // CLOSE
    tl.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.5,
      ease: "power4.inOut",
    });

    // OPEN
    tl.to(overlayRef.current, {
      yPercent: 100,
      duration: 0.9,
      ease: "power4.inOut",
    });

    // Reset for next route change
    tl.set(overlayRef.current, {
      yPercent: -100,
    });
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-background"
      />

      {children}
    </>
  );
}
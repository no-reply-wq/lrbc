"use client";

import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const tl = gsap.timeline();

    // Curtain covers the page, logo + bar visible
    gsap.set(overlayRef.current, { yPercent: 0 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(barRef.current, { scaleX: 0 });

    tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" })
      .to(barRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, "-=0.15")
      .to(logoRef.current, { opacity: 0, duration: 0.2, ease: "power1.in" })
      // Curtain slides down to reveal the page
      .to(overlayRef.current, { yPercent: 100, duration: 0.8, ease: "power4.inOut" }, "-=0.05")
      // Reset above the viewport for the next route
      .set(overlayRef.current, { yPercent: -100 });
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      >
        <div ref={logoRef} className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <Image src="/images/icon.png" alt="LRBC" fill className="object-contain" priority />
          </div>
          <div className="text-center leading-tight">
            <p className="text-lg font-bold tracking-tight text-foreground">LRBC</p>
            <p className="text-xs tracking-wide text-muted-foreground">Business Consulting</p>
          </div>
          <div className="mt-2 h-0.5 w-40 overflow-hidden rounded-full bg-primary/15">
            <div ref={barRef} className="h-full w-full origin-left rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {children}
    </>
  );
}

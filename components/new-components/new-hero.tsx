"use client"
import MagneticButton from '@/components/MagneticButton';

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoltenMetal from "./MoltenMetal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface NewHeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  badgeText?: string;
  className?: string;
  badgeIcon?: LucideIcon;
}

export default function NewHeroSection({
  title,
  subtitle,
  buttonText,
  buttonHref,
  badgeText,
  className = "",
}: NewHeroSectionProps) {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const badgeLogoRef  = useRef<HTMLSpanElement>(null);
  const badgeTextRef  = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !subtitleRef.current) return;

    const heading  = SplitText.create(headingRef.current, { type: "lines", mask: "lines" });
    const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines" });

    // Badge: starts centered. Logo slides left, text fades in alongside.
    if (badgeRef.current && badgeLogoRef.current && badgeTextRef.current) {
      gsap.set(badgeRef.current,    { opacity: 0 });
      gsap.set(badgeTextRef.current, { opacity: 0, x: 8, clipPath: "inset(0 100% 0 0)" });
    }
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0, y: 25, filter: "blur(10px)" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Badge fades in
    if (badgeRef.current) {
      tl.to(badgeRef.current, { opacity: 1, duration: 0.5 }, 0.1);
    }
    // 2. Badge text slides in
    if (badgeTextRef.current) {
      tl.to(badgeTextRef.current, {
        opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.8,
      }, 0.3);
    }
    // 3. Heading chars cascade
    tl.from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.5);
    // 4. Subtitle lines
    tl.from(subtitle.lines, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.35");
    // 5. CTA
    if (ctaRef.current) {
      tl.to(ctaRef.current, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, "-=0.4");
    }
  }, { scope: sectionRef });

  return (
    <section
      className={`relative isolate overflow-hidden pb-0 ${className}`}
      ref={sectionRef}
    >
      {/* Interactive background */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF" color2="#FF9FFC" color3="#FFFFFF"
          speed={0.35} scale={4} detail={3} glow={1.6} coreSize={0.1}
          swirl={1} fold={-0.2} blackPoint={0.05} brightness={1.3}
          colorMode="molten" grain grainIntensity={0.05}
          mouseInteraction mouseStrength={0.3} opacity={1}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 sm:px-6 pt-28 pb-12 sm:pt-32 sm:pb-16 pointer-events-none">
        <div className="mx-auto w-full max-w-5xl text-center">

          {/* Badge — Logo style matching header (no white background box) */}
          {badgeText && (
            <div
              ref={badgeRef}
              className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-background/20 backdrop-blur-md px-3 py-1.5 overflow-hidden"
            >
              <span ref={badgeLogoRef} className="flex h-6 w-6 shrink-0 items-center justify-center">
                <Image
                  src="/images/icon.png"
                  alt="LRBC"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </span>
              <span
                ref={badgeTextRef}
                className="text-[10px] sm:text-xs font-medium text-foreground"
              >
                {badgeText}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            ref={headingRef}
            className="overflow-hidden mx-auto mt-6 max-w-5xl text-balance font-semibold tracking-tight text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className="overflow-hidden mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {subtitle}
          </div>

          {/* CTA */}
          {buttonText && buttonHref && (
            <div
              ref={ctaRef}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pointer-events-auto"
            >
              <div className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5">
                <MagneticButton strength={0.3} radius={80} className="w-full sm:w-auto">
                  <Button asChild size="lg" className="rounded-xl px-5 text-base w-full sm:w-auto">
                    <Link href="/contact?openForm=true">
                      <span className="text-nowrap">Contact our team</span>
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
              <Button asChild size="lg" variant="ghost" className="rounded-xl px-5 w-full sm:w-auto">
                <Link href={buttonHref}>
                  <span className="text-nowrap">{buttonText}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
"use client"
import MagneticButton from '@/components/MagneticButton';

import React, { useRef } from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Et } from "@/components/cms/editable";
import Image from "next/image";
import MoltenMetal from "./MoltenMetal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { padMasks, REVEAL_Y } from "@/lib/split-safe";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface NewHeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  badgeText?: string;
  className?: string;
  badgeIcon?: LucideIcon;
  /** Optional right-half content (shown beside the text on large screens, below it on mobile) */
  aside?: React.ReactNode;
  /** Replaces the secondary (ghost) button, e.g. a Download Brochure button */
  secondaryAction?: React.ReactNode;
  /** When set, the badge and main button label become editable from the backend editor (ids start with this) */
  cmsId?: string;
}

export default function NewHeroSection({
  title,
  subtitle,
  buttonText,
  buttonHref,
  badgeText,
  className = "",
  aside,
  secondaryAction,
  cmsId,
}: NewHeroSectionProps) {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !subtitleRef.current) return;

    const heading  = SplitText.create(headingRef.current, { type: "lines", mask: "lines", onSplit: padMasks });
    const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines", onSplit: padMasks });

    // Badge: simple fade + slide (no clip-path, so no artefacts)
    if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 0, y: 10 });
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0, y: 25, filter: "blur(10px)" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Badge fades in
    if (badgeRef.current) {
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
    }
    // 3. Heading chars cascade
    tl.from(heading.lines, { yPercent: REVEAL_Y, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.5);
    // 4. Subtitle lines
    tl.from(subtitle.lines, { yPercent: REVEAL_Y, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.35");
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
      <div className="absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 flex ${aside ? "lg:min-h-0" : "min-h-[78svh]"} items-center justify-center px-4 sm:px-6 pt-28 pb-6 sm:pt-32 sm:pb-8 pointer-events-none`}>
        <div className={aside ? "mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14" : "mx-auto w-full max-w-5xl"}>
        <div className={aside ? "min-w-0 text-center lg:text-left" : "text-center"}>

          {/* Badge: the shared eyebrow pill */}
          {badgeText && (
            <div
              ref={badgeRef}
              className={`lrbc-eyebrow-row ${aside ? "lg:!justify-start max-sm:hidden" : ""}`}
            >
              <span className="lrbc-eyebrow !inline-flex items-center gap-2">
                <Image src="/images/icon.png" alt="LRBC" width={18} height={18} className="h-[18px] w-[18px] shrink-0 object-contain" />
                {cmsId ? <Et id={`${cmsId}.badge`} def={badgeText} /> : badgeText}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            ref={headingRef}
            className={`overflow-hidden lrbc-clip-safe mx-auto ${aside ? "lg:mx-0" : ""} mt-6 max-w-5xl text-balance font-semibold tracking-tight text-foreground text-4xl sm:text-5xl md:text-6xl ${aside ? "lg:text-5xl xl:text-6xl" : "lg:text-7xl xl:text-[5.25rem]"}`}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className={`overflow-hidden lrbc-clip-safe mx-auto ${aside ? "lg:mx-0" : ""} mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg`}
          >
            {subtitle}
          </div>

          {/* CTA */}
          {buttonText && buttonHref && (
            <div
              ref={ctaRef}
              className={`mt-8 flex flex-col sm:flex-row justify-center ${aside ? "lg:justify-start" : ""} gap-3 sm:gap-4 pointer-events-auto`}
            >
              <div className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5">
                <MagneticButton strength={0.3} radius={80} className="w-full sm:w-auto">
                  <Button asChild size="lg" className="rounded-xl px-5 text-base w-full sm:w-auto">
                    <Link href="/contact?openForm=true">
                      <span className="text-nowrap">{cmsId ? <Et id={`${cmsId}.cta`} def="Contact our team" /> : "Contact our team"}</span>
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
              {secondaryAction ?? (
                <Button asChild size="lg" variant="ghost" className="rounded-xl px-5 w-full sm:w-auto">
                  <Link href={buttonHref}>
                    <span className="text-nowrap">{buttonText}</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
        {aside && <div className="pointer-events-auto min-w-0">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
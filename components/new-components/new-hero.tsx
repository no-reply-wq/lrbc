"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { HomeIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoltenMetal from "./MoltenMetal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger"


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
  badgeIcon: BadgeIcon,
  className = "",
}: NewHeroSectionProps) {


  const sectionRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {

      const heading = SplitText.create(headingRef.current, {
        type: "chars",
        charsClass: "char",
      });

      const subtitle = SplitText.create(subtitleRef.current, {
        type: "lines",
        mask: "lines",
      });

      if (quoteRef.current) {
        gsap.set(quoteRef.current, {
          opacity: 0,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",

        },
      });

      tl.from(
        heading.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
        }
      )

        .from(
          subtitle.lines,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.4"
        )



       if (quoteRef.current) {
  tl.fromTo(
    quoteRef.current,
    {
      y: 25,
      opacity: 0,
      filter: "blur(10px)",
    },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power2.out",
    },
    "-=0.5"
  );
}





    },
    {
      scope: sectionRef,
    }
  );



  return (
    <section
      className={`relative isolate min-h-screen overflow-hidden ${className}`}
      ref={sectionRef}
    >
      {/* Interactive background */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
      </div>

      {/* Bottom gradient fade — blends hero into the next section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

      {/* Content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-24
          pointer-events-none
        "
      >
        <div className="mx-auto w-full max-w-5xl text-center">
          {/* Badge */}
          {badgeText && (
            <div
              className="
                mx-auto
                flex
                w-fit
                items-center
                gap-3
                rounded-full
                border
                border-white/30
                bg-white/10
                p-1
                pl-1
                pr-3
                backdrop-blur-md
              "
            >

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                {BadgeIcon && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                    <BadgeIcon className="h-4 w-4" />
                  </span>
                )}
              </span>


              <span className="text-sm font-medium text-foreground">
                {badgeText}
              </span>

            </div>
          )}

          {/* Title */}
          <div ref={headingRef} className="overflow-hidden mx-auto mt-8 max-w-5xl text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {title}
          </div>

          {/* Subtitle */}
          <div ref={subtitleRef} className="overflow-hidden mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {subtitle}
          </div>

          {/* CTA */}
          {buttonText && buttonHref && (
            <div
              className="
                mt-10
                flex
                justify-center
                gap-5
                pointer-events-auto
              "
            >
              {/* Primary */}
              <div ref={quoteRef} className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-5 text-base"
                >
                  <Link href="/contact?openForm=true">
                    <span className="text-nowrap">
                      Contact our team
                    </span>
                  </Link>
                </Button>
              </div>

              {/* Secondary */}
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-10.5 rounded-xl px-5"
              >
                <Link href={buttonHref}>
                  <span className="text-nowrap">
                    {buttonText}
                  </span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
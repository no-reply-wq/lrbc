"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import WorkPilotMini from "@/components/workpilot-mini";
import MagneticButton from "@/components/MagneticButton";
import { ERPRequestModal } from "@/components/ERPRequestModal";
import { Check, CheckCircle2 } from "lucide-react";
import { Et, Hide, Lnk, useVal } from "@/components/cms/editable";
import { padMasks, REVEAL_Y } from "@/lib/split-safe";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FEATURES = [
  "Live attendance tracking",
  "Smart task assignment",
  "Performance dashboards",
  "Activity history logs",
];

export default function WorkPilotHero() {
  const demoLabel = useVal("workpilot.hero.cta", "Book Demo");
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !subtitleRef.current) return;
    const heading  = SplitText.create(headingRef.current,  { type: "lines", mask: "lines", onSplit: padMasks });
    const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines", onSplit: padMasks });
    gsap.set(badgeRef.current, { opacity: 0, y: 10 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 60%" } });
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5 })
      .from(heading.lines,  { yPercent: REVEAL_Y, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.2")
      .from(subtitle.lines, { yPercent: REVEAL_Y, stagger: 0.08, duration: 0.7, ease: "power3.out" }, "-=0.5");
  }, { scope: sectionRef });

  return (
    <Hide id="workpilot.hero.sec">
    <section ref={sectionRef} className="relative overflow-hidden bg-background">

      {/* Same radial gradient used across all pages — no external image */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(270,80%,60%,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="relative pt-24 md:pt-36 pb-0">
        {/* Fade to background at bottom */}
        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

        {/* TOP — badge + heading + subtitle + CTA (centred) */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">

            {/* Eyebrow pill badge */}
            <div ref={badgeRef} className="lrbc-eyebrow-row">
              <Et as="span" id="workpilot.hero.badge" def="WorkPilot" className="lrbc-eyebrow" />
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="mx-auto mt-6 max-w-5xl text-center text-3xl font-bold sm:text-5xl lg:mt-12 xl:text-[5.25rem] xl:leading-[1.05]"
            >
              <Et id="workpilot.hero.title1" def="Your Team." reload className="block overflow-hidden lrbc-clip-safe" />
              <Et id="workpilot.hero.title2" def="Always Visible." reload className="block overflow-hidden lrbc-clip-safe" />
            </h1>

            {/* Subtitle */}
            <Et
              as="p"
              id="workpilot.hero.subtitle"
              def="WorkPilot brings attendance, task allocation, and performance tracking into one centralized platform — so you spend less time chasing updates and more time building your business."
              reload
              ref={subtitleRef}
              className="mx-auto mt-5 max-w-2xl text-center text-base sm:text-lg text-muted-foreground px-2 lrbc-clip-safe"
            />

            {/* Book Demo button */}
            <div className="mt-8 sm:mt-10 flex justify-center">
              <MagneticButton strength={0.3} radius={80}>
                <ERPRequestModal
                  buttonText={demoLabel}
                  showArrow
                  className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full bg-primary text-primary-foreground text-base font-semibold transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02]"
                />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* BOTTOM — features left, live dashboard right */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 pb-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">

            {/* Feature pills */}
            <div>
              <Et as="p" id="workpilot.hero.listTitle" def="What WorkPilot does" className="text-sm font-semibold uppercase tracking-widest text-primary mb-5" />
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map((f, i) => (
                  <Hide key={f} id={`workpilot.hero.feature.${i}`}>
                  <div
                    className="flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white"><Check className="h-3 w-3" strokeWidth={3.5} /></span>
                    <Et id={`workpilot.hero.feature.${i}.text`} def={f} />
                  </div>
                  </Hide>
                ))}
              </div>
              <div className="mt-8">
                <MagneticButton strength={0.25} radius={70}>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                    <Lnk id="workpilot.hero.featuresLink" href="#features" labelId="workpilot.hero.featuresLabel" label="See all features" />
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Live WorkPilot dashboard */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-4 py-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <Et id="workpilot.hero.dashLabel" def="WorkPilot" className="ml-2 text-[10px] text-muted-foreground font-medium" />
                </div>
                <div className="h-[420px]">
                  <WorkPilotMini />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
    </Hide>
  );
}
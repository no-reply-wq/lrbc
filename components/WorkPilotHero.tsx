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
import ContactFormModal from "@/components/ContactFormModal";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FEATURES = [
  "Live attendance tracking",
  "Smart task assignment",
  "Performance dashboards",
  "Activity history logs",
];

export default function WorkPilotHero() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !subtitleRef.current) return;
    const heading  = SplitText.create(headingRef.current,  { type: "lines", mask: "lines" });
    const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines" });
    gsap.set(badgeRef.current, { opacity: 0, y: 10 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 60%" } });
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5 })
      .from(heading.lines,  { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.2")
      .from(subtitle.lines, { yPercent: 100, stagger: 0.08, duration: 0.7, ease: "power3.out" }, "-=0.5");
  }, { scope: sectionRef });

  return (
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

            {/* WorkPilot pill badge */}
            <div
              ref={badgeRef}
              className="hover:bg-background overflow-hidden dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
            >
              <span className="text-foreground text-sm">WorkPilot</span>
              <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="mx-auto mt-6 max-w-5xl text-center text-3xl font-bold sm:text-5xl lg:mt-12 xl:text-[5.25rem] xl:leading-[1.05]"
            >
              <span className="block overflow-hidden">Your Team.</span>
              <span className="block overflow-hidden">Always Visible.</span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mx-auto mt-5 max-w-2xl text-center text-base sm:text-lg text-muted-foreground px-2"
            >
              WorkPilot brings attendance, task allocation, and performance
              tracking into one centralized platform — so you spend less time
              chasing updates and more time building your business.
            </p>

            {/* Book Demo button */}
            <div className="mt-8 sm:mt-10">
              <MagneticButton strength={0.3} radius={80}>
                <ContactFormModal
                  buttonText="Book Demo"
                  showArrow
                  className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full bg-primary text-primary-foreground text-base font-semibold transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02]"
                />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* BOTTOM — features left, live dashboard right */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 pb-16">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">

            {/* Feature pills */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-5">
                What WorkPilot does
              </p>
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <MagneticButton strength={0.25} radius={70}>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                    <Link href="#features">See all features ↓</Link>
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
                  <span className="ml-2 text-[10px] text-muted-foreground font-medium">WorkPilot</span>
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
  );
}
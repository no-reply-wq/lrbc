"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import WorkPilotMini from "@/components/workpilot-mini";
import MagneticButton from "@/components/MagneticButton";
import ContactFormModal from "@/components/ContactFormModal";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

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

    gsap.set([badgeRef.current], { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
    });

    tl.to(badgeRef.current, { opacity: 1, duration: 0.5 })
      .from(heading.lines,  { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.2")
      .from(subtitle.lines, { yPercent: 100, stagger: 0.08, duration: 0.7, ease: "power3.out" }, "-=0.5");
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="overflow-hidden">

      {/* Same radial gradient bg as LekhaSetu */}
      <div aria-hidden className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
      </div>

      <div>
        <div className="relative pt-24 md:pt-36">

          {/* Background image overlay — same as LekhaSetu */}
          <AnimatedGroup variants={{
            container: { visible: { transition: { delayChildren: 1 } } },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 2 } },
            },
          }} className="mask-y-from-35% mask-y-to-90% absolute inset-0 top-56 lg:top-12">
            <Image
              src="https://images.unsplash.com/photo-1662285064441-bedb11ca7e47?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="background"
              className="hidden size-full mix-blend-overlay dark:block"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>

          <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

          {/* TOP SECTION — badge + heading + subtitle + button (centered like LekhaSetu) */}
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">

              {/* Pill badge — "WorkPilot" same style as "LekhaSetu" badge */}
              <div
                ref={badgeRef}
                className="hover:bg-background overflow-hidden dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
              >
                <span className="text-foreground text-sm">WorkPilot</span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />
              </div>

              {/* Heading */}
              <div className="overflow-hidden">
                <h1
                  ref={headingRef}
                  className="overflow-hidden mx-auto mt-5 max-w-5xl flex flex-col text-center text-2xl font-bold sm:text-4xl md:text-5xl lg:mt-12 xl:text-[5.25rem]"
                >
                  <span className="overflow-hidden">Your Team.</span>
                  <span className="overflow-hidden">Always Visible.</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="overflow-hidden">
                <p
                  ref={subtitleRef}
                  className="mx-auto mt-5 max-w-2xl text-center text-base sm:text-lg overflow-hidden px-2"
                >
                  WorkPilot brings attendance, task allocation, and performance
                  tracking into one centralized platform — so you spend less time
                  chasing updates and more time building your business.
                </p>
              </div>

              {/* Book Demo button — same style as LekhaSetu */}
              <MagneticButton strength={0.3} radius={80} className="mt-8 sm:mt-12 inline-block">
                <ContactFormModal
                  buttonText="Book Demo"
                  showArrow
                  className="group inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full bg-primary text-primary-foreground text-base font-semibold transition-all duration-300 hover:bg-primary/90"
                />
              </MagneticButton>
            </div>
          </div>

          {/* BOTTOM SECTION — two-column: features left, live dashboard right */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-20 pb-16">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">

              {/* Feature pills */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">What WorkPilot does</p>
                <div className="grid grid-cols-2 gap-3">
                  {FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-3 text-sm shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                    <Link href="#features">See all features ↓</Link>
                  </Button>
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
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Search, Cpu, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Requirement & Budget Discovery",
    body: "We start on your floor, not in a boardroom. Our team studies your actual workflows, constraints, and growth goals, then scopes a system architecture calibrated to your budget — whether you're taking the first step toward digitization or modernizing at scale.",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    tag: "Weeks 1-2",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Custom Architecture & Build",
    body: "We design and build your system around your real operational process — not a pre-packaged module. Every workflow, dashboard, and approval chain is engineered to match how your business actually runs.",
    accent: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    tag: "Weeks 3-10",
  },
  {
    number: "03",
    icon: Rocket,
    title: "On-the-Ground Implementation & Autopilot Support",
    body: "Software fails when people don't adopt it. We deploy on-site, train your workforce hands-on, and stay engaged until the system runs on autopilot — fully embedded into daily operations, independent of any single person.",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    tag: "Ongoing",
  },
];

export default function EngagementProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heading = SplitText.create(headingRef.current, { type: "lines", mask: "lines" });
    const sub     = SplitText.create(subRef.current,     { type: "lines", mask: "lines" });

    const headTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    headTl
      .from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 })
      .from(sub.lines,     { yPercent: 100, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.3");

    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }

    const cards = gsap.utils.toArray<HTMLElement>(".ep-card");
    gsap.set(cards, { y: 80, opacity: 0, scale: 0.95 });

    ScrollTrigger.create({
      trigger: cardsRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.to(cards, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.18 });
      },
      onLeaveBack: () => {
        gsap.to(cards, { y: 80, opacity: 0, scale: 0.95, duration: 0.4, stagger: 0.1 });
      },
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Engagement Process</p>
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="text-4xl font-semibold tracking-tight lg:text-5xl xl:text-6xl"
            >
              How we build with you
            </h2>
          </div>
          <div className="overflow-hidden mt-5">
            <p
              ref={subRef}
              className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Three structured phases that take you from fragmented operations to a system-driven business — on your floor, at your pace.
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="relative">
          <div className="hidden lg:block absolute top-[3.75rem] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-border/60 z-0">
            <div ref={lineRef} className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 origin-left" />
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className={
                    "ep-card relative rounded-3xl border bg-gradient-to-br p-7 sm:p-8 " +
                    step.border + " " + step.accent
                  }
                >
                  <div className="flex items-center justify-between mb-7">
                    <span className="font-mono text-5xl font-bold text-foreground/10 select-none">
                      {step.number}
                    </span>
                    <div className={"flex h-12 w-12 items-center justify-center rounded-2xl " + step.iconBg + " " + step.iconColor}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="inline-block rounded-full border border-border bg-background/60 px-3 py-0.5 text-xs font-medium text-muted-foreground mb-4">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-semibold leading-snug mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{step.body}</p>

                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden mt-8 flex justify-center">
                      <div className="w-px h-10 bg-gradient-to-b from-border to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

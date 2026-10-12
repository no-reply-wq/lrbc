"use client";

import { useRef } from "react";
import { Et, Hide, Img } from "@/components/cms/editable";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { padMasks } from "@/lib/split-safe";
import { useGSAP } from "@gsap/react";
import { LrReveal } from "@/components/ui/lr-reveal";
import { Workflow, BarChart3, Building2, Check, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const SOLUTIONS = [
  {
    eyebrow: "Custom Flow Management Systems",
    title: "End-to-end operational digitization",
    body: "We map your actual physical process — order intake, production, dispatch, approvals — and turn it into a single digital flow. No more chasing paper, WhatsApp updates, or verbal handoffs. Every step is tracked, time-stamped, and visible, so work moves forward even when key people are unavailable.",
    highlights: [
      "Every step tracked and time-stamped",
      "Work moves forward without key individuals",
      "No paper, no WhatsApp, no verbal handoffs",
    ],
    icon: Workflow,
    image: "/analytics-dashboard-with-charts-graphs-and-data-vi.jpg",
    imageAlt: "Flow management dashboard",
    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    flip: false,
  },
  {
    eyebrow: "Internal SaaS & Accountability Engines",
    title: "Data-driven dashboards and performance tracking",
    body: "We build role-based internal platforms that turn raw operational activity into real-time accountability. Every team member sees exactly what's expected of them; every manager sees exactly what's happening, without asking. Performance becomes measurable, bottlenecks become visible, and decisions get made on data — not assumptions.",
    highlights: [
      "Role-based visibility for every level",
      "Real-time bottleneck detection",
      "Decisions on data, not assumptions",
    ],
    icon: BarChart3,
    image: "/data-visualization-dashboard-with-interactive-char.jpg",
    imageAlt: "Accountability dashboard",
    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    flip: true,
  },
  {
    eyebrow: "Enterprise ERP Architecture",
    title: "Scalable infrastructure built around your processes",
    body: "Rather than forcing your business into a generic template, we design ERP architecture that mirrors how you already operate — then scales with you as volume, teams, and complexity grow. The result is infrastructure that fits from day one and does not need to be replaced as you expand.",
    highlights: [
      "Mirrors your existing operations",
      "Scales with volume, teams, and complexity",
      "No rip-and-replace as you grow",
    ],
    icon: Building2,
    image: "/modern-dashboard-interface-for-schedule-planning-w.jpg",
    imageAlt: "ERP architecture",
    accent: "from-primary/10 via-transparent to-transparent",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    flip: false,
  },
];

function SolutionPanel({ s, index }: { s: typeof SOLUTIONS[0]; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const Icon = s.icon;

  useGSAP(() => {
    const fromLeft  = { x: -60, opacity: 0, filter: "blur(8px)" };
    const fromRight = { x:  60, opacity: 0, filter: "blur(8px)" };
    const toProps   = { x: 0,   opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(textRef.current, s.flip ? fromRight : fromLeft, toProps)
      .fromTo(imgRef.current,  s.flip ? fromLeft  : fromRight, toProps, "-=0.6");

  }, { scope: panelRef });

  return (
    <div ref={panelRef} className="relative">
      <div className={"absolute inset-0 rounded-[2rem] bg-gradient-to-br pointer-events-none " + s.accent} />

      <div className={"relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center px-5 py-10 sm:px-8 md:px-10 md:py-14 " + (s.flip ? "lg:[&>*:first-child]:order-2" : "")}>

        <div ref={textRef} className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + s.iconBg}>
              <Icon className={"h-5 w-5 " + s.iconColor} />
            </div>
            <Et id={`why.core.item.${index}.eyebrow`} def={s.eyebrow} className="lrbc-eyebrow max-w-full whitespace-normal! text-left" />
          </div>

          <Et as="h3" id={`why.core.item.${index}.title`} def={s.title} className="text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl" />
          <Et as="p" id={`why.core.item.${index}.body`} def={s.body} className="text-muted-foreground leading-6 text-sm" />

          <LrReveal><ul className="flex flex-col gap-2.5 mt-2">
            {s.highlights.map((h, j) => (
              <Hide key={j} id={`why.core.item.${index}.hl.${j}`}>
              <li
                style={{ ["--i" as string]: j, animationDelay: "calc(var(--i) * .12s)" }}
                className="lr-gain flex items-center gap-2.5 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-fuchsia-500/10 px-3 py-2.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                <Et id={`why.core.item.${index}.hl.${j}.text`} def={h} className="text-sm font-medium text-foreground" />
              </li>
              </Hide>
            ))}
          </ul></LrReveal>
        </div>

        <div ref={imgRef} className="relative max-w-md mx-auto lg:max-w-full">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-black/10">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            <Img
              id={`why.core.item.${index}.img`}
              def={s.image}
              alt={s.imageAlt}
              className="w-full h-44 sm:h-56 lg:h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-4 py-2.5 backdrop-blur-md shadow-sm">
              <TrendingUp className={"h-4 w-4 " + s.iconColor} />
              <Et id={`why.core.item.${index}.chip`} def="Live operational data" className="text-xs font-medium text-foreground" />
            </div>
          </div>
          <div className={"absolute -top-3 -right-3 h-6 w-6 rounded-full border-2 border-background " + s.iconBg} />
        </div>
      </div>

      {index < SOLUTIONS.length - 1 && (
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
      )}
    </div>
  );
}

export default function CoreSolutions() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const heading = SplitText.create(headingRef.current, { type: "lines", mask: "lines", onSplit: padMasks });
    const sub     = SplitText.create(subRef.current,     { type: "lines", mask: "lines", onSplit: padMasks });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(heading.lines, { yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.1 })
      .from(sub.lines,     { yPercent: 100, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.3");

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-8 md:py-12 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">

        <div className="text-center mb-10 md:mb-20">
          <div className="lrbc-eyebrow-row mb-5"><Et as="div" id="why.core.eyebrow" def="Core Solutions" className="lrbc-eyebrow" /></div>
          <div className="overflow-hidden">
            <Et as="h2" ref={headingRef} id="why.core.title" reload def="Three systems. Every business need." className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl" />
          </div>
          <div className="overflow-hidden lrbc-clip-safe mt-5">
            <Et as="p" ref={subRef} id="why.core.subtitle" reload def="Mutually exclusive by function, collectively exhaustive of what a business needs to become fully system-driven." className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" />
          </div>
        </div>

        <div className="flex flex-col">
          {SOLUTIONS.map((s, i) => (
            <Hide key={i} id={`why.core.item.${i}`}><SolutionPanel s={s} index={i} /></Hide>
          ))}
        </div>
      </div>
    </section>
  );
}

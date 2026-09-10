// =============================================================================
// LRBC — Add 3 new home page sections + update metadata
// Run: node add-home-sections.js
//
// Creates:
//   components/engagement-process.tsx   — "The Engagement Process" (3 steps)
//   components/core-solutions.tsx        — "Core Solutions" (3 solution cards)
//   components/why-lrbc.tsx             — "Why LRBC" narrative section
//   Patches app/page.tsx                — injects 3 new sections
//   Patches app/layout.tsx              — updates meta title + description
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from repo root'); process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'lrbc') { console.error('❌  Wrong folder'); process.exit(1); }

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  ' + rel);
}

// =============================================================================
// COMPONENT 1 — The Engagement Process
// Design: vertical timeline on mobile, horizontal pinned scroll on desktop
// GSAP: each step card flies in from below with stagger on ScrollTrigger
// =============================================================================
write('components/engagement-process.tsx', `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Search, Cpu, Rocket } from "lucide-react";
import SectionBadge from "./section-badge";
import { Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Requirement & Budget Discovery",
    body: "We start on your floor, not in a boardroom. Our team studies your actual workflows, constraints, and growth goals, then scopes a system architecture calibrated to your budget — whether you're taking the first step toward digitization or modernizing at scale.",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 text-violet-500",
    tag: "Weeks 1–2",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Custom Architecture & Build",
    body: "We design and build your system around your real operational process — not a pre-packaged module. Every workflow, dashboard, and approval chain is engineered to match how your business actually runs.",
    accent: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-500",
    tag: "Weeks 3–10",
  },
  {
    number: "03",
    icon: Rocket,
    title: "On-the-Ground Implementation & Autopilot Support",
    body: "Software fails when people don't adopt it. We deploy on-site, train your workforce hands-on, and stay engaged until the system runs on autopilot — fully embedded into daily operations, independent of any single person.",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-500",
    tag: "Ongoing",
  },
];

export default function EngagementProcess() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Heading split ──────────────────────────────────────────────────────
    const heading = SplitText.create(headingRef.current, { type: "chars", charsClass: "char" });
    const sub     = SplitText.create(subRef.current,     { type: "lines", mask: "lines" });

    const headTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    headTl
      .from(heading.chars, { yPercent: 110, opacity: 0, duration: 0.7, ease: "power4.out", stagger: 0.025 })
      .from(sub.lines,     { yPercent: 100, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.3");

    // ── Connecting line grows on scroll ────────────────────────────────────
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

    // ── Cards cascade in ───────────────────────────────────────────────────
    const cards = gsap.utils.toArray<HTMLElement>(".ep-card");
    gsap.set(cards, { y: 80, opacity: 0, scale: 0.95 });

    ScrollTrigger.create({
      trigger: cardsRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.to(cards, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, ease: "power3.out",
          stagger: 0.18,
        });
      },
      onLeaveBack: () => {
        gsap.to(cards, { y: 80, opacity: 0, scale: 0.95, duration: 0.4, stagger: 0.1 });
      },
    });

    // ── Step numbers count up ──────────────────────────────────────────────
    const numbers = gsap.utils.toArray<HTMLElement>(".ep-number");
    numbers.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { textContent: "00", opacity: 0.3 },
            {
              textContent: String(i + 1).padStart(2, "0"),
              duration: 0.8,
              ease: "power2.out",
              opacity: 1,
              snap: { textContent: 1 },
            }
          );
        },
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center mb-16 md:mb-20">
          <SectionBadge text="The Engagement Process" icon={Layers} className="mb-6" />
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

        {/* ── Cards + connecting line ───────────────────────────────────── */}
        <div ref={cardsRef} className="relative">

          {/* Horizontal line — desktop only */}
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
                  {/* Step number + icon row */}
                  <div className="flex items-center justify-between mb-7">
                    <span className="ep-number font-mono text-5xl font-bold text-foreground/10 select-none">
                      {step.number}
                    </span>
                    <div className={
                      "flex h-12 w-12 items-center justify-center rounded-2xl " + step.iconBg
                    }>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Tag */}
                  <span className="inline-block rounded-full border border-border bg-background/60 px-3 py-0.5 text-xs font-medium text-muted-foreground mb-4">
                    {step.tag}
                  </span>

                  {/* Content */}
                  <h3 className="text-lg font-semibold leading-snug mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{step.body}</p>

                  {/* Connector dot — mobile vertical timeline */}
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
`);

// =============================================================================
// COMPONENT 2 — Core Solutions
// Design: large 3-panel alternating layout with icon constellation bg
// GSAP: each panel slides in from left/right on ScrollTrigger, content fades
// =============================================================================
write('components/core-solutions.tsx', `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import {
  Workflow, BarChart3, Building2, CheckCircle2,
  GitBranch, TrendingUp, ShieldCheck,
} from "lucide-react";
import SectionBadge from "./section-badge";
import { Layers } from "lucide-react";
import Image from "next/image";

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
    accent: "from-violet-500/10 via-transparent to-transparent",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
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
    accent: "from-blue-500/10 via-transparent to-transparent",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    flip: true,
  },
  {
    eyebrow: "Enterprise ERP Architecture",
    title: "Scalable infrastructure built around your processes",
    body: "Rather than forcing your business into a generic template, we design ERP architecture that mirrors how you already operate — then scales with you as volume, teams, and complexity grow. The result is infrastructure that fits from day one and doesn't need to be replaced as you expand.",
    highlights: [
      "Mirrors your existing operations",
      "Scales with volume, teams, and complexity",
      "No rip-and-replace as you grow",
    ],
    icon: Building2,
    image: "/modern-dashboard-interface-for-schedule-planning-w.jpg",
    imageAlt: "ERP architecture",
    accent: "from-emerald-500/10 via-transparent to-transparent",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    flip: false,
  },
];

function SolutionPanel({ s, i }: { s: typeof SOLUTIONS[0]; i: number }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);

  const Icon = s.icon;

  useGSAP(() => {
    const fromLeft  = { x: -60, opacity: 0, filter: "blur(8px)" };
    const fromRight = { x:  60, opacity: 0, filter: "blur(8px)" };
    const to        = { x: 0,   opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(textRef.current, s.flip ? fromRight : fromLeft, { ...to })
      .fromTo(imgRef.current,  s.flip ? fromLeft  : fromRight, { ...to, delay: 0 }, "-=0.6");

    // Highlights stagger
    const items = panelRef.current?.querySelectorAll(".cs-highlight");
    if (items?.length) {
      tl.from(items, { x: -20, opacity: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.4");
    }
  }, { scope: panelRef });

  return (
    <div ref={panelRef} className="relative">
      {/* Background accent */}
      <div className={\`absolute inset-0 rounded-[2rem] bg-gradient-to-br \${s.accent} pointer-events-none\`} />

      <div className={\`relative grid gap-10 lg:grid-cols-2 lg:gap-16 items-center py-16 md:py-20 \${s.flip ? "lg:[&>*:first-child]:order-2" : ""}\`}>

        {/* ── Text side ─────────────────────────────────────────────── */}
        <div ref={textRef} className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className={\`flex h-10 w-10 items-center justify-center rounded-xl \${s.iconBg}\`}>
              <Icon className={\`h-5 w-5 \${s.iconColor}\`} />
            </div>
            <span className={\`text-xs font-semibold uppercase tracking-widest \${s.iconColor}\`}>
              {s.eyebrow}
            </span>
          </div>

          <h3 className="text-3xl font-semibold leading-tight lg:text-4xl">{s.title}</h3>
          <p className="text-muted-foreground leading-7 text-base">{s.body}</p>

          <ul className="flex flex-col gap-3 mt-2">
            {s.highlights.map((h, j) => (
              <li key={j} className="cs-highlight flex items-start gap-3">
                <CheckCircle2 className={\`h-5 w-5 shrink-0 mt-0.5 \${s.iconColor}\`} />
                <span className="text-sm text-foreground/80">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Image side ────────────────────────────────────────────── */}
        <div ref={imgRef} className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-black/10">
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            <img
              src={s.image}
              alt={s.imageAlt}
              className="w-full h-64 sm:h-80 object-cover"
            />
            {/* Floating stat badge */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-4 py-2.5 backdrop-blur-md shadow-sm">
              <TrendingUp className={\`h-4 w-4 \${s.iconColor}\`} />
              <span className="text-xs font-medium text-foreground">Live operational data</span>
            </div>
          </div>

          {/* Corner accent dot */}
          <div className={\`absolute -top-3 -right-3 h-6 w-6 rounded-full \${s.iconBg} border-2 border-background\`} />
        </div>
      </div>

      {/* Divider between panels */}
      {i < SOLUTIONS.length - 1 && (
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
    const heading = SplitText.create(headingRef.current, { type: "chars", charsClass: "char" });
    const sub     = SplitText.create(subRef.current,     { type: "lines", mask: "lines" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(heading.chars, { yPercent: 110, opacity: 0, duration: 0.7, ease: "power4.out", stagger: 0.025 })
      .from(sub.lines,     { yPercent: 100, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.3");

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <SectionBadge text="Core Solutions" icon={Layers} className="mb-6" />
          <div className="overflow-hidden">
            <h2 ref={headingRef} className="text-4xl font-semibold tracking-tight lg:text-5xl xl:text-6xl">
              Three systems. Every business need.
            </h2>
          </div>
          <div className="overflow-hidden mt-5">
            <p ref={subRef} className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Mutually exclusive by function, collectively exhaustive of what a business needs to become fully system-driven.
            </p>
          </div>
        </div>

        {/* Solution panels */}
        <div className="flex flex-col">
          {SOLUTIONS.map((s, i) => (
            <SolutionPanel key={i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
`);

// =============================================================================
// COMPONENT 3 — Why LRBC (SCR Narrative)
// Design: large-text editorial layout with scrolling text opacity reveal
// GSAP: word-by-word scrubbed opacity on scroll (like the content-section)
// =============================================================================
write('components/why-lrbc.tsx', `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionBadge from "./section-badge";
import { Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const NARRATIVE = [
  {
    label: "Situation",
    labelColor: "text-amber-500",
    dotColor: "bg-amber-500",
    text: "Every growing business eventually runs on the same fuel: a handful of key people who hold the process in their heads. Founders, floor managers, and senior staff become the system — tracking orders on WhatsApp, chasing approvals over phone calls, and reconciling numbers in scattered spreadsheets. It works, until it doesn't.",
  },
  {
    label: "Complication",
    labelColor: "text-red-500",
    dotColor: "bg-red-500",
    text: "As the business scales, this person-dependency becomes the ceiling on growth. One employee leaves, and a process disappears with them. Off-the-shelf software promises a fix — but it forces your business to bend around its workflow, not the other way around. Expensive licenses sit half-used because they were never built for how your floor, your vendors, or your teams actually operate.",
  },
  {
    label: "Resolution",
    labelColor: "text-emerald-500",
    dotColor: "bg-emerald-500",
    text: "LRBC doesn't sell software. We architect systems around your existing physical and operational reality — then get on the ground to make sure your workforce actually adopts them. Every dashboard, workflow, and accountability engine we build is designed to convert institutional knowledge into institutional infrastructure — so the business runs on process, not on any one person.",
  },
];

const TAGLINE = "Systems Create Organizations.";

export default function WhyLRBC() {
  const sectionRef  = useRef<HTMLElement>(null);
  const taglineRef  = useRef<HTMLHeadingElement>(null);
  const blocksRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Tagline: split + scrubbed opacity reveal ───────────────────────────
    const tagline = SplitText.create(taglineRef.current, { type: "words" });

    gsap.set(tagline.words, { opacity: 0.15 });
    gsap.to(tagline.words, {
      opacity: 1,
      ease: "none",
      stagger: 0.2,
      scrollTrigger: {
        trigger: taglineRef.current,
        start: "top 70%",
        end: "+=500",
        scrub: 1.5,
      },
    });

    // ── Narrative blocks: slide up on scroll ──────────────────────────────
    const blocks = gsap.utils.toArray<HTMLElement>(".why-block");
    blocks.forEach((block, i) => {
      gsap.fromTo(block,
        { y: 60, opacity: 0, filter: "blur(6px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 0.8, ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Word-by-word opacity scrub on each paragraph
      const para = block.querySelector(".why-para");
      if (para) {
        const words = SplitText.create(para, { type: "words" });
        gsap.set(words.words, { opacity: 0.3 });
        gsap.to(words.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: para,
            start: "top 80%",
            end: "+=400",
            scrub: 1,
          },
        });
      }
    });

    // ── Quote mark entrance ────────────────────────────────────────────────
    gsap.fromTo(".why-quote-mark",
      { scale: 0.3, opacity: 0, rotate: -20 },
      {
        scale: 1, opacity: 1, rotate: 0,
        duration: 1, ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 md:py-36 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Badge */}
        <div className="text-center mb-12">
          <SectionBadge text="Why LRBC" icon={Layers} className="mb-6" />
        </div>

        {/* ── Giant tagline ─────────────────────────────────────────────── */}
        <div className="text-center mb-20 md:mb-28">
          <h2
            ref={taglineRef}
            className="text-4xl font-bold tracking-tight text-foreground leading-tight md:text-6xl lg:text-7xl xl:text-8xl"
          >
            {TAGLINE}
          </h2>
        </div>

        {/* ── SCR Narrative ─────────────────────────────────────────────── */}
        <div ref={blocksRef} className="grid gap-0 lg:grid-cols-3 lg:gap-px lg:divide-x divide-border">
          {NARRATIVE.map((n, i) => (
            <div key={i} className={
              "why-block flex flex-col gap-5 px-0 py-10 lg:px-10 " +
              (i > 0 ? "border-t border-border lg:border-t-0" : "")
            }>
              {/* Label row */}
              <div className="flex items-center gap-3">
                <div className={\`h-2 w-2 rounded-full \${n.dotColor}\`} />
                <span className={\`text-xs font-semibold uppercase tracking-widest \${n.labelColor}\`}>
                  {n.label}
                </span>
              </div>

              {/* Paragraph */}
              <p className="why-para text-base text-foreground/80 leading-7">{n.text}</p>
            </div>
          ))}
        </div>

        {/* ── Pull quote ────────────────────────────────────────────────── */}
        <div className="mt-20 md:mt-28 relative">
          <Quote className="why-quote-mark absolute -top-4 -left-2 h-12 w-12 text-primary/20" />
          <blockquote className="pl-8 border-l-2 border-primary/30">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed max-w-3xl">
              A company that scales predictably, protects its margins, and doesn't depend on any single individual to function.
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              — That's what "Systems Create Organizations" means in practice.
            </footer>
          </blockquote>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact?openForm=true">
              Start with a discovery call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
            <Link href="/testimonials-case-studies">
              See real results
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
`);

// =============================================================================
// Patch app/page.tsx — inject 3 new sections in correct order
// Order: Hero → Content → Features → [EngagementProcess] → [CoreSolutions]
//        → Testimonials → [WhyLRBC] → Products → FAQs → Contact → Footer
// =============================================================================
const pagePath = path.join(root, 'app', 'page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');
fs.copyFileSync(pagePath, pagePath + '.bak');

// Add imports after existing imports
const IMPORT_MARKER = 'import NewHeroSection from "@/components/new-components/new-hero";';
const NEW_IMPORTS = `import NewHeroSection from "@/components/new-components/new-hero";
import EngagementProcess from "@/components/engagement-process";
import CoreSolutions from "@/components/core-solutions";
import WhyLRBC from "@/components/why-lrbc";`;

page = page.replace(IMPORT_MARKER, NEW_IMPORTS);

// Inject sections at correct positions
page = page.replace(
  '<TestimonialsSection />',
  `<EngagementProcess />

      <CoreSolutions />

      <TestimonialsSection />`
);

page = page.replace(
  '<ProductSection />',
  `<WhyLRBC />

      <ProductSection />`
);

fs.writeFileSync(pagePath, page, 'utf8');
console.log('  ✅  app/page.tsx (3 sections injected)');

// =============================================================================
// Patch app/layout.tsx — update meta title + description
// =============================================================================
const layoutPath = path.join(root, 'app', 'layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');
fs.copyFileSync(layoutPath, layoutPath + '.bak');

layout = layout.replace(
  /title:\s*["'].*?["']/,
  'title: "Custom ERP & Business Automation Consulting | LRBC"'
);
layout = layout.replace(
  /description:\s*["'].*?["']/,
  'description: "LRBC builds custom ERP & automation systems that turn chaotic, person-dependent businesses into scalable profit centers — with hands-on implementation support."'
);

// Remove the generator field (it's a v0 leftover)
layout = layout.replace(/\s*generator:\s*["']v0\.app["'],?/, '');

fs.writeFileSync(layoutPath, layout, 'utf8');
console.log('  ✅  app/layout.tsx (meta updated)');

// =============================================================================
// Verify
// =============================================================================
console.log('\n── Verification ──');
const checks = [
  ['components/engagement-process.tsx',  'STEPS'],
  ['components/engagement-process.tsx',  'ep-card'],
  ['components/engagement-process.tsx',  'ScrollTrigger'],
  ['components/core-solutions.tsx',      'SOLUTIONS'],
  ['components/core-solutions.tsx',      'SolutionPanel'],
  ['components/core-solutions.tsx',      'cs-highlight'],
  ['components/why-lrbc.tsx',            'NARRATIVE'],
  ['components/why-lrbc.tsx',            'why-block'],
  ['components/why-lrbc.tsx',            'TAGLINE'],
  ['app/page.tsx',                       'EngagementProcess'],
  ['app/page.tsx',                       'CoreSolutions'],
  ['app/page.tsx',                       'WhyLRBC'],
  ['app/layout.tsx',                     'Custom ERP'],
  ['app/layout.tsx',                     'scalable profit centers'],
];

let allOk = true;
checks.forEach(([file, needle]) => {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) { console.error('  ✗  MISSING: ' + file); allOk = false; return; }
  if (fs.readFileSync(abs, 'utf8').includes(needle)) {
    console.log('  ✓  ' + path.basename(file) + ' → ' + needle);
  } else {
    console.error('  ✗  NOT FOUND: ' + needle + ' in ' + file);
    allOk = false;
  }
});

if (!allOk) { console.error('\n❌  Checks failed'); process.exit(1); }

console.log(`
══════════════════════════════════════════════════════════════════
  All done. Run:  pnpm dev

  ── New sections added to home page ─────────────────────────────
  Page order is now:
    Hero
    About ERP (existing)
    Why Businesses Choose Us (existing)
    ► THE ENGAGEMENT PROCESS  ← NEW
    ► CORE SOLUTIONS           ← NEW
    Testimonials (existing)
    ► WHY LRBC — SCR Narrative ← NEW
    Products (existing)
    FAQs (existing)
    Contact (existing)
    Footer

  ── Animations ──────────────────────────────────────────────────
  Engagement Process:
    • Step number count-up on scroll enter
    • Cards cascade in with stagger
    • Gradient line grows across desktop layout

  Core Solutions:
    • Each panel text slides in from left/right alternating
    • Highlight bullets stagger in
    • Image counterpart slides from opposite side

  Why LRBC:
    • Giant tagline: word-by-word opacity scrub on scroll
    • SCR blocks: slide up + paragraph word-opacity scrub
    • Pull quote: elastic scale-in entrance

  ── Meta ────────────────────────────────────────────────────────
  Title:       Custom ERP & Business Automation Consulting | LRBC
  Description: LRBC builds custom ERP & automation systems that
               turn chaotic, person-dependent businesses into
               scalable profit centers — with hands-on support.
══════════════════════════════════════════════════════════════════
`);

"use client";

import { useEffect, useRef, useState } from "react";
import { Et, Hide } from "@/components/cms/editable";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { padMasks } from "@/lib/split-safe";
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
    accent: "from-primary/15 to-fuchsia-500/10",
    border: "border-primary/25",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    tag: "Weeks 3-10",
  },
  {
    number: "03",
    icon: Rocket,
    title: "On-the-Ground Implementation & Autopilot Support",
    body: "Software fails when people don't adopt it. We deploy on-site, train your workforce hands-on, and stay engaged until the system runs on autopilot — fully embedded into daily operations, independent of any single person.",
    accent: "from-fuchsia-500/20 to-purple-500/10",
    border: "border-fuchsia-500/20",
    iconBg: "bg-fuchsia-500/10",
    iconColor: "text-fuchsia-500",
    tag: "Ongoing",
  },
];

export default function EngagementProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(() => {
    const heading = SplitText.create(headingRef.current, { type: "lines", mask: "lines", onSplit: padMasks });
    const sub     = SplitText.create(subRef.current,     { type: "lines", mask: "lines", onSplit: padMasks });

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


  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-8 md:py-12 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="text-center mb-8 md:mb-16">
          <div className="lrbc-eyebrow-row mb-5"><Et as="div" id="why.process.eyebrow" def="The Engagement Process" className="lrbc-eyebrow" /></div>
          <div className="overflow-hidden">
            <Et
              as="h2"
              ref={headingRef}
              id="why.process.title"
              reload
              def="How we build with you"
              className="text-2xl sm:text-3xl font-semibold tracking-tight lg:text-5xl xl:text-6xl"
            />
          </div>
          <div className="overflow-hidden mt-5">
            <Et
              as="p"
              ref={subRef}
              id="why.process.subtitle"
              reload
              def="Three structured phases that take you from fragmented operations to a system-driven business — on your floor, at your pace."
              className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            />
          </div>
        </div>

        {/* Same connected-steps design as the Mini / Custom ERP "How it works" */}
        <div ref={cardsRef}>
          <ol className={`sf relative grid gap-4 pt-7 md:grid-cols-3 ${on ? "sf-on" : ""}`}>
            <span aria-hidden className="sf-line pointer-events-none absolute z-0 hidden h-0.5 rounded-full bg-gradient-to-r from-[#5227FF] via-[#a855f7] to-[#d946ef] md:block md:left-[calc((100%-2rem)/6)] md:right-[calc((100%-2rem)/6)] md:top-7 md:-translate-y-1/2">
              <i className="sf-dot" />
            </span>
            <span aria-hidden className="sf-line-v pointer-events-none absolute bottom-8 left-7 top-14 z-0 w-0.5 rounded-full bg-gradient-to-b from-[#5227FF] via-[#a855f7] to-[#d946ef] md:hidden" />
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Hide key={i} id={`why.process.step.${i}`}>
                <li
                  style={{ ["--i" as string]: i }}
                  className="sf-card relative z-10 rounded-2xl border border-border/70 bg-card p-6 pt-10 transition-colors hover:border-primary/40 max-md:pl-20 max-md:pt-6 md:text-center"
                >
                  <span className="sf-badge absolute grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30 ring-4 ring-background max-md:left-0 max-md:top-3 md:-top-7 md:left-1/2 md:-translate-x-1/2">
                    <Icon className="h-6 w-6" />
                    <span aria-hidden className="sf-ring absolute inset-0 rounded-2xl" />
                  </span>
                  <Et id={`why.process.step.${i}.number`} def={step.number} className="block text-xs font-semibold uppercase tracking-widest text-primary/70" />
                  <Et id={`why.process.step.${i}.tag`} def={step.tag} className="mt-2 inline-block rounded-full border border-border bg-background/60 px-3 py-0.5 text-xs font-medium text-muted-foreground" />
                  <Et as="h3" id={`why.process.step.${i}.title`} def={step.title} className="mt-2 block text-lg font-semibold leading-snug" />
                  <Et as="p" id={`why.process.step.${i}.body`} def={step.body} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
                </li>
                </Hide>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

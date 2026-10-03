"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";

const AVOID = [
  "Delay in decision making",
  "Bottlenecks",
  "Scattered data",
  "Dependency on key employee",
  "Increased cost",
  "Paperwork",
];

const ACHIEVE = [
  "Smoother processes",
  "Maximum efficiency",
  "Cost reduction (affordability)",
  "Customization",
  "Changeover management",
  "AI integration",
];

export default function HeroChecklist() {
  const [run, setRun] = useState(0);
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // start the animation when the panel is actually on screen (phones see it below the fold)
  useEffect(() => {
    setPlay(false);
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setPlay(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  return (
    <div ref={ref} className={`lr-check mx-auto w-full max-w-xl lg:max-w-none ${play ? "lr-play" : ""}`}>
      <div className="lr-check-card relative overflow-hidden rounded-3xl border border-white/30 bg-background/55 p-4 shadow-2xl shadow-primary/20 backdrop-blur-xl sm:p-7">
        {/* animated border glow */}
        <span aria-hidden className="lr-check-sheen" />

        {/* AVOID */}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Through LRBC you avoid</p>
        <ul className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:grid sm:grid-cols-2">
          {AVOID.map((t, i) => (
            <li
              key={t}
              style={{ ["--i" as string]: i }}
              className="lr-pain flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/[0.10] px-2.5 py-1.5 text-[13px] font-medium sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm text-foreground"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
                <X className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="lr-pain-text relative">{t}</span>
            </li>
          ))}
        </ul>

        {/* Transition beam */}
        <div className="relative my-4 flex sm:my-5 items-center gap-3" aria-hidden>
          <span className="lr-beam h-px flex-1 bg-gradient-to-r from-transparent via-primary to-primary/0" />
          <span className="lr-core relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#d946ef] text-[10px] font-bold tracking-wider text-white shadow-lg shadow-primary/40">
            LRBC
          </span>
          <span className="lr-beam h-px flex-1 bg-gradient-to-l from-transparent via-primary to-primary/0" />
        </div>

        {/* ACHIEVE */}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Instead achieve</p>
        <ul className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:grid sm:grid-cols-2">
          {ACHIEVE.map((t, i) => (
            <li
              key={t}
              style={{ ["--i" as string]: i }}
              className="lr-gain flex items-center gap-2.5 rounded-full border border-primary/25 bg-gradient-to-br from-primary/10 to-fuchsia-500/10 px-2.5 py-1.5 text-[13px] font-semibold sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm text-foreground"
            >
              <span className="lr-gain-tick flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white">
                <Check className="h-3 w-3" strokeWidth={3.5} />
              </span>
              {t}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Replay
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Hourglass, TrendingDown } from "lucide-react";

/** LekhaSetu page — what disconnected Tally data quietly costs a business. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function CountUp({ to, run, suffix = "" }: { to: number; run: boolean; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const t0 = performance.now(); const D = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / D);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v.toLocaleString("en-IN")}{suffix}</>;
}

export default function LekhaSetuLoss() {
  const [ref, seen] = useInView<HTMLElement>();
  const weeks = Array.from({ length: 52 }, (_, i) => i);

  return (
    <section ref={ref} className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="loss-h">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/10 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600">
            <TrendingDown className="h-3.5 w-3.5" /> The hidden cost
          </span>
          <h2 id="loss-h" className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Time that quietly <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">disappears</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A mid-sized business with multiple branches, warehouses, or disjointed systems (like CRM/E-commerce operating separately from accounting) loses between 1.5 to 3 hours per day due to a lack of automated Tally data synchronization.
          </p>
        </div>

        {/* big numbers */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-rose-500/20 bg-card/70 p-6 text-center backdrop-blur">
            <p className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">1.5<span className="text-rose-500">–</span>3</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-rose-600">hours lost per day</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312e81] via-[#5227FF] to-[#a855f7] p-6 text-center text-white shadow-2xl shadow-primary/30 md:-translate-y-3">
            <p className="font-heading text-5xl font-extrabold tracking-tight sm:text-6xl"><CountUp to={1000} run={seen} suffix="+" /></p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/80">hours lost every year</p>
          </div>
          <div className="rounded-3xl border border-rose-500/20 bg-card/70 p-6 text-center backdrop-blur">
            <p className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">3<span className="text-rose-500">–</span>4</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-rose-600">weeks lost per employee</p>
          </div>
        </div>

        {/* a year in weeks */}
        <div className="mt-10 rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur sm:p-7">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Hourglass className="h-4 w-4 text-rose-500" /> One year, week by week — the red ones are gone
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(26,minmax(0,1fr))] sm:gap-1.5" aria-hidden>
            {weeks.map((w) => {
              const lost = w >= 52 - 4;
              return (
                <span
                  key={w}
                  className={`aspect-square rounded-md sm:rounded-lg ${lost ? "bg-gradient-to-br from-rose-500 to-orange-500 shadow-md shadow-rose-500/40" : "bg-primary/15"} ${seen ? "lk-week" : "opacity-0"}`}
                  style={{ animationDelay: `${w * 18}ms` }}
                />
              );
            })}
          </div>
          <p className="mt-6 text-center text-base leading-relaxed text-foreground sm:text-lg">
            Annually, this translates to <strong>1,000+ hours</strong> of wasted productivity — amounting to roughly <strong>3 to 4 weeks</strong> of completely lost time per employee involved in the process.
          </p>
        </div>
      </div>
    </section>
  );
}

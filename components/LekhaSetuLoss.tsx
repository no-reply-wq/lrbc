"use client";

import { Et, Hide } from "@/components/cms/editable";
import { useEffect, useRef, useState } from "react";
import { useScrollFadeWords } from "@/components/ui/use-scroll-fade";
import { Hourglass, TrendingDown } from "lucide-react";

/** LekhaSetu page — what disconnected account data quietly costs a business. */
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
  const fade = useScrollFadeWords<HTMLParagraphElement>();
  const fade2 = useScrollFadeWords<HTMLParagraphElement>();
  const weeks = Array.from({ length: 52 }, (_, i) => i);

  return (
    <Hide id="lekha.loss.sec">
    <section ref={ref} className="relative isolate overflow-hidden px-4 py-8 sm:px-6 md:py-12" aria-labelledby="loss-h">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/10 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="lrbc-eyebrow-row">
            <span className="lrbc-eyebrow">
              <TrendingDown className="h-3.5 w-3.5" /> <Et id="lekha.loss.badge" def="The hidden cost" />
            </span>
          </div>
          <h2 id="loss-h" className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            <Et id="lekha.loss.title1" def="Time that quietly " /><Et id="lekha.loss.title2" def="disappears" className="bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent" />
          </h2>
          <Et as="p" ref={fade} reload id="lekha.loss.text" def="A mid-sized business with multiple branches, warehouses, or disjointed systems (like CRM/E-commerce operating separately from accounting) loses between 1.5 to 3 hours per day due to a lack of automated data synchronization." className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg" />
        </div>

        {/* big numbers */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-rose-500/20 bg-card/70 p-6 text-center backdrop-blur">
            <p className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-[clamp(2.25rem,5vw,3.75rem)]"><Et id="lekha.loss.stat.0.a" def="1.5" /><span className="text-rose-500">–</span><Et id="lekha.loss.stat.0.b" def="3" /></p>
            <Et as="p" id="lekha.loss.stat.0.label" def="hours lost per day" className="mt-2 text-sm font-semibold uppercase tracking-widest text-rose-600" />
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312e81] via-[#5227FF] to-[#a855f7] p-6 text-center text-white shadow-2xl shadow-primary/30 md:-translate-y-3">
            <p className="font-heading text-5xl font-extrabold tracking-tight sm:text-6xl md:text-[clamp(2.25rem,5vw,3.75rem)]"><CountUp to={1000} run={seen} suffix="+" /></p>
            <Et as="p" id="lekha.loss.stat.1.label" def="hours lost every year" className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/80" />
          </div>
          <div className="rounded-3xl border border-rose-500/20 bg-card/70 p-6 text-center backdrop-blur">
            <p className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-[clamp(2.25rem,5vw,3.75rem)]"><Et id="lekha.loss.stat.2.a" def="3" /><span className="text-rose-500">–</span><Et id="lekha.loss.stat.2.b" def="4" /></p>
            <Et as="p" id="lekha.loss.stat.2.label" def="weeks lost per employee" className="mt-2 text-sm font-semibold uppercase tracking-widest text-rose-600" />
          </div>
        </div>

        {/* a year in weeks */}
        <div className="mt-10 rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur sm:p-7">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Hourglass className="h-4 w-4 text-rose-500" /> <Et id="lekha.loss.caption" def="One year, week by week — the red ones are gone" />
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(26,minmax(0,1fr))] sm:gap-1.5" aria-hidden>
            {weeks.map((w) => {
              const lost = w >= 52 - 4;
              return (
                <span
                  key={w}
                  className={`aspect-square rounded-md sm:rounded-lg ${lost ? "bg-gradient-to-br from-rose-500 to-fuchsia-500 shadow-md shadow-rose-500/40" : "bg-primary/15"} ${seen ? "lk-week" : "opacity-0"}`}
                  style={{ animationDelay: `${w * 18}ms` }}
                />
              );
            })}
          </div>
          <p ref={fade2} className="mt-6 text-center text-base leading-relaxed text-foreground sm:text-lg">
            <Et id="lekha.loss.summary.1" def="Annually, this translates to " /><strong><Et id="lekha.loss.summary.2" def="1,000+ hours" /></strong><Et id="lekha.loss.summary.3" def=" of wasted productivity — amounting to roughly " /><strong><Et id="lekha.loss.summary.4" def="3 to 4 weeks" /></strong><Et id="lekha.loss.summary.5" def=" of completely lost time per employee involved in the process." />
          </p>
        </div>
      </div>
    </section>
    </Hide>
  );
}

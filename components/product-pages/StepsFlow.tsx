"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Settings2, Rocket, Hammer, Users, ClipboardCheck, TrendingUp, Cpu, type LucideIcon } from "lucide-react";
import { Et, Hide } from "@/components/cms/editable";

const ICONS: Record<string, LucideIcon> = { search: Search, configure: Settings2, build: Hammer, rocket: Rocket, users: Users, track: ClipboardCheck, improve: TrendingUp, cpu: Cpu };

export type Step = { title: string; text: string; icon: keyof typeof ICONS | string; tag?: string };

/** "How it works" — three steps joined by an animated line that draws itself when scrolled into view. */
export default function StepsFlow({ steps, idPrefix, labels }: { steps: Step[]; idPrefix?: string; labels?: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className={`sf relative grid gap-4 pt-7 md:grid-cols-3 ${on ? "sf-on" : ""}`}>
      {/* connecting line — horizontal on desktop, vertical on phones */}
      <span aria-hidden className="sf-line pointer-events-none absolute z-0 hidden h-0.5 rounded-full bg-gradient-to-r from-[#5227FF] via-[#a855f7] to-[#d946ef] md:block md:left-[calc((100%-2rem)/6)] md:right-[calc((100%-2rem)/6)] md:top-7 md:-translate-y-1/2">
        <i className="sf-dot" />
      </span>
      <span aria-hidden className="sf-line-v pointer-events-none absolute bottom-8 left-7 top-14 z-0 w-0.5 rounded-full bg-gradient-to-b from-[#5227FF] via-[#a855f7] to-[#d946ef] md:hidden" />

      {steps.map((s, i) => {
        const Icon = ICONS[s.icon] ?? Search;
        const id = (x: string) => `${idPrefix}.${i}.${x}`;
        const label = labels?.[i] ?? `Step ${i + 1}`;
        const card = (
          <li
            key={s.title}
            style={{ ["--i" as string]: i }}
            className="sf-card relative z-10 rounded-2xl border border-border/70 bg-card p-6 pt-10 transition-colors hover:border-primary/40 max-md:ml-0 max-md:pl-20 max-md:pt-6 md:text-center"
          >
            <span className="sf-badge absolute grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30 ring-4 ring-background max-md:left-0 max-md:top-3 md:-top-7 md:left-1/2 md:-translate-x-1/2">
              <Icon className="h-6 w-6" />
              <span aria-hidden className="sf-ring absolute inset-0 rounded-2xl" />
            </span>
            {idPrefix ? (
              <Et id={id("num")} def={label} className="block text-xs font-semibold uppercase tracking-widest text-primary/70" />
            ) : (
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{label}</span>
            )}
            {s.tag && (
              <span className="mt-2 inline-block rounded-full border border-border bg-background/60 px-3 py-0.5 text-xs font-medium text-muted-foreground">
                {idPrefix ? <Et id={id("tag")} def={s.tag} /> : s.tag}
              </span>
            )}
            {idPrefix ? (
              <>
                <Et as="h3" id={id("title")} def={s.title} className="mt-1 block text-lg font-semibold" />
                <Et as="p" id={id("desc")} def={s.text} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
              </>
            ) : (
              <>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </>
            )}
          </li>
        );
        return idPrefix ? <Hide key={s.title} id={`${idPrefix}.${i}`}>{card}</Hide> : card;
      })}
    </ol>
  );
}

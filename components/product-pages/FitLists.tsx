"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Et, Hide } from "@/components/cms/editable";

/**
 * "Is X right for you?" — two brand-tinted cards that reveal item by item, using the same
 * `.lr-*` look and motion as the home hero checklist (tick / cross pop in one after another).
 */
export default function FitLists({
  slug,
  fits,
  notFits,
  action,
}: {
  slug: string;
  fits: string[];
  notFits: string[];
  /** Button shown inside the "not a fit" card (centred under its list) */
  action?: ReactNode;
}) {
  const k = (x: string) => `${slug}.${x}`;
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setPlay(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`lr-check mt-10 grid gap-4 md:grid-cols-2 ${play ? "lr-play" : ""}`}>
      <div className="lrbc-tint-strong rounded-2xl p-5 sm:p-6">
        <Et as="h3" id={k("fitGoodTitle")} def="A good fit if…" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary" />
        <ul className="mt-4 space-y-2.5">
          {fits.map((t, i) => (
            <Hide key={t} id={k(`fit.${i}`)}>
              <li
                style={{ ["--i" as string]: i, animationDelay: "calc(.15s + var(--i) * .14s)" }}
                className="lr-gain flex items-start gap-2.5 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-fuchsia-500/10 px-3 py-2.5 text-sm font-medium text-foreground"
              >
                <span style={{ animationDelay: "calc(.4s + var(--i) * .14s)" }} className="lr-gain-tick mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                <Et id={k(`fit.${i}`)} def={t} />
              </li>
            </Hide>
          ))}
        </ul>
      </div>

      <div className="lrbc-tint flex flex-col rounded-2xl p-5 sm:p-6">
        <Et as="h3" id={k("fitBadTitle")} def="Probably not the right fit if…" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground" />
        <ul className="mt-4 space-y-2.5">
          {notFits.map((t, i) => (
            <Hide key={t} id={k(`notfit.${i}`)}>
              <li
                style={{ ["--i" as string]: i, animationDelay: "calc(.15s + var(--i) * .14s), calc(.15s + var(--i) * .14s)" }}
                className="lr-pain flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2.5 text-sm font-medium text-foreground"
              >
                <span style={{ animationDelay: "calc(.4s + var(--i) * .14s)" }} className="lr-gain-tick mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <X className="h-3 w-3" strokeWidth={3} />
                </span>
                <Et id={k(`notfit.${i}`)} def={t} />
              </li>
            </Hide>
          ))}
        </ul>
        {action && <div className="lrbc-cta-row !mt-auto !pt-6">{action}</div>}
      </div>
    </div>
  );
}

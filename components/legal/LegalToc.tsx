"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface TocItem { id: string; title: string }

/** Sticky "On this page" list (desktop) + collapsible list (mobile) with scroll-spy and a reading progress bar. */
export default function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = items[0]?.id ?? "";
      for (const el of els) if (el.offsetTop <= y) cur = el.id;
      setActive(cur);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const list = (
    <ol className="space-y-0.5">
      {items.map((i, n) => (
        <li key={i.id}>
          <button
            type="button"
            onClick={() => go(i.id)}
            className={`group flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-[13px] leading-snug transition-colors ${
              active === i.id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
            }`}
          >
            <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all ${active === i.id ? "scale-125 bg-primary" : "bg-border group-hover:bg-primary/50"}`} />
            <span>{i.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* reading progress */}
      <div aria-hidden className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-transparent">
        <div className="h-full bg-gradient-to-r from-[#5227FF] via-[#a855f7] to-[#d946ef]" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* mobile */}
      <div className="mb-6 rounded-2xl border border-border/70 bg-card lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-foreground"
        >
          On this page
          <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-72 overflow-y-auto px-2 pb-3">{list}</div>
          </div>
        </div>
      </div>

      {/* desktop */}
      <aside className="sticky top-24 hidden max-h-[calc(100svh-7rem)] overflow-y-auto rounded-2xl border border-border/70 bg-card/80 p-3 backdrop-blur lg:block">
        <p className="px-3 pb-2 pt-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">On this page</p>
        {list}
      </aside>
    </>
  );
}

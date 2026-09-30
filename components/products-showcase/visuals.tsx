"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Cloud, Factory, MapPin, RefreshCw } from "lucide-react";
import type { Product, ShowcaseCard, VisualKey } from "./data";

/**
 * Mini "screen" visuals drawn inside each bento card.
 * Pure SVG / CSS (no images) so they stay crisp, light and theme-aware.
 * Animations are declared in globals.css (.ps-*) and replay whenever the
 * tablet is brought to the front (.ps-front).
 */

type VProps = { card: ShowcaseCard; product: Product };

/* ────────────── LekhaSetu ────────────── */

function LekhaDashboard() {
  const kpis = [
    { label: "Receivables", value: "₹ 24.8L", tone: "text-primary" },
    { label: "Payables", value: "₹ 11.2L", tone: "text-foreground" },
    { label: "Stock value", value: "₹ 38.5L", tone: "text-foreground" },
  ];
  const bars = [46, 62, 38, 74, 55, 82, 66];
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border/70 bg-background/70 px-2 py-1.5 md:px-2.5">
            <p className="truncate text-[8px] uppercase tracking-wide text-muted-foreground font-mono md:text-[9px]">{k.label}</p>
            <p className={`whitespace-nowrap text-[12px] font-semibold leading-tight md:text-[13px] ${k.tone}`}>{k.value}</p>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-2">
        {/* area chart */}
        <div className="relative col-span-3 overflow-hidden rounded-xl border border-border/70 bg-background/70 p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Sales trend</p>
          <svg viewBox="0 0 220 80" className="absolute inset-x-0 bottom-0 h-[78%] w-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="ls-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#6d3df0" stopOpacity="0.35" />
                <stop offset="1" stopColor="#6d3df0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 62 C20 56 30 44 50 48 S85 62 105 40 S150 20 170 28 S205 10 220 6 V80 H0 Z" fill="url(#ls-area)" className="ps-fade" />
            <path
              d="M0 62 C20 56 30 44 50 48 S85 62 105 40 S150 20 170 28 S205 10 220 6"
              fill="none"
              stroke="#6d3df0"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={1}
              className="ps-draw"
            />
          </svg>
        </div>
        {/* aging bars */}
        <div className="col-span-2 flex flex-col rounded-xl border border-border/70 bg-background/70 p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Aging</p>
          <div className="mt-1 flex flex-1 items-end gap-1">
            {bars.map((h, i) => (
              <span
                key={i}
                className="ps-grow flex-1 rounded-t-[3px] bg-gradient-to-t from-primary/70 to-primary/25"
                style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LekhaSync() {
  const rows = ["Vouchers", "Ledgers", "Stock data"];
  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <RefreshCw className="ps-spin h-6 w-6" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background ps-pulse" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {rows.map((r, i) => (
          <div key={r} className="ps-fade-up flex items-center gap-2 text-[11px]" style={{ animationDelay: `${i * 120}ms` }}>
            <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="font-medium">{r}</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">synced</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LekhaCompany() {
  const list = ["Location 1", "Location 2", "Location 3"];
  return (
    <div className="flex h-full flex-col justify-center gap-1">
      {list.map((c, i) => (
        <div
          key={c}
          className={`ps-fade-up flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] font-medium ${
            i === 0 ? "bg-primary text-primary-foreground shadow-sm" : "border border-border/70 bg-background/70 text-muted-foreground"
          }`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-primary/40"}`} />
          {c}
        </div>
      ))}
    </div>
  );
}

function LekhaStock() {
  const bars = [40, 65, 52, 80, 58, 72];
  return (
    <div className="flex h-full items-end gap-1.5 pt-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="ps-grow flex-1 rounded-t-md bg-gradient-to-t from-indigo-500/80 to-violet-400/40"
          style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

/* ────────────── WorkPilot ────────────── */

function Attendance() {
  const rows: { s: "Present" | "Late" | "Absent"; w: string }[] = [
    { s: "Present", w: "62%" },
    { s: "Present", w: "48%" },
    { s: "Late", w: "55%" },
    { s: "Present", w: "40%" },
    { s: "Absent", w: "58%" },
  ];
  const tone = {
    Present: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Late: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Absent: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  } as const;
  const counts = [
    { l: "Present", v: "42", c: "text-emerald-600 dark:text-emerald-400" },
    { l: "Late", v: "5", c: "text-amber-600 dark:text-amber-400" },
    { l: "Absent", v: "3", c: "text-rose-600 dark:text-rose-400" },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {counts.map((c) => (
          <div key={c.l} className="rounded-xl border border-border/70 bg-background/70 px-2.5 py-1.5">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{c.l}</p>
            <p className={`text-base font-semibold leading-tight ${c.c}`}>{c.v}</p>
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
        {rows.map((r, i) => (
          <div key={i} className="ps-fade-up flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-2 py-1.5" style={{ animationDelay: `${i * 90}ms` }}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 text-[9px] font-bold text-white">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="h-1.5 rounded-full bg-foreground/15" style={{ width: r.w }} />
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold ${tone[r.s]}`}>{r.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kanban() {
  const cols = [
    { t: "To do", n: 2, c: "bg-slate-400" },
    { t: "In progress", n: 2, c: "bg-indigo-500" },
    { t: "Done", n: 3, c: "bg-emerald-500" },
  ];
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {cols.map((col, ci) => (
        <div key={col.t} className="flex min-h-0 flex-col gap-1.5 rounded-xl border border-border/70 bg-background/70 p-1.5">
          <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground font-mono">
            <span className={`h-1.5 w-1.5 rounded-full ${col.c}`} />
            {col.t}
          </p>
          {Array.from({ length: col.n }).map((_, i) => (
            <span
              key={i}
              className="ps-fade-up block h-4 rounded-md bg-gradient-to-r from-primary/25 to-primary/5"
              style={{ animationDelay: `${(ci * 2 + i) * 90}ms`, width: `${88 - i * 16}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Performance() {
  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15" fill="none" className="stroke-primary/15" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" pathLength={100} strokeDasharray="100" className="ps-ring" />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[13px] font-bold">87</span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[78, 92, 66].map((w, i) => (
          <div key={i} className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <span className="ps-bar block h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${w}%`, animationDelay: `${i * 110}ms` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Impact({ card }: VProps) {
  const m = card.metrics?.[0];
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-3xl font-extrabold leading-none tracking-tight text-primary font-heading">{m?.value}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{m?.label}</p>
    </div>
  );
}

/* ────────────── Mini ERP / Custom ERP ────────────── */

function Fit({ card }: VProps) {
  const m = card.metrics?.[0];
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2">
      <div>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{m?.label}</p>
        <p className="mt-0.5 text-3xl font-extrabold leading-none tracking-tight text-primary font-heading md:text-4xl">{m?.value}</p>
      </div>
      {/* turnover scale */}
      <div className="rounded-xl border border-border/70 bg-background/70 px-2.5 py-2">
        <div className="relative h-2 rounded-full bg-foreground/10">
          <span className="ps-bar absolute inset-y-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ left: card.id === "fit" && m?.value.includes("+") ? "60%" : "12%", right: m?.value.includes("+") ? "0%" : "48%" }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[8.5px] text-muted-foreground">
          <span>₹10 Cr</span><span>₹50 Cr</span><span>₹100 Cr+</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(card.chips ?? []).map((c, i) => (
          <span key={c} className="ps-fade-up inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-1 text-[10.5px] font-semibold text-primary" style={{ animationDelay: `${i * 90}ms` }}>
            <Check className="h-2.5 w-2.5" strokeWidth={3} /> {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Modules({ card }: VProps) {
  return (
    <div className="grid h-full grid-cols-3 content-center gap-1.5">
      {(card.chips ?? []).map((c, i) => (
        <span key={c} className="ps-fade-up rounded-lg border border-border/70 bg-background/70 px-2 py-1.5 text-center text-[10.5px] font-semibold" style={{ animationDelay: `${i * 70}ms` }}>
          {c}
        </span>
      ))}
    </div>
  );
}

function Net({ card }: VProps) {
  const list = card.chips ?? [];
  return (
    <div className="flex h-full flex-col justify-center gap-1">
      {list.map((c, i) => (
        <div key={c} className="ps-fade-up flex items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-2 py-1 text-[11px] font-medium" style={{ animationDelay: `${i * 100}ms` }}>
          {c.toLowerCase().includes("factory") ? <Factory className="h-3 w-3 text-primary" /> : <MapPin className="h-3 w-3 text-primary" />}
          {c}
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 ps-pulse" />
        </div>
      ))}
    </div>
  );
}

function Cost() {
  const rows = [
    { l: "Mini ERP", w: 32, c: "bg-gradient-to-r from-violet-500 to-indigo-500" },
    { l: "Full-scale ERP", w: 88, c: "bg-foreground/20" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map((r, i) => (
        <div key={r.l}>
          <p className="mb-0.5 text-[10px] font-medium">{r.l}</p>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <span className={`ps-bar block h-full rounded-full ${r.c}`} style={{ width: `${r.w}%`, animationDelay: `${i * 120}ms` }} />
          </div>
        </div>
      ))}
      <p className="font-mono text-[8.5px] text-muted-foreground">Relative cost · illustrative</p>
    </div>
  );
}

function CloudRows({ card }: VProps) {
  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Cloud className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background ps-pulse" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {(card.chips ?? []).map((r, i) => (
          <div key={r} className="ps-fade-up flex items-center gap-2 text-[11px]" style={{ animationDelay: `${i * 120}ms` }}>
            <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="font-medium">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Flow({ card }: VProps) {
  const list = card.chips ?? [];
  return (
    <div className="flex h-full flex-col justify-center gap-1">
      {list.map((c, i) => (
        <div key={c} className="ps-fade-up flex items-center gap-2 text-[11px] font-medium" style={{ animationDelay: `${i * 100}ms` }}>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{i + 1}</span>
          {c}
          {i < list.length - 1 && <span className="ml-auto text-muted-foreground">↓</span>}
        </div>
      ))}
    </div>
  );
}

/* ────────────── Shared ────────────── */

function Steps({ card }: VProps) {
  const steps = card.steps ?? [];
  return (
    <div className="relative flex h-full items-center">
      <span className="absolute left-[8%] right-[8%] top-1/2 hidden h-px -translate-y-[10px] bg-border md:block" aria-hidden />
      <ol className="relative grid w-full grid-cols-1 gap-2 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="ps-fade-up flex items-center gap-2 md:flex-col md:gap-1 md:text-center" style={{ animationDelay: `${i * 130}ms` }}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm ring-4 ring-card">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[11.5px] font-semibold leading-tight">{s.title}</span>
              <span className="block truncate text-[10px] leading-tight text-muted-foreground md:whitespace-normal">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Pitch({ product }: VProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <p className="line-clamp-2 text-[11.5px] leading-relaxed text-muted-foreground">{product.description}</p>
      <Link
        href={product.href}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex w-fit items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
        style={{ background: product.gradient }}
      >
        {product.cta ?? `Explore ${product.name}`}
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export const VISUALS: Record<VisualKey, (p: VProps) => React.ReactElement> = {
  "lekha-dashboard": () => <LekhaDashboard />,
  "lekha-sync": () => <LekhaSync />,
  "lekha-company": () => <LekhaCompany />,
  "lekha-stock": () => <LekhaStock />,
  attendance: () => <Attendance />,
  kanban: () => <Kanban />,
  performance: () => <Performance />,
  impact: (p) => <Impact {...p} />,
  steps: (p) => <Steps {...p} />,
  pitch: (p) => <Pitch {...p} />,
  fit: (p) => <Fit {...p} />,
  modules: (p) => <Modules {...p} />,
  network: (p) => <Net {...p} />,
  cost: () => <Cost />,
  cloud: (p) => <CloudRows {...p} />,
  flow: (p) => <Flow {...p} />,
};

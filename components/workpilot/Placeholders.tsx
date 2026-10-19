"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Users, Home, ChevronLeft, Layers, Bell, CalendarClock, Circle, Flame, TrendingUp, Zap } from "lucide-react";

/** Phone bottom navigation: back, home, stack (recent apps). */
function NavBar() {
  return (
    <div className="mt-auto flex items-center justify-around border-t border-border/70 bg-card/80 px-6 py-2 text-muted-foreground backdrop-blur">
      <ChevronLeft className="h-4 w-4" aria-hidden />
      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary"><Home className="h-3.5 w-3.5" aria-hidden /></span>
      <Layers className="h-4 w-4" aria-hidden />
    </div>
  );
}

const AVATARS = ["from-[#5227FF] to-[#a855f7]", "from-[#a855f7] to-[#d946ef]", "from-[#d946ef] to-[#f472b6]", "from-[#6366f1] to-[#5227FF]"];

function Avatars({ n = 4 }: { n?: number }) {
  return (
    <div className="flex -space-x-1.5">
      {AVATARS.slice(0, n).map((g, i) => (
        <span key={i} className={`h-4 w-4 rounded-full border-2 border-card bg-gradient-to-br ${g}`} />
      ))}
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-primary">{title}</p>
      <span className="relative grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary"><Bell className="h-2.5 w-2.5" /><i className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" /></span>
    </div>
  );
}

function useTick(ms = 2400) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setT((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="lrbc-live-ping absolute inline-flex h-full w-full rounded-full bg-green-500" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
  );
}

const FEED: { t: string; d: string; s: string; tone: "ok" | "warn" | "info" }[] = [
  { t: "Shift-start check", d: "Production", s: "Done", tone: "ok" },
  { t: "Packing step", d: "To Dispatch", s: "Passed on", tone: "info" },
  { t: "Quotation follow-up", d: "Sales", s: "Reminder", tone: "warn" },
  { t: "Stock count", d: "Store", s: "Done", tone: "ok" },
  { t: "Dispatch plan", d: "Due 4 pm", s: "Assigned", tone: "info" },
  { t: "Machine cleaning", d: "Production", s: "Done", tone: "ok" },
  { t: "Order step", d: "Packing", s: "Late", tone: "warn" },
];
const TONE = {
  ok: "bg-green-500/15 text-green-600",
  warn: "bg-amber-500/15 text-amber-600",
  info: "bg-primary/10 text-primary",
};
const BARS = [48, 62, 55, 74, 68, 82, 90];

/** Generic stand-in screens used until real screenshots are added in lib/workpilot-shots.ts. All numbers are sample data. */
export function OwnerHomeMock() {
  const tick = useTick();
  const cyc = tick % 9;
  const done = 36 + cyc, total = 45, overdue = Math.max(0, 4 - Math.floor(cyc / 2)), present = 38 + (cyc % 3 === 2 ? 1 : 0);
  const r = 15, c = 2 * Math.PI * r, pct = done / total;
  const feed = [0, 1, 2, 3].map((i) => ({ ...FEED[(tick + 7 - i) % FEED.length], k: tick - i }));
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-primary/[0.08] to-background pt-7 text-[10px] leading-tight text-foreground">
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3">
        <div className="flex items-center justify-between">
          <div><p className="text-[11px] font-bold">Good morning</p><p className="text-[8px] text-muted-foreground">Today · sample data</p></div>
          <span className="relative grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary"><Bell className="h-3 w-3" /><i className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" /></span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm">
          <div className="relative h-12 w-12 shrink-0">
            <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90" aria-hidden>
              <circle cx="20" cy="20" r={r} fill="none" strokeWidth="5" className="stroke-muted" />
              <circle cx="20" cy="20" r={r} fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="stroke-primary transition-all duration-700" />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[9px] font-bold">{Math.round(pct * 100)}%</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Checklists today</p>
            <p className="mt-0.5 text-muted-foreground"><b className="text-foreground">{done}</b> of {total} done</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-green-600"><LiveDot /> Live</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { l: "Overdue", v: overdue, c: "text-red-500", I: AlertTriangle },
            { l: "Present", v: present, c: "text-primary", I: Users },
            { l: "On time", v: "93%", c: "text-green-600", I: TrendingUp },
          ].map(({ l, v, c: col, I }) => (
            <div key={l} className="rounded-xl border border-border bg-card p-1.5 text-center">
              <I className={`mx-auto h-3 w-3 ${col}`} />
              <p className={`mt-0.5 text-[13px] font-bold tabular-nums ${col}`}>{v}</p>
              <p className="text-[7.5px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-2">
          <div className="flex items-center justify-between"><p className="font-semibold">This week</p><span className="text-[8px] text-muted-foreground">tasks on time</span></div>
          <div className="mt-1.5 flex h-8 items-end gap-1">
            {BARS.map((h, i) => (
              <span key={i} style={{ height: `${i === 6 ? Math.min(100, 70 + cyc * 3) : h}%` }} className={`flex-1 rounded-t-sm transition-all duration-700 ${i === 6 ? "bg-gradient-to-t from-[#5227FF] to-[#d946ef]" : "bg-primary/25"}`} />
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <p className="mb-1 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground"><Zap className="h-2.5 w-2.5 text-primary" /> Live activity</p>
          <div className="space-y-1">
            {feed.map((f, i) => (
              <div key={f.k} style={{ opacity: 1 - i * 0.2 }} className={`${i === 0 ? "lrbc-feed-in" : ""} flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-card px-2 py-1`}>
                <span className="min-w-0"><b className="block truncate font-semibold">{f.t}</b><span className="block truncate text-[7.5px] text-muted-foreground">{f.d}</span></span>
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7.5px] font-semibold ${TONE[f.tone]}`}>{f.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export function ListMock({ title, rows }: { title: string; rows: { t: string; done?: boolean }[] }) {
  const tick = useTick(2200);
  const isFms = title === "FMS";
  const isDel = title === "Delegation";
  // live: items tick off one by one, then the cycle restarts
  const n = rows.length;
  const step = tick % (n + 2);
  const doneAt = (i: number) => i < Math.min(step, n);
  const doneCount = rows.filter((_, i) => doneAt(i)).length;
  const pct = Math.round((doneCount / n) * 100);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-primary/[0.08] to-background pt-7 text-[10px] text-foreground">
      <div className="flex flex-1 flex-col gap-2 px-3">
        <Header title={title} />
        <div className="rounded-xl border border-border bg-card p-2">
          <div className="flex items-center justify-between"><span className="font-semibold">{isFms ? "Order in progress" : isDel ? "Assigned today" : "Today's routine"}</span><span className="flex items-center gap-1 text-[8px] font-semibold text-green-600"><LiveDot /> Live</span></div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div style={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-[#5227FF] to-[#d946ef] transition-all duration-700" /></div>
          <p className="mt-1 text-[8px] text-muted-foreground tabular-nums">{doneCount} of {n} {isFms ? "steps" : "done"}</p>
        </div>

        {isFms ? (
          <div className="rounded-xl border border-border bg-card p-3">
            {rows.map((r, i) => {
              const d = doneAt(i), cur = !d && i === doneCount;
              return (
                <div key={r.t} className="relative flex items-start gap-2.5 pb-3 last:pb-0">
                  {i < n - 1 && <span className={`absolute left-[7px] top-4 h-[calc(100%-10px)] w-px transition-colors duration-700 ${d ? "bg-primary/60" : "bg-border"}`} />}
                  {d ? <CheckCircle2 className="relative h-3.5 w-3.5 shrink-0 text-green-500" /> : cur ? <span className="relative mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center"><span className="lrbc-live-ping absolute h-3 w-3 rounded-full bg-primary/40" /><span className="h-2 w-2 rounded-full bg-primary" /></span> : <Circle className="relative h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />}
                  <div className="flex-1"><p className={d ? "text-muted-foreground line-through" : "font-semibold"}>{r.t}</p><div className="mt-0.5 flex items-center gap-1.5"><Avatars n={1} /><span className="text-[8px] text-muted-foreground">{cur ? "In progress · time limit running" : "Owner · time limit"}</span></div></div>
                </div>
              );
            })}
          </div>
        ) : (
          rows.map((r, i) => {
            const d = doneAt(i);
            return (
              <div key={r.t} className="rounded-xl border border-border bg-card p-2.5 transition-colors duration-500">
                <div className="flex items-center gap-2">
                  {d ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />}
                  <span className={d ? "text-muted-foreground line-through" : "font-semibold"}>{r.t}</span>
                </div>
                {isDel ? (
                  <div className="mt-1.5 flex items-center justify-between pl-6">
                    <Avatars n={i + 1 > 2 ? 2 : 1} />
                    <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${d ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}><CalendarClock className="h-2.5 w-2.5" />{d ? "Done" : "Due today"}</span>
                  </div>
                ) : !d && <p className="mt-1 flex items-center gap-1 pl-6 text-[8px] text-muted-foreground"><Flame className="h-2.5 w-2.5 text-amber-500" /> Pending</p>}
              </div>
            );
          })
        )}
      </div>
      <NavBar />
    </div>
  );
}

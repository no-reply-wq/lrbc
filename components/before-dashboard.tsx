"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Brain,
  Calculator,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  HelpCircle,
  Mail,
  MessageCircle,
  NotebookPen,
} from "lucide-react";

/**
 * "Without ERP" — an interactive look at what an MSME owner actually lives with:
 * the same question, asked of different places, gives different answers.
 * Pick a question on the left and see who "knows" what. Figures are illustrative.
 */

type SourceKey = "sheet" | "whatsapp" | "paper" | "email" | "tally" | "memory";

const SOURCES: Record<SourceKey, { name: string; hint: string; icon: typeof Mail }> = {
  sheet: { name: "Excel sheets", hint: "many versions", icon: FileSpreadsheet },
  whatsapp: { name: "WhatsApp groups", hint: "buried in chats", icon: MessageCircle },
  paper: { name: "Paper registers", hint: "not digitised", icon: NotebookPen },
  email: { name: "Email threads", hint: "scattered", icon: Mail },
  tally: { name: "Old accounts file", hint: "last month's export", icon: Calculator },
  memory: { name: "Someone's memory", hint: "single point of failure", icon: Brain },
};

const QUESTIONS: {
  q: string;
  short: string;
  answers: { src: SourceKey; who: string; says: string; age: string }[];
  loss: string;
}[] = [
  {
    q: "How many leads are active right now?",
    short: "Active leads",
    answers: [
      { src: "sheet", who: "Leads_final_v7.xlsx", says: "118", age: "updated 12 days ago" },
      { src: "whatsapp", who: "Sales team group", says: "“around 130?”", age: "last message Tue" },
      { src: "paper", who: "Ramesh's register", says: "104", age: "not updated this week" },
      { src: "memory", who: "Rahul (sales)", says: "“should be ~120”", age: "from memory" },
    ],
    loss: "Follow-ups get missed because nobody sees the full list.",
  },
  {
    q: "How much payment is still to be collected?",
    short: "Receivables",
    answers: [
      { src: "tally", who: "Accounts export", says: "₹14.8L", age: "last month's file" },
      { src: "sheet", who: "Collections.xlsx", says: "₹12.1L", age: "owned by one person" },
      { src: "email", who: "Customer statements", says: "₹15.2L + ?", age: "3 threads unread" },
      { src: "memory", who: "Accountant (call)", says: "“I'll check and tell you”", age: "no answer yet" },
    ],
    loss: "Cash stays stuck because overdue accounts are found too late.",
  },
  {
    q: "Is there enough stock for the big order?",
    short: "Stock",
    answers: [
      { src: "paper", who: "Store register", says: "“Enough”", age: "counted last week" },
      { src: "sheet", who: "Stock.xlsx", says: "Short by 40 units", age: "updated 9 days ago" },
      { src: "whatsapp", who: "Store manager", says: "“count is pending”", age: "asked twice" },
      { src: "email", who: "Purchase mail", says: "PO not sent yet", age: "draft since Mon" },
    ],
    loss: "Orders are promised first and the shortage is discovered later.",
  },
  {
    q: "Where is the approval stuck?",
    short: "Approvals",
    answers: [
      { src: "whatsapp", who: "Approval chat", says: "“sent to Sharma ji”", age: "2 days ago" },
      { src: "email", who: "Inbox", says: "No reply since Tue", age: "1 reminder sent" },
      { src: "paper", who: "File on desk", says: "Signed, not handed over", age: "nobody knows" },
      { src: "memory", who: "Manager", says: "“thought it was done”", age: "from memory" },
    ],
    loss: "Work waits silently — there is no trail of who has the next step.",
  },
];

const COSTS = [
  { big: "~9 hrs", small: "a week spent chasing and matching data" },
  { big: "3×", small: "the same entry typed into sheets, chats and books" },
  { big: "12 days", small: "average age of the numbers you decide on" },
];

const PROBLEMS = ["Duplicate entry", "Missed follow-ups", "Late payments", "Stock surprises", "No owner visibility"];

export default function BeforeDashboard() {
  const [active, setActive] = useState(0);
  const cur = QUESTIONS[active];
  const involved = new Set(cur.answers.map((a) => a.src));

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <style>{`@keyframes bd-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.bd-in{animation:none!important}}`}</style>

      {/* window bar */}
      <div className="flex items-center justify-between gap-3 border-b bg-red-500/[0.06] px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="font-heading text-[15px] font-bold leading-tight sm:text-lg">The owner&apos;s Monday morning</p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">Same business · six places to look · no single answer</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
          <AlertTriangle className="h-3.5 w-3.5" /> <span className="max-sm:hidden">6 sources ·</span> 0 connected
        </span>
      </div>

      {/* body — on desktop it is a fixed-height, two-column layout; on mobile it scrolls inside a frame */}
      <div data-tf-scroll className="flex h-[calc(var(--tf-screen-h,480px)+40px)] flex-col overflow-y-auto md:h-[calc(var(--tf-card-h,700px)-64px)] md:flex-row">
        {/* left — questions + cost */}
        <aside className="shrink-0 border-b bg-secondary/40 p-4 md:sticky md:top-0 md:h-full md:w-[300px] md:self-start md:border-b-0 md:border-r md:p-4">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Ask a simple question</p>
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1.5 md:overflow-visible md:pb-0">
            {QUESTIONS.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.short}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[13px] font-semibold leading-snug transition-all max-md:w-[210px] md:w-full ${
                    on
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  <HelpCircle className={`h-4 w-4 shrink-0 ${on ? "" : "text-primary"}`} />
                  <span className="flex-1">{item.q}</span>
                  <ChevronRight className={`hidden h-4 w-4 shrink-0 transition-transform md:block ${on ? "translate-x-0.5" : "opacity-40 group-hover:translate-x-0.5"}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-4 hidden md:block">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">What it quietly costs</p>
            <ul className="space-y-1.5">
              {COSTS.map((c) => (
                <li key={c.big} className="flex items-baseline gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.05] px-3 py-1.5">
                  <span className="font-heading text-lg font-extrabold text-red-600 dark:text-red-400">{c.big}</span>
                  <span className="text-[12px] leading-snug text-muted-foreground">{c.small}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* right — where the data lives + the conflicting answers */}
        <section className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-3 md:p-5">
          {/* where data lives */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Where your data lives</p>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
              {(Object.keys(SOURCES) as SourceKey[]).map((k, i) => {
                const s = SOURCES[k];
                const Icon = s.icon;
                const hit = involved.has(k);
                return (
                  <div
                    key={k}
                    className={`rounded-xl border px-2 py-2 text-center transition-all duration-300 ${
                      hit ? "border-red-500/50 bg-red-500/[0.07] shadow-sm" : "border-border bg-card opacity-60"
                    }`}
                    style={{ transform: `rotate(${[-1.2, 0.8, -0.6, 1.1, -0.9, 0.7][i]}deg)` }}
                  >
                    <Icon className={`mx-auto h-4 w-4 ${hit ? "text-red-500" : "text-muted-foreground"}`} />
                    <p className="mt-1 text-[11px] font-semibold leading-tight">{s.name}</p>
                    <p className="text-[10px] leading-tight text-muted-foreground">{s.hint}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* the answers */}
          <div key={active} className="bd-in flex-1" style={{ animation: "bd-in .35s ease both" }}>
            <p className="mb-2 text-sm font-bold">
              <span className="text-muted-foreground">Q:</span> {cur.q}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {cur.answers.map((a) => {
                const Icon = SOURCES[a.src].icon;
                return (
                  <div key={a.who} className="rounded-xl border bg-card p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate font-medium">{a.who}</span>
                    </div>
                    <p className="mt-2 font-heading text-lg font-bold leading-tight">{a.says}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400">
                      <Clock className="h-3 w-3" /> {a.age}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-[13px] leading-snug">
                <span className="font-bold text-red-600 dark:text-red-400">Four places, four answers. Which one is right? Nobody can say.</span>{" "}
                <span className="text-muted-foreground">{cur.loss}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PROBLEMS.map((p) => (
              <span key={p} className="rounded-full border border-red-500/25 bg-red-500/[0.06] px-2.5 py-1 text-[11px] font-medium text-red-700 dark:text-red-300">
                {p}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground/70">Illustrative example of a typical MSME without a connected system.</p>
        </section>
      </div>
    </div>
  );
}

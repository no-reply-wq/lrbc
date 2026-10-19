"use client";

import Link from "next/link";
import { LogoCloud } from "@/components/logo-cloud-4";
import { UserCheck, Hourglass, AlertOctagon, BellRing as BellIcon, LineChart, CheckCheck } from "lucide-react";
import { CalendarCheck, ClipboardCheck, GitBranch, Repeat, Send, Users, Smartphone, ShieldCheck, BellRing, Network, Gauge, History, FileBarChart, Phone, MessageCircle, Check, X as XIcon } from "lucide-react";
import ContactFormModal from "@/components/ContactFormModal";
import StepsFlow from "@/components/product-pages/StepsFlow";
import { AppShowcase, DetailCard, IndexPill, type Shot } from "@/components/workpilot/ScreenShowcase";
import PhoneFrame from "@/components/workpilot/PhoneFrame";
import { OwnerHomeMock, ListMock } from "@/components/workpilot/Placeholders";
import { Et, Hide } from "@/components/cms/editable";
import type { ReactNode } from "react";

const TRIAL = "Start my 15-day free trial";
const trialBtn = "lrbc-btn lrbc-btn-primary";

function Head({ id, eyebrow, title, sub, center = true }: { id: string; eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-8 max-w-3xl md:mb-12 ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <div className="lrbc-eyebrow-row mb-4"><Et as="span" id={`${id}.eyebrow`} def={eyebrow} className="lrbc-eyebrow" /></div>}
      <Et as="h2" id={`${id}.title`} def={title} className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl" />
      {sub && <Et as="p" id={`${id}.sub`} def={sub} className="mt-4 text-base text-muted-foreground sm:text-lg" />}
    </div>
  );
}

/* ───────────── Hero ───────────── */
export function Hero() {
  return (
    <Hide id="wp2.hero.sec">
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.10)_0%,transparent_70%)]" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-28 sm:px-6 md:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pb-16">
          <div className="lrbc-hero-left text-center lg:text-left">
            <div className="lrbc-eyebrow-row lg:justify-start"><Et as="span" id="wp2.hero.badge" def="WorkPilot by LRBC" className="lrbc-eyebrow" /></div>
            <Et as="h1" id="wp2.hero.title" def="Know what got done today, without a single follow-up call." className="mt-6 font-heading text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl xl:text-[3.5rem]" />
            <Et as="p" id="wp2.hero.sub" def="WorkPilot runs your daily checklists, delegated tasks and process flows in one place. It reminds your team for you, flags what's running late, and shows you who is delivering, on any phone." className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0" />
            <div className="lrbc-cta-row mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <ContactFormModal buttonText={TRIAL} source="WorkPilot — free trial (hero)" className={trialBtn} />
              <a href="#day" className="lrbc-btn lrbc-btn-secondary"><Et id="wp2.hero.cta2" def="See WorkPilot in action" /></a>
            </div>
            <Et as="p" id="wp2.hero.note" def="No credit card. Set up in hours. Works in any phone browser, nothing to install." className="mt-4 text-sm text-muted-foreground" />
          </div>
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-none">
            <PhoneFrame shot="hero" className="w-[250px] sm:w-[270px] lg:w-[250px]" alt="WorkPilot owner screen showing today's checklists, overdue tasks and attendance" fallback={<OwnerHomeMock />} />
            <div aria-hidden className="pointer-events-none absolute left-1 -top-3 flex items-center gap-1.5 rounded-xl border border-border bg-card/95 px-2.5 py-1.5 text-[10px] font-semibold shadow-lg shadow-primary/15 sm:left-2 lg:left-2" style={{ animation: "lrbc-float 5s ease-in-out infinite" }}><CheckCheck className="h-3.5 w-3.5 text-green-500" /> Task done</div>
            <div aria-hidden className="pointer-events-none absolute bottom-[22%] right-0 flex items-center gap-1.5 rounded-xl border border-border bg-card/95 px-2.5 py-1.5 text-[10px] font-semibold shadow-lg shadow-primary/15 sm:-right-2 lg:right-2" style={{ animation: "lrbc-float 6s ease-in-out -2s infinite" }}><BellIcon className="h-3.5 w-3.5 text-primary" /> Reminder sent</div>
          </div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── Proof bar ───────────── */
export function ProofBar() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-6">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Et as="p" id="wp2.proof.text" def="Built by LRBC, the team that builds custom ERPs for manufacturers in plastics, woven sacks, kitchenware, wire mesh and more." className="text-sm text-muted-foreground sm:text-base" />
      </div>
      <div className="mt-4"><LogoCloud /></div>
    </section>
  );
}

/* ───────────── Problem ───────────── */
function ChaosVsClear() {
  const bub = (t: string, me = false) => (
    <span className={`block max-w-[85%] rounded-2xl px-3 py-1.5 text-xs shadow-sm ${me ? "ml-auto rounded-br-sm bg-primary/90 text-white" : "rounded-bl-sm bg-card text-foreground border border-border/70"}`}>{t}</span>
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-4">
        <p className="mb-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-red-500"><AlertOctagon className="h-3.5 w-3.5" /> Today, without a system</p>
        <div className="space-y-2">
          {bub("Good morning 🙏")}
          {bub("Machine check ho gaya?", true)}
          {bub("Almost ready sir")}
          {bub("Dispatch ho gaya?", true)}
          {bub("Forwarded many times")}
          {bub("ho gaya??", true)}
        </div>
      </div>
      <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.04] p-4">
        <p className="mb-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-green-600"><CheckCheck className="h-3.5 w-3.5" /> With WorkPilot</p>
        <div className="space-y-2">
          {[["Machine check", "Done", true], ["Dispatch plan", "Done", true], ["Packing — order step", "Due 4 pm", false], ["Quotation follow-up", "Late", false]].map(([t, st, ok]) => (
            <div key={t as string} className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-xs">
              <span className="font-medium">{t as string}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ok ? "bg-green-500/10 text-green-600" : st === "Late" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600"}`}>{st as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Problem() {
  return (
    <Hide id="wp2.problem.sec">
      <section className="lrbc-section bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <Et as="h2" id="wp2.problem.title" def={'How many times did you ask "ho gaya?" today?'} className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <Et as="p" id="wp2.problem.p1" def={'You hand out the work in the morning. By evening you\'re on the phone finding out what actually happened. The machine check that was "done". The dispatch that was "almost ready". The follow-up nobody owned.'} />
              <Et as="p" id="wp2.problem.p2" def="WhatsApp groups bury instructions under forwards and good-morning messages. Excel sheets are only as current as the last person who remembered to update them. And on the day you're away, the follow-ups stop too." />
              <Et as="p" id="wp2.problem.p3" def="The problem isn't your people. It's that the whole system lives in your head and your phone." className="font-semibold text-foreground" />
            </div>
          </div>
          <ChaosVsClear />
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── What WorkPilot does ───────────── */
const TOOLS: { icon: typeof Repeat; name: string; tag: string; text: string; shot: "checklist" | "delegation" | "fms"; rows: { t: string; done?: boolean }[] }[] = [
  { icon: Repeat, name: "Checklists", tag: "for the work that repeats", text: "Shift-start checks, machine cleaning, stock counts, daily reports, GST filing, employee salary, insurance renewals and more. Set them up once and WorkPilot puts them in front of the right person on the right day, then shows you which ones were skipped.", shot: "checklist", rows: [{ t: "Shift-start check", done: true }, { t: "Machine cleaning", done: true }, { t: "Stock count" }] },
  { icon: Send, name: "Delegation", tag: "for the work you hand out", text: "Assign a task to a person or a team with a deadline. They see it on their phone, update it as they go, and get a reminder before it's late. You stop being the reminder.", shot: "delegation", rows: [{ t: "Quotation follow-up — Sales" }, { t: "Dispatch plan — Store", done: true }] },
  { icon: GitBranch, name: "FMS", tag: "for the work that moves step by step", text: "Orders, dispatches, purchase requests: anything that passes from one desk (department) to another. Every step has an owner and a time limit, so you can see exactly where something is stuck, and with whom.", shot: "fms", rows: [{ t: "Booking", done: true }, { t: "Production", done: true }, { t: "Packing" }, { t: "Dispatch" }] },
];

export function WhatItDoes() {
  return (
    <Hide id="wp2.what.sec">
      <section className="lrbc-section bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Head id="wp2.what" eyebrow="What WorkPilot does" title="One place for every kind of work your team does" sub="Most work in a business is one of three kinds: work that repeats, work you hand out, and work that moves from desk (department) to desk (department). WorkPilot has a tool for each, plus attendance and leave management." />
          <div className="space-y-6 md:space-y-8">
            {TOOLS.map((t, i) => (
              <Hide key={t.name} id={`wp2.what.tool.${i}`}>
                <div className="grid items-center gap-6 rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:gap-10">
                  <div className={i % 2 ? "md:order-2" : ""}>
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-md shadow-primary/25"><t.icon className="h-5 w-5" /></span>
                    <Et as="h3" id={`wp2.what.tool.${i}.name`} def={t.name} className="mt-4 block font-heading text-2xl font-bold text-foreground" />
                    <Et as="p" id={`wp2.what.tool.${i}.tag`} def={t.tag} className="text-sm font-semibold uppercase tracking-wider text-primary" />
                    <Et as="p" id={`wp2.what.tool.${i}.text`} def={t.text} className="mt-3 text-base leading-relaxed text-muted-foreground" />
                  </div>
                  <PhoneFrame shot={t.shot} alt={`WorkPilot ${t.name} screen`} className={`w-[190px] md:w-[200px] ${i % 2 ? "md:order-1" : ""}`} fallback={<ListMock title={t.name} rows={t.rows} />} />
                </div>
              </Hide>
            ))}
            <Hide id="wp2.what.att">
              <div className="flex flex-col items-start gap-4 rounded-3xl border border-border/70 bg-card/70 p-5 sm:flex-row sm:items-center sm:p-8">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-md shadow-primary/25"><CalendarCheck className="h-5 w-5" /></span>
                <div>
                  <Et as="h3" id="wp2.what.att.name" def="Attendance — included" className="font-heading text-xl font-bold text-foreground" />
                  <Et as="p" id="wp2.what.att.text" def="Who came in, who's late, who's absent, updated live. No register, no month-end tallying." className="mt-1 text-base text-muted-foreground" />
                </div>
              </div>
            </Hide>
          </div>
          <Et as="p" id="wp2.what.close" def="Every person gets one list: what to do today. You get one screen: what's done, what's late, and who to talk to." className="mx-auto mt-10 max-w-2xl text-center font-heading text-xl font-semibold text-foreground" />
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── Real product screens ───────────── */
const REAL: { id: string; label: string; src: string; alt: string; cap: string }[] = [
  { id: "dashboard", label: "My performance", src: "/images/workpilot/app-dashboard.jpg", alt: "WorkPilot dashboard showing on-time, late and pending percentages for delegation, checklist and FMS tasks", cap: "Your numbers on one screen: what's done on time, what's late and what is still pending, split by delegation, checklist and FMS." },
  { id: "delegation", label: "Delegated tasks", src: "/images/workpilot/app-task-hub-delegation.jpg", alt: "WorkPilot task hub listing delegated tasks with deadline, priority and status", cap: "Every task you've been given, with who assigned it, the deadline, its priority and what to do next: complete, send back or pass it on." },
  { id: "checklist", label: "Daily checklists", src: "/images/workpilot/app-task-hub-checklist.jpg", alt: "WorkPilot task hub listing daily and weekly checklists to submit", cap: "Daily and weekly routines show up on their own, due date beside each, ready to submit in one tap." },
  { id: "manage", label: "Manage tasks", src: "/images/workpilot/app-manage-delegation.jpg", alt: "WorkPilot delegation work monitor showing tasks assigned to team members with status", cap: "The assigner's view: every task you've handed out, who has it, when it's due and where it stands." },
];

export function RealScreens() {
  const shots: Shot[] = REAL.map((r, i) => ({ id: r.id, label: r.label, src: r.src, alt: r.alt, caption: <Et as="span" id={`wp2.real.cap.${i}`} def={r.cap} /> }));
  return (
    <Hide id="wp2.real.sec">
      <section className="lrbc-section relative overflow-hidden bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Head id="wp2.real" eyebrow="The real product" title="This is what you'll actually see" sub="Real WorkPilot screens, not mock-ups. Tap through them, or open any one full size." />
          <AppShowcase shots={shots} />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <DetailCard idx={1} full="/images/workpilot/app-dashboard.jpg" src="/images/workpilot/detail-score-tiles.jpg" alt="WorkPilot performance tiles: late, not done, done on time and pending percentages, with delegation, checklist and FMS breakdowns" title={<Et as="span" id="wp2.real.d1.t" def="Know where you stand, instantly" />} text={<Et as="span" id="wp2.real.d1.x" def="Late, not done, done on time and pending, for delegation, checklists and FMS, each with its own count and percentage." />} />
            <DetailCard idx={2} full="/images/workpilot/app-task-hub-delegation.jpg" src="/images/workpilot/detail-task-tabs.jpg" alt="WorkPilot task hub tabs for all data, checklist, delegation and FMS missions with pending counts and date filters" title={<Et as="span" id="wp2.real.d2.t" def="One hub for every kind of task" />} text={<Et as="span" id="wp2.real.d2.x" def="Checklists, delegated tasks and FMS missions side by side, with red badges for what's waiting and quick filters like Today and Next 7 days." />} />
            <DetailCard idx={3} full="/images/workpilot/app-task-hub-delegation.jpg" src="/images/workpilot/detail-task-table.jpg" alt="WorkPilot task table with assigner, deadline, priority and action buttons for each task" title={<Et as="span" id="wp2.real.d3.t" def="Every task, owner and status" />} text={<Et as="span" id="wp2.real.d3.x" def="Who assigned it, when it's due, how urgent it is, and the buttons to complete it, send it back for revision or pass it on." />} />
          </div>
          <div className="mt-10 text-center"><IndexPill /></div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── A day with WorkPilot ───────────── */
const DAY = [
  ["8:45 am", "Your floor supervisor marks himself in on his phone. His shift-start checklist is already waiting."],
  ["10:30 am", "Between meetings, you hand a quotation follow-up to Sales, due by 4 pm. It takes ten seconds."],
  ["1:00 pm", "An order has sat at packing for three hours past its limit. It turns red on your screen before the customer calls you."],
  ["3:30 pm", "The quotation is still open. WorkPilot sends the reminder, so you don't have to."],
  ["6:00 pm", "One look: 42 of 45 checklists done, two tasks overdue, and you know exactly whom to talk to tomorrow."],
];

const DAY_ICONS = [UserCheck, Send, Hourglass, BellIcon, LineChart];
const DAY_CHIPS = ["Checked in", "Delegated", "Flagged red", "Reminder sent", "Day review"];

export function DayTimeline() {
  return (
    <Hide id="wp2.day.sec">
      <section id="day" className="lrbc-section bg-background scroll-mt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Head id="wp2.day" eyebrow="A day with WorkPilot" title="What your day looks like when the system does the chasing" />
          <ol className="relative space-y-5 before:absolute before:bottom-4 before:left-[23px] before:top-4 before:w-px before:bg-gradient-to-b before:from-primary/50 before:to-primary/10">
            {DAY.map(([time, text], i) => {
              const Icon = DAY_ICONS[i];
              return (
                <Hide key={time} id={`wp2.day.item.${i}`}>
                  <li className="relative flex gap-4 sm:gap-5">
                    <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/25"><Icon className="h-5 w-5" /></span>
                    <div className="flex-1 rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Et as="p" id={`wp2.day.item.${i}.time`} def={time} className="font-mono text-sm font-semibold text-primary" />
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">{DAY_CHIPS[i]}</span>
                      </div>
                      <Et as="p" id={`wp2.day.item.${i}.text`} def={text} className="mt-1.5 text-base leading-relaxed text-foreground/85" />
                      {i === 4 && (
                        <div className="mt-3">
                          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[93%] rounded-full bg-gradient-to-r from-[#5227FF] to-[#d946ef]" /></div>
                          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground"><span>42 of 45 checklists</span><span>2 overdue</span></div>
                        </div>
                      )}
                    </div>
                  </li>
                </Hide>
              );
            })}
          </ol>
          <Et as="p" id="wp2.day.caption" def="An example day. Your checklists and steps are set up around how your business already works." className="mt-8 text-sm italic text-muted-foreground" />
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── Owner's view ───────────── */
const OWNER = [
  { icon: Gauge, title: "A score for every person.", text: "Built from attendance, tasks completed on time and daily activity. Spot your quiet top performers, and catch a slipping pattern before it becomes a problem." },
  { icon: History, title: "A record of everything.", text: 'Every check-in, update and note is logged with a time. When someone says "I did it", you can check in seconds.' },
  { icon: FileBarChart, title: "Reports for your review meeting.", text: "Attendance, task completion and productivity summaries in one click, ready to share or export to Excel." },
];

export function OwnerView() {
  return (
    <Hide id="wp2.owner.sec">
      <section className="lrbc-section bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Head id="wp2.owner" eyebrow="The owner's view" title="See who's delivering, not just who showed up" />
          <div className="grid gap-5 md:grid-cols-3">
            {OWNER.map((o, i) => (
              <Hide key={o.title} id={`wp2.owner.card.${i}`}>
                <div className="rounded-2xl border border-border/70 bg-card/70 p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><o.icon className="h-5 w-5" /></span>
                  <Et as="h3" id={`wp2.owner.card.${i}.title`} def={o.title} className="mt-4 block font-heading text-lg font-semibold text-foreground" />
                  <Et as="p" id={`wp2.owner.card.${i}.text`} def={o.text} className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base" />
                </div>
              </Hide>
            ))}
          </div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── Built for the shop floor ───────────── */
const FLOOR = [
  { icon: Smartphone, title: "Nothing to install.", text: "It opens in any phone browser. No app store, no storage space, no updates to chase." },
  { icon: ShieldCheck, title: "Everyone sees only what's theirs.", text: "Staff see their own list. Managers see their team. You see everything." },
  { icon: BellRing, title: "Reminders go out on their own.", text: "By email on every plan, and on WhatsApp from the Professional plan." },
  { icon: Network, title: "Fits your structure.", text: "Departments like Production, Sales and Back-office are mapped as they are today. No reorganising to suit the software." },
];

export function ShopFloor() {
  return (
    <Hide id="wp2.floor.sec">
      <section className="lrbc-section bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Head id="wp2.floor" eyebrow="Built for the shop floor" title="If your team has a phone, they can use WorkPilot" />
          <div className="grid gap-4 sm:grid-cols-2">
            {FLOOR.map((f, i) => (
              <Hide key={f.title} id={`wp2.floor.item.${i}`}>
                <div className="flex gap-4 rounded-2xl border border-border/70 bg-card/70 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <Et as="h3" id={`wp2.floor.item.${i}.title`} def={f.title} className="block font-heading text-base font-semibold text-foreground" />
                    <Et as="p" id={`wp2.floor.item.${i}.text`} def={f.text} className="mt-1 text-sm leading-relaxed text-muted-foreground" />
                  </div>
                </div>
              </Hide>
            ))}
          </div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── How it works ───────────── */
const STEPS = [
  ["Tell us how your business runs.", "On a short call, we map your departments, your daily checklists and the steps your orders or requests pass through."],
  ["We set it up, you add your team.", "Import your people and give them roles. Your checklists and flows are ready from day one."],
  ["Your team ticks, you watch.", "Staff work from their phones. You check one screen each day and get a weekly report on who's excelling and where work gets stuck."],
];

export function HowItWorks() {
  return (
    <Hide id="wp2.how.sec">
      <section className="lrbc-section bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Head id="wp2.how" eyebrow="How it works" title="Set up in hours, with our team beside you" sub="Most software hands you a login and wishes you luck. Every WorkPilot plan includes setup help from the people who build ERPs for factories." />
          <StepsFlow
            idPrefix="wp2.how.step"
            labels={["Step 1", "Step 2", "Step 3"]}
            steps={STEPS.map(([title, text], i) => ({ icon: ["search", "configure", "track"][i], title, text }))}
          />
          <div className="mt-8 flex justify-center"><ContactFormModal buttonText={TRIAL} source="WorkPilot — free trial (how it works)" className={trialBtn} /></div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── WorkPilot vs WhatsApp + Excel ───────────── */
const VS: [string, string, string][] = [
  ["Where instructions live", "Buried in the chat", "On each person's list, with a deadline"],
  ["Who sends reminders", "You", "WorkPilot, on its own"],
  ["Daily routines", "Re-sent every morning, or forgotten", "Appear on their own; skipped ones are flagged"],
  ['"Where is that order?"', "Three phone calls", "Every step, its owner and its time limit on one screen"],
  ["Attendance", "A register, totalled at month end", "Live, every day"],
  ["Who did what", "Scroll back and hope", "A time-stamped record"],
  ["The day you're away", "Follow-ups stop", "The system keeps running"],
];

export function VsWhatsApp() {
  return (
    <Hide id="wp2.vs.sec">
      <section className="lrbc-section bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Head id="wp2.vs" eyebrow="WorkPilot vs WhatsApp + Excel" title="WhatsApp is great for talking. It's terrible for tracking." />
          <div className="rounded-3xl border border-border/70 bg-card/80 p-4 shadow-xl shadow-primary/10 backdrop-blur sm:p-6">
            <Et as="p" id="wp2.vs.colA" def="WhatsApp groups + Excel" className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary" />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {VS.map(([k, a], i) => (
                <Hide key={k} id={`wp2.vs.rowa.${i}`}>
                  <div className={`flex items-center gap-3 rounded-xl border border-rose-300/60 bg-gradient-to-br from-rose-50 to-pink-100/80 px-3 py-2.5 dark:border-rose-400/25 dark:from-rose-500/10 dark:to-pink-500/10 ${i === VS.length - 1 ? "sm:col-span-2" : ""}`}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-200/80 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"><XIcon className="h-3.5 w-3.5" strokeWidth={3} /></span>
                    <span className="min-w-0">
                      <Et as="span" id={`wp2.vs.row.${i}.k`} def={k} className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-700/70 dark:text-rose-300/70" />
                      <Et as="span" id={`wp2.vs.row.${i}.a`} def={a} className="block text-sm font-medium text-foreground/90" />
                    </span>
                  </div>
                </Hide>
              ))}
            </div>

            <div className="relative my-6 flex items-center">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
              <span className="mx-3 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#d946ef] font-mono text-[10px] font-bold text-white shadow-lg shadow-primary/40">VS</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
            </div>

            <Et as="p" id="wp2.vs.colB" def="WorkPilot" className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary" />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {VS.map(([k, , b], i) => (
                <Hide key={k} id={`wp2.vs.rowb.${i}`}>
                  <div className={`flex items-center gap-3 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] to-fuchsia-500/[0.10] px-3 py-2.5 ${i === VS.length - 1 ? "sm:col-span-2" : ""}`}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-primary/70">{k}</span>
                      <Et as="span" id={`wp2.vs.row.${i}.b`} def={b} className="block text-sm font-semibold text-foreground" />
                    </span>
                  </div>
                </Hide>
              ))}
            </div>
          </div>
          <Et as="p" id="wp2.vs.close" def="Keep WhatsApp for conversations. Move the work into WorkPilot." className="mt-6 text-center font-heading text-lg font-semibold text-foreground" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Comparing tools? See WorkPilot vs{" "}
            <Link className="underline" href="/workpilot/vs/microsoft-365">Microsoft 365</Link>,{" "}
            <Link className="underline" href="/workpilot/vs/jira">Jira</Link> and{" "}
            <Link className="underline" href="/workpilot/vs/zoho">Zoho</Link>.
          </p>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── FAQ ───────────── */
const FAQS: [string, string][] = [
  ["My staff aren't comfortable with technology. Will they actually use it?", "If they use WhatsApp, they can use WorkPilot. Each person sees a short list of what's due today: open, tick, done. Setup includes a walkthrough for your team, and we stay with you until it's part of the daily routine."],
  ["Do they need to download an app?", "No. WorkPilot opens in any phone browser. Nothing to install, nothing to update."],
  ["What exactly is FMS?", "A way to track work that moves through fixed steps, like an order going from booking to production to packing to dispatch. Each step has an owner and a time limit, so you can see where anything is stuck and who needs a nudge."],
  ["We already use an attendance app. Why switch?", "An attendance app tells you who came in. WorkPilot tells you what they got done. Attendance is included, so you don't need two tools."],
  ["Will it fit the way we work, or do we have to change?", "We map WorkPilot to your departments, routines and steps as they are today. It's built by LRBC, a team that builds ERPs for manufacturers, so we've seen how factories actually run."],
  ["Who can see what?", "Staff see their own work. Managers see their team's. You see everything. Your data stays yours, and you can export it to Excel at any time."],
  ["What happens when the free trial ends?", "You pick a plan if WorkPilot is working for you. We never ask for a card during the trial, so nothing is charged without you deciding."],
];

export function Faq() {
  return (
    <Hide id="wp2.faq.sec">
      <section className="lrbc-section bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Head id="wp2.faq" eyebrow="FAQ" title="Questions owners ask us" />
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <Hide key={q} id={`wp2.faq.item.${i}`}>
                <details className="group rounded-2xl border border-border/70 bg-card/70 p-5 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                    <Et id={`wp2.faq.item.${i}.q`} def={q} />
                    <span aria-hidden className="mt-1 text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <Et as="p" id={`wp2.faq.item.${i}.a`} def={a} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base" />
                </details>
              </Hide>
            ))}
          </div>
        </div>
      </section>
    </Hide>
  );
}

/* ───────────── Final CTA ───────────── */
export function FinalCta() {
  return (
    <Hide id="wp2.final.sec">
      <section className="lrbc-section bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Et as="h2" id="wp2.final.title" def="Tomorrow, find out what got done without picking up the phone." className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl" />
          <Et as="p" id="wp2.final.text" def="Start your 15-day free trial. We'll help you set up your first checklists and flows, and your team can be working from their phones by the end of the day." className="mt-4 text-base text-muted-foreground sm:text-lg" />
          <div className="lrbc-cta-row mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ContactFormModal buttonText={TRIAL} source="WorkPilot — free trial (bottom)" className={trialBtn} />
            <Link href="/demo" className="lrbc-btn lrbc-btn-secondary"><Et id="wp2.final.cta2" def="Book a walkthrough" /></Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            <Et id="wp2.final.note" def="No credit card · Setup help included · Questions? WhatsApp us on " />
            <a href="https://wa.me/919954953008" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><MessageCircle className="h-3.5 w-3.5" />+91 99549 53008</a>
          </p>
        </div>
      </section>
    </Hide>
  );
}

export type { ReactNode };

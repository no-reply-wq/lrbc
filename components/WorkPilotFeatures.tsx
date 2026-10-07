"use client";

import { useEffect, useRef, useState } from "react";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import { Et, Hide } from "@/components/cms/editable";
import React from "react";
import {
  Clock, CheckSquare, BarChart3, History,
  Bell, Shield, Smartphone, Zap, MousePointerClick, Gauge, Eye, CalendarCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Clock,
    title: "Live Attendance Tracking",
    desc: "Know exactly who clocked in, who is late, and who is absent — updated in real time, every day. No manual registers, no end-of-day reconciliation.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: CheckSquare,
    title: "Smart Task Assignment",
    desc: "Assign tasks to individuals or teams, set deadlines, and track completion status. Everyone knows what they need to do — and managers can see it all.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboards",
    desc: "Each employee gets a score based on attendance, task completion, and activity. Identify top performers and spot patterns before they become problems.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: History,
    title: "Full Activity History",
    desc: "Every action, check-in, task update, and note is logged permanently. Build a complete audit trail of your team's day-to-day without any manual effort.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "WorkPilot sends smart reminders for pending tasks, upcoming deadlines, and missing check-ins — so your team stays on track without constant follow-ups.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Managers see the full picture. Team members see only their own data. Admins control everything. One platform, the right information for every role.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Field teams, floor workers, and remote employees can check in, update tasks, and view their schedule from any phone — no app installation required.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: Zap,
    title: "Instant MIS Reports",
    desc: "Generate attendance reports, productivity summaries, and task completion stats in one click — ready to share with leadership or export to Excel.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
];

const METRICS = [
  { num: 94, suffix: "%", label: "Reduction in manual follow-ups", icon: MousePointerClick },
  { num: 3, suffix: "×", label: "Faster daily reporting", icon: Gauge },
  { num: 100, suffix: "%", label: "Visibility into team activity", icon: Eye },
  { num: 0, suffix: "", label: "Missed attendance records", icon: CalendarCheck },
];

/** Big, attention-grabbing results band: numbers count up once when scrolled into view. */
function MetricsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [t, setT] = useState(0); // 0 → 1 progress

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    let raf = 0; const start = performance.now(), dur = 1600;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setT(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <div
      ref={ref}
      className={`relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#3b1fb8] to-[#7e22ce] p-1 shadow-2xl shadow-primary/30 transition-all duration-700 ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      <div aria-hidden className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-[90px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-indigo-400/40 blur-[90px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] bg-white/10 lg:grid-cols-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="group relative flex flex-col items-center bg-[#1b1650]/60 px-4 py-8 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-[#241c6e]/70 sm:py-10"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-fuchsia-200 ring-1 ring-white/20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <p className="bg-gradient-to-b from-white to-fuchsia-200 bg-clip-text text-5xl font-extrabold leading-none tracking-tight text-transparent tabular-nums sm:text-6xl">
                {Math.round(m.num * t)}{m.suffix}
              </p>
              <span className="mt-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-300 group-hover:w-16" />
              <Et as="p" id={`workpilot.features.metric.${i}.label`} def={m.label} className="mt-3 max-w-[14rem] text-sm font-medium leading-snug text-white/80" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkPilotFeatures() {
  const ref = useFadeUp() as React.RefObject<HTMLElement>;

  return (
    <Hide id="workpilot.features.sec">
    <section
      ref={ref}
      id="features"
      className="py-8 md:py-12 bg-muted/30 dark:bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <Et as="p" id="workpilot.features.eyebrow" def="Features" className="lrbc-anim text-sm font-semibold uppercase tracking-widest text-primary mb-3" />
          <Et as="h2" id="workpilot.features.title" def="Everything your workforce needs, in one place" className="lrbc-anim lrbc-anim-d1 text-3xl font-bold sm:text-4xl" />
          <Et as="p" id="workpilot.features.text" def="WorkPilot is built for businesses where teams are spread across floors, sites, and shifts — and managers need clarity without chasing anyone." className="lrbc-anim lrbc-anim-d2 mt-4 text-muted-foreground text-lg" />
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Hide key={f.title} id={`workpilot.features.item.${i}`}>
              <div
                className={`lrbc-anim rounded-2xl border bg-background p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className={`${f.bg} ${f.color} inline-flex rounded-xl p-2.5 mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Et as="h3" id={`workpilot.features.item.${i}.title`} def={f.title} className="font-semibold text-sm mb-2" />
                <Et as="p" id={`workpilot.features.item.${i}.desc`} def={f.desc} className="text-xs text-muted-foreground leading-relaxed" />
              </div>
              </Hide>
            );
          })}
        </div>

        {/* Metrics strip */}
        <MetricsBand />

        {/* How it works */}
        <div className="mt-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <Et as="h2" id="workpilot.features.how.title" def="How WorkPilot works" className="lrbc-anim text-2xl font-bold sm:text-3xl" />
            <Et as="p" id="workpilot.features.how.text" def="From day one to daily operations — set up in hours, not weeks." className="lrbc-anim lrbc-anim-d1 mt-3 text-muted-foreground" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add your team",
                desc: "Import employees, define roles, and set up departments. WorkPilot maps to your existing organization structure, no restructuring needed.",
              },
              {
                step: "02",
                title: "Assign & track",
                desc: "Managers assign tasks and set deadlines. Employees update progress from any device. Status changes reflect instantly for everyone.",
              },
              {
                step: "03",
                title: "Review & improve",
                desc: "Weekly performance reports show who is excelling and where bottlenecks are forming, before they affect your business.",
              },
            ].map((s, i) => (
              <Hide key={s.step} id={`workpilot.features.step.${i}`}>
              <div className="lrbc-anim relative rounded-2xl border bg-background p-6">
                <Et id={`workpilot.features.step.${i}.num`} def={s.step} className="text-5xl font-black text-primary/10 absolute top-4 right-5" />
                <Et as="h3" id={`workpilot.features.step.${i}.title`} def={s.title} className="font-semibold text-base mb-2" />
                <Et as="p" id={`workpilot.features.step.${i}.desc`} def={s.desc} className="text-sm text-muted-foreground leading-relaxed" />
              </div>
              </Hide>
            ))}
          </div>
        </div>

      </div>
    </section>
    </Hide>
  );
}
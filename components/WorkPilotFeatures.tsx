"use client";

import { useRef } from "react";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import {
  Clock, CheckSquare, BarChart3, History,
  Bell, Shield, Smartphone, Zap,
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
  { value: "94%", label: "Reduction in manual follow-ups" },
  { value: "3×", label: "Faster daily reporting" },
  { value: "100%", label: "Visibility into team activity" },
  { value: "0", label: "Missed attendance records" },
];

export default function WorkPilotFeatures() {
  const ref = useFadeUp();

  return (
    <section
      ref={ref}
      id="features"
      className="py-16 md:py-24 bg-muted/30 dark:bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <p className="lrbc-anim text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Features
          </p>
          <h2 className="lrbc-anim lrbc-anim-d1 text-3xl font-bold sm:text-4xl">
            Everything your workforce needs, in one place
          </h2>
          <p className="lrbc-anim lrbc-anim-d2 mt-4 text-muted-foreground text-lg">
            WorkPilot is built for businesses where teams are spread across floors,
            sites, and shifts — and managers need clarity without chasing anyone.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`lrbc-anim rounded-2xl border bg-background p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className={`${f.bg} ${f.color} inline-flex rounded-xl p-2.5 mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Metrics strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="lrbc-anim rounded-2xl border bg-background p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="lrbc-anim text-2xl font-bold sm:text-3xl">How WorkPilot works</h2>
            <p className="lrbc-anim lrbc-anim-d1 mt-3 text-muted-foreground">
              From day one to daily operations — set up in hours, not weeks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add your team",
                desc: "Import employees, define roles, and set up departments. WorkPilot maps to your existing org structure — no restructuring needed.",
              },
              {
                step: "02",
                title: "Assign & track",
                desc: "Managers assign tasks and set deadlines. Employees update progress from any device. Status changes reflect instantly for everyone.",
              },
              {
                step: "03",
                title: "Review & improve",
                desc: "Weekly performance reports show who is excelling and where bottlenecks are forming — before they affect your business.",
              },
            ].map((s) => (
              <div key={s.step} className="lrbc-anim relative rounded-2xl border bg-background p-6">
                <span className="text-5xl font-black text-primary/10 absolute top-4 right-5">
                  {s.step}
                </span>
                <h3 className="font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
"use client";
import { useState } from "react";
import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";

const TABS = ["Attendance", "Tasks", "Performance"];

const ATTENDANCE = [
  { name: "Lalit Raj",   status: "present", time: "9:02 AM" },
  { name: "Aniket P.",   status: "present", time: "9:18 AM" },
  { name: "Bhavya M.",   status: "present", time: "9:45 AM" },
  { name: "Ravi Kumar",  status: "late",    time: "10:22 AM" },
  { name: "Priya S.",    status: "absent",  time: "—" },
];

const TASKS = [
  { task: "Q3 MIS Report",        assignee: "Aniket",  status: "in-progress", priority: "high" },
  { task: "LekhaSetu sync QA",    assignee: "Bhavya",  status: "done",        priority: "high" },
  { task: "Client onboarding",    assignee: "Lalit",   status: "in-progress", priority: "medium" },
  { task: "Invoice check",        assignee: "Priya",   status: "pending",     priority: "low" },
];

const PERF = [
  { name: "Aniket P.",  score: 94 },
  { name: "Bhavya M.",  score: 91 },
  { name: "Lalit Raj",  score: 88 },
  { name: "Ravi Kumar", score: 73 },
  { name: "Priya S.",   score: 62 },
];

const DOT: Record<string, string> = {
  present: "bg-green-500", late: "bg-yellow-400", absent: "bg-red-500",
  done: "bg-green-500", "in-progress": "bg-blue-400", pending: "bg-zinc-400",
};
const LABEL: Record<string, string> = {
  present: "Present", late: "Late", absent: "Absent",
  done: "Done", "in-progress": "In Progress", pending: "Pending",
};

export default function WorkPilotMini() {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col h-full text-foreground bg-background rounded-[24px] overflow-hidden">

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-border/50">
        {[
          { icon: Users,        val: "5",    label: "Team" },
          { icon: CheckCircle2, val: "69",   label: "Done" },
          { icon: Clock,        val: "9:22", label: "Avg In" },
          { icon: TrendingUp,   val: "82%",  label: "Score" },
        ].map(({ icon: Icon, val, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5 rounded-xl bg-muted/40 py-2">
            <Icon className="h-3 w-3 text-primary" />
            <span className="text-xs font-bold">{val}</span>
            <span className="text-[9px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
              tab === i ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {tab === 0 && ATTENDANCE.map(r => (
          <div key={r.name} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
            <span className="text-xs font-medium">{r.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground">{r.time}</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${DOT[r.status]}`} />
                <span className={`text-[10px] font-medium ${
                  r.status === "present" ? "text-green-500" :
                  r.status === "late" ? "text-yellow-400" : "text-red-400"}`}>
                  {LABEL[r.status]}
                </span>
              </div>
            </div>
          </div>
        ))}

        {tab === 1 && TASKS.map(t => (
          <div key={t.task} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
            <div className="min-w-0 flex-1 pr-3">
              <p className="text-[11px] font-medium truncate">{t.task}</p>
              <p className={`text-[9px] mt-0.5 ${
                t.priority === "high" ? "text-red-400" :
                t.priority === "medium" ? "text-yellow-400" : "text-zinc-400"}`}>
                {t.priority} · {t.assignee}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[t.status]}`} />
              <span className="text-[10px] text-muted-foreground">{LABEL[t.status]}</span>
            </div>
          </div>
        ))}

        {tab === 2 && (
          <div className="space-y-2.5 py-1">
            {PERF.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-[10px] w-16 shrink-0">{p.name}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      p.score >= 90 ? "bg-green-500" :
                      p.score >= 75 ? "bg-blue-500" :
                      p.score >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold w-8 text-right ${
                  p.score >= 90 ? "text-green-500" :
                  p.score >= 75 ? "text-blue-500" :
                  p.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                  {p.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

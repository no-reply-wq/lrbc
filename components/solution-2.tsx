"use client";

import {
  Database,
  Cloud,
  FileSpreadsheet,
  Wallet,
  BarChart3,
  ShieldCheck,
  Workflow,
  Sparkles,
} from "lucide-react";


const leftIcons = [
  {
    icon: Sparkles,
    className: "left-[42%] top-[8%]",
  },
  {
    icon: Database,
    className: "left-[4%] top-[38%]",
  },
  {
    icon: Workflow,
    className: "left-[42%] top-[78%]",
  },
];

const rightIcons = [
  {
    icon: Cloud,
    className: "right-[42%] top-[8%]",
  },
  {
    icon: Wallet,
    className: "right-[4%] top-[38%]",
  },
  {
    icon: BarChart3,
    className: "right-[42%] top-[78%]",
  },
];

export default function IntegrationsSection() {
  return (
    <section className="mx-auto max-w-6xl relative overflow-hidden rounded-[32px]  py-24">
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-6">
        {/* LEFT ICONS */}

        <div className="absolute inset-y-0 left-0 hidden w-80 lg:block">
          {leftIcons.map(({ icon: Icon, className }, i) => (
            <div
              key={i}
              className={`absolute ${className}`}
            >
              <div className="group flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
                <Icon className="h-5 w-5 " />
              </div>
            </div>
          ))}

          <span className="absolute left-[45%] top-[24%] h-5 w-5 rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" />
          <span className="absolute left-[18%] top-[46%] h-5 w-5 rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" />
        </div>

        {/* CONTENT */}

        <div className="relative z-10 max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            Meet LekhaSetu.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            LekhaSetu automatically syncs your accounts software data to the cloud in
            the background, keeping your business information accurate,
            connected, and always up to date.
            <br />
            <br />
            No manual effort. No interruptions. Just the clarity you need to
            make better business decisions.
          </p>
        </div>

        {/* RIGHT */}

        <div className="absolute inset-y-0 right-0 hidden w-80 lg:block">
          {rightIcons.map(({ icon: Icon, className }, i) => (
            <div
              key={i}
              className={`absolute ${className}`}
            >
              <div className="group flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
                <Icon className="h-5 w-5 " />
              </div>
            </div>
          ))}

          <span className="absolute right-[45%] top-[18%] h-5 w-5 rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" />
          <span className="absolute right-[18%] top-[46%] h-5 w-5 rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" />
        </div>

        {/* Bottom floating icon */}

      </div>

      {/* Mobile icons */}

      <div className="mt-12 flex justify-center gap-4 lg:hidden">
        {[
          Database,
          Cloud,
          FileSpreadsheet,
          Wallet,
          ShieldCheck,
        ].map((Icon, index) => (
          <div
            key={index}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 shadow dark:border-zinc-700 "
          >
            <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
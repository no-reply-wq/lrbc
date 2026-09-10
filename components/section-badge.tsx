"use client";

import type { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  text: string;
  icon?: LucideIcon;
  className?: string;
}

// Renders a simple pill badge — no icon, consistent with site palette.
// The icon prop is accepted but intentionally ignored so callers don't break.
export default function SectionBadge({ text, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={[
        "mx-auto w-fit rounded-full border border-primary/20",
        "bg-primary/5 px-4 py-1.5 text-xs font-semibold",
        "uppercase tracking-widest text-primary",
        className,
      ].join(" ")}
    >
      {text}
    </div>
  );
}

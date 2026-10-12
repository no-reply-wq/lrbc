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
    <div className="lrbc-eyebrow-row">
      <div className={["lrbc-eyebrow", className].join(" ").trim()}>{text}</div>
    </div>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  text: string;
  icon?: LucideIcon;
  className?: string;
}

export default function SectionBadge({
  text,
  icon: Icon,
  className = "",
}: SectionBadgeProps) {
  return (
    <div
      className={`
        mx-auto
        flex
        w-fit
        items-center
        gap-3
        rounded-full
        border
        border-white/30
        bg-white/10
        p-1
        pl-1
        pr-3
        backdrop-blur-md
        ${className}
      `}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black">
        {Icon && <Icon className="h-4 w-4" />}
      </span>

      <span className="text-sm font-medium text-foreground">
        {text}
      </span>
    </div>
  );
}
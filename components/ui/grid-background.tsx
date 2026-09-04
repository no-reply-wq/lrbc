"use client";

import { cn } from "@/lib/utils";

type GridBackgroundProps = {
  className?: string;
};

export default function GridBackground({
  className,
}: GridBackgroundProps) {
  return (
    <>
      {/* Grid */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:48px_48px]",
          "[background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]",
          className
        )}
      />

      {/* Fade Top */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

      {/* Fade Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Fade Left */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />

      {/* Fade Right */}
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
    </>
  );
}
"use client";

import type { ReactNode } from "react";
import { WP_SHOTS, type WpShot } from "@/lib/workpilot-shots";

/** Phone-shaped frame. Shows the real screenshot for `shot` once it is set in lib/workpilot-shots.ts, otherwise `fallback`. */
export default function PhoneFrame({ shot, alt, fallback, className = "w-[240px] sm:w-[270px]" }: { shot: WpShot; alt: string; fallback: ReactNode; className?: string }) {
  const src = WP_SHOTS[shot];
  return (
    <div className={`relative mx-auto shrink-0 ${className}`}>
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-[#5227FF]/25 via-[#a855f7]/20 to-[#d946ef]/25 blur-2xl" />
      <div className="rounded-[2.4rem] border border-border bg-foreground/90 p-2 shadow-2xl shadow-primary/20">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.9rem] bg-background">
          <span aria-hidden className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground/90" />
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} loading="lazy" decoding="async" className="!h-full !w-full object-cover object-top" />
          ) : (
            <div role="img" aria-label={alt} className="h-full w-full">{fallback}</div>
          )}
        </div>
      </div>
    </div>
  );
}

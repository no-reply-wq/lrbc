"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

export type Shot = { id: string; label: string; src: string; alt: string; caption: ReactNode };

/** Pop-up preview: a modest centred card (not full screen). Click outside, press Esc or tap X to close. */
export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#070b17] shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0b1020] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 truncate font-mono text-[11px] tracking-wider text-white/60">WorkPilot</span>
          <button type="button" aria-label="Close" onClick={onClose} className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"><X className="h-4 w-4" /></button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto block !h-auto max-h-[72vh] !w-auto max-w-full object-contain" />
      </div>
    </div>,
    document.body
  );
}

function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-[#0b1020] px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="mx-auto rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] tracking-wider text-white/60 sm:text-[11px]">WorkPilot · {label}</span>
      <span className="w-[42px]" />
    </div>
  );
}

/** Tabbed browser-window showcase. Auto-advances, pauses on hover or after a tap, click for full size. */
export function AppShowcase({ shots }: { shots: Shot[] }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const manual = useRef(false);
  useEffect(() => {
    if (paused || manual.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % shots.length), 6500);
    return () => clearInterval(id);
  }, [paused, shots.length]);
  const go = (n: number) => { manual.current = true; setI((n + shots.length) % shots.length); };
  const cur = shots[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div role="tablist" aria-label="WorkPilot screens" className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:justify-center [scrollbar-width:none]">
        {shots.map((s, n) => (
          <button key={s.id} role="tab" aria-selected={n === i} type="button" onClick={() => go(n)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${n === i ? "border-transparent bg-gradient-to-r from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30" : "border-border bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#5227FF]/30 via-[#a855f7]/20 to-[#d946ef]/30 blur-3xl sm:-inset-8" />
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070b17] shadow-2xl shadow-primary/25">
          <Chrome label={cur.label} />
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <button type="button" onClick={() => setOpen(true)} aria-label={`Open ${cur.label} full size`} className="group relative block min-w-[760px] w-full cursor-zoom-in md:min-w-0">
              <div className="relative aspect-[16/9]">
                {shots.map((s, n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={s.id} src={s.src} alt={s.alt} loading={n === 0 ? "eager" : "lazy"} decoding="async"
                    className={`absolute inset-0 !h-full !w-full object-cover object-top transition-opacity duration-700 ${n === i ? "opacity-100" : "opacity-0"}`} />
                ))}
              </div>
              <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white opacity-90 backdrop-blur transition group-hover:bg-primary"><Maximize2 className="h-3 w-3" /> View full size</span>
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground md:hidden">Swipe the screen sideways, or tap it for full size.</p>

        <button type="button" aria-label="Previous screen" onClick={() => go(i - 1)} className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-primary md:grid"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="Next screen" onClick={() => go(i + 1)} className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-primary md:grid"><ChevronRight className="h-5 w-5" /></button>
      </div>

      <div className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg" aria-live="polite">{cur.caption}</div>
      <div className="mt-4 flex justify-center gap-1.5">
        {shots.map((s, n) => <button key={s.id} type="button" aria-label={`Show ${s.label}`} onClick={() => go(n)} className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />)}
      </div>
      {open && <Lightbox src={cur.src} alt={cur.alt} onClose={() => setOpen(false)} />}
    </div>
  );
}

/** A zoomed-in detail from a real screen. Click to see it large. */
export function DetailCard({ src, full, alt, title, text, idx }: { src: string; full?: string; alt: string; title: ReactNode; text: ReactNode; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <button type="button" onClick={() => setOpen(true)} aria-label={`Enlarge: ${alt}`} className="relative block cursor-zoom-in overflow-hidden bg-[#070b17]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" className="!h-full !w-full aspect-[16/10] object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#a855f7] font-mono text-[11px] font-bold text-white">{idx}</span>
      </button>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">{text}</p>
      </div>
      {open && <Lightbox src={full ?? src} alt={alt} onClose={() => setOpen(false)} />}
    </div>
  );
}

function Ring({ pct, id }: { pct: number; id: string }) {
  const r = 20, c = 2 * Math.PI * r;
  return (
    <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
      <svg viewBox="0 0 50 50" className="h-full w-full -rotate-90" aria-hidden>
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5227FF" /><stop offset="55%" stopColor="#a855f7" /><stop offset="100%" stopColor="#d946ef" /></linearGradient></defs>
        <circle cx="25" cy="25" r={r} fill="none" strokeWidth="5" className="stroke-primary/15" />
        <circle cx="25" cy="25" r={r} fill="none" strokeWidth="5" strokeLinecap="round" stroke={`url(#${id})`} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold text-foreground sm:text-sm">{pct}%</span>
    </div>
  );
}

/** The "not done index" strip from the WorkPilot header, redrawn in the site's colours (values are from the real screen). */
export function IndexPill() {
  return (
    <div className="mx-auto inline-flex max-w-full items-center gap-3 rounded-full border border-primary/25 bg-card/80 px-4 py-2.5 shadow-lg shadow-primary/15 backdrop-blur sm:gap-5 sm:px-6">
      <div className="flex items-center gap-2.5"><Ring pct={67} id="wpi-chk" /><span className="font-mono text-[11px] font-bold tracking-[0.2em] text-muted-foreground">CHK</span></div>
      <div className="flex items-center gap-2.5"><Ring pct={57} id="wpi-del" /><span className="font-mono text-[11px] font-bold tracking-[0.2em] text-muted-foreground">DEL</span></div>
      <span aria-hidden className="h-9 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#5227FF] to-[#d946ef] text-white shadow-md shadow-primary/30"><Trophy className="h-4 w-4" /></span>
        <div className="leading-tight"><p className="text-lg font-bold text-foreground">0</p><p className="font-mono text-[9px] font-bold tracking-[0.2em] text-muted-foreground">POINTS</p></div>
      </div>
    </div>
  );
}

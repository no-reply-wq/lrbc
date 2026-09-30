"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BatteryFull, Check, ChevronDown, ChevronLeft, ChevronRight, Info, Signal, Wifi } from "lucide-react";
import SectionBadge from "@/components/section-badge";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import { PRODUCTS, type Product, type ShowcaseCard } from "./data";
import { VISUALS } from "./visuals";

/* ───────────────────────── helpers ───────────────────────── */

const ALIGN_X = { left: "justify-start", center: "justify-center", right: "justify-end" } as const;
const ALIGN_Y = { top: "items-start", center: "items-center", bottom: "items-end" } as const;
const MARGIN_X = { left: "-ml-4", center: "", right: "-mr-4" } as const;
const MARGIN_Y = { top: "-mt-4", center: "", bottom: "-mb-4" } as const;

function DetailBody({ card, product, interactive = false }: { card: ShowcaseCard; product: Product; interactive?: boolean }) {
  const Icon = card.icon;
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white shadow-sm" style={{ background: product.gradient }}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{product.name}</p>
          <h4 className="text-sm font-bold leading-tight">{card.detail.heading}</h4>
        </div>
      </div>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">{card.detail.body}</p>

      {card.metrics && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {card.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-primary/5 px-2.5 py-2">
              <p className="font-heading text-lg font-extrabold leading-none text-primary">{m.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-3 space-y-1.5">
        {card.detail.points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[12px] leading-snug">
            <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      {interactive && (
        <Link
          href={product.href}
          className="mt-3.5 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
        >
          Learn more about {product.name}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      )}
    </>
  );
}

/* ───────────────────────── bento card ───────────────────────── */

function BentoCard({ card, product }: { card: ShowcaseCard; product: Product }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const Icon = card.icon;
  const Visual = VISUALS[card.visual];

  // Tap / click outside closes the pop-up (touch devices)
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`group relative h-[232px] w-[80%] shrink-0 snap-center sm:w-[60%] md:h-auto md:w-auto md:min-h-0 md:shrink ${card.span} ${open ? "z-40" : "z-0"}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      {/* Face */}
      <div
        onClick={(e) => {
          // mouse users already get hover; taps/pens toggle
          if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setOpen((o) => !o);
        }}
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 ${
          open ? "border-primary/40 shadow-lg md:opacity-30" : "hover:border-primary/30"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h3 className="min-w-0 flex-1 truncate text-[12.5px] font-bold tracking-tight">{card.title}</h3>
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} details: ${card.title}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Info className="hidden h-3.5 w-3.5 md:block" />
            <ChevronDown className={`h-3.5 w-3.5 transition-transform md:hidden ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Visual card={card} product={product} />
        </div>
      </div>

      {/* Desktop / tablet: pop-up card */}
      <div
        className={`pointer-events-none absolute inset-0 hidden md:flex ${ALIGN_X[card.align]} ${ALIGN_Y[card.valign]}`}
        aria-hidden={!open}
      >
        <div
          data-open={open}
          className={`${MARGIN_X[card.align]} ${MARGIN_Y[card.valign]} w-[340px] min-w-[calc(100%+32px)] max-w-[400px] rounded-2xl border border-primary/25 bg-popover/95 p-4 opacity-0 shadow-[0_30px_60px_-20px_rgba(80,40,240,0.45)] backdrop-blur-xl transition-all duration-300 ease-out scale-95 data-[open=true]:scale-100 data-[open=true]:opacity-100 ${
            card.valign === "bottom" ? "origin-bottom" : card.valign === "top" ? "origin-top" : "origin-center"
          }`}
        >
          {open && <DetailBody card={card} product={product} />}
        </div>
      </div>

      {/* Mobile: in-card detail sheet (card keeps its size — no long scroll) */}
      {open && (
        <div className="ps-fade-up absolute inset-0 z-10 overflow-y-auto rounded-2xl border border-primary/30 bg-popover p-3.5 shadow-lg md:hidden">
          <DetailBody card={card} product={product} interactive />
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── cards area ───────────────────────── */

function CardsArea({ product }: { product: Product }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const onScroll = () => {
    const el = rowRef.current;
    if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + 10;
    setIdx(Math.min(product.cards.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };
  const goTo = (i: number) => {
    const el = rowRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={rowRef}
        data-no-swipe
        onScroll={onScroll}
        className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:h-[456px] md:snap-none md:grid-cols-12 md:grid-rows-3 md:overflow-visible md:px-0 md:pb-0"
      >
        {product.cards.map((card) => (
          <BentoCard key={card.id} card={card} product={product} />
        ))}
      </div>
      {/* compact pager — mobile only */}
      <div className="mt-2.5 flex items-center justify-center gap-1.5 md:hidden" role="tablist" aria-label={`${product.name} cards`}>
        {product.cards.map((c, i) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={c.title}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/35"}`}
          />
        ))}
      </div>
    </>
  );
}

/* ───────────────────────── tablet ───────────────────────── */

type Leaving = { id: string; dir: 1 | -1; boost: boolean } | null;

function Tablet({ product, pos, count, leaving }: { product: Product; pos: number; count: number; leaving: Leaving }) {
  const front = pos === 0;
  const isLeaving = leaving?.id === product.id;
  const dim = [0, 0.32, 0.5, 0.62][Math.min(pos, 3)];
  return (
    <div
      className={`col-start-1 row-start-1 min-w-0 origin-top ${front ? "ps-front" : "pointer-events-none"}`}
      style={{
        zIndex: isLeaving && leaving?.boost ? count + 2 : count - pos,
        transform: `translateY(calc(var(--off) * ${-pos})) scale(${1 - pos * 0.045})`,
        transition: "transform 750ms cubic-bezier(0.22, 1, 0.36, 1)",
        contain: front ? undefined : "size",
      }}
    >
      {/* swoosh wrapper — plays when this tablet leaves the front */}
      <div
        className="relative h-full"
        style={isLeaving ? { animation: `${leaving!.dir === 1 ? "ps-swoosh-l" : "ps-swoosh-r"} 780ms cubic-bezier(0.22, 1, 0.36, 1) both` } : undefined}
      >
        {/* side hardware buttons */}
        <span className="absolute -right-[3px] top-24 hidden h-14 w-[4px] rounded-r bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />
        <span className="absolute -left-[3px] top-20 hidden h-9 w-[4px] rounded-l bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />
        <span className="absolute -left-[3px] top-32 hidden h-9 w-[4px] rounded-l bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />

        {/* aluminium frame */}
        <div className="h-full rounded-[30px] bg-gradient-to-br from-zinc-200 via-zinc-50 to-zinc-400 p-[3px] shadow-[0_50px_90px_-35px_rgba(40,20,120,0.6),0_18px_30px_-18px_rgba(0,0,0,0.35)] sm:rounded-[40px]">
          {/* black bezel */}
          <div className="relative h-full rounded-[27px] bg-[#0a0a14] p-2.5 sm:rounded-[37px] sm:p-4">
            {/* front camera */}
            <span className="absolute left-1/2 top-[6px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1d1d33] ring-1 ring-white/10 sm:top-[9px] sm:h-2 sm:w-2" aria-hidden />

            {/* screen */}
            <div
              className="relative flex h-full flex-col overflow-visible rounded-[18px] border border-black/40 bg-gradient-to-br from-background via-background to-secondary sm:rounded-[24px]"
              aria-hidden={!front}
              inert={!front}
            >
              {/* status bar */}
              <div className="flex items-center justify-between px-4 pb-1 pt-2 font-mono text-[9px] font-medium text-foreground/70 sm:px-6 sm:text-[10px]">
                <span>9:41</span>
                <span className="flex items-center gap-1.5">
                  <Signal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <Wifi className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <BatteryFull className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
              </div>

              {/* app content */}
              <div className={`relative flex-1 px-3 pb-3 pt-1 transition-opacity duration-500 sm:px-5 sm:pb-4 ${front ? "opacity-100 delay-300" : "opacity-0"}`}>
                {/* app header (right side is covered by the bookmark ribbons) */}
                <div className="mb-3 mt-3 flex items-center gap-3 pr-2 sm:mt-1 md:h-11">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] font-heading text-base font-extrabold text-white shadow-md" style={{ background: product.gradient }}>
                    {product.initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold leading-tight sm:text-base">{product.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{product.tagline}</p>
                  </div>
                </div>

                <CardsArea product={product} />
              </div>

              {/* home indicator */}
              <div className="flex justify-center pb-1.5 pt-0.5" aria-hidden>
                <span className="h-1 w-24 rounded-full bg-foreground/25" />
              </div>

              {/* glass glare */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.06)_28%,transparent_42%)] mix-blend-soft-light"
                aria-hidden
              />
            </div>

            {/* depth dimming for the tablets behind */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#0a0a14] transition-opacity duration-700"
              style={{ opacity: dim }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── bookmark ribbon ───────────────────────── */

function Ribbon({
  product,
  index,
  pos,
  onSelect,
}: {
  product: Product;
  index: number;
  pos: number;
  onSelect: () => void;
}) {
  const front = pos === 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${product.name}`}
      aria-current={front}
      className="absolute z-[40] block h-[46px] transition-all duration-700 ease-out hover:-translate-y-0.5 focus-visible:outline-none"
      style={{
        width: "var(--w)",
        right: `calc(28px + (var(--n) - 1 - ${index}) * (var(--w) + 6px))`,
        top: `calc(var(--off) * (var(--n) - ${pos} - 1) + 20px)`,
        filter: front ? "drop-shadow(0 8px 10px rgba(80,40,240,0.35))" : "drop-shadow(0 3px 4px rgba(20,10,60,0.25))",
      }}
    >
      <span
        className={`flex h-full w-full flex-col items-center justify-start px-0.5 pt-2 text-center transition-colors sm:px-2 duration-300 ${
          front ? "text-white" : "bg-secondary text-secondary-foreground hover:bg-accent"
        }`}
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          background: front ? product.gradient : undefined,
        }}
      >
        <span className="w-full font-heading text-[10px] font-bold leading-tight tracking-tight max-sm:whitespace-nowrap sm:truncate sm:text-[13px]">{product.name}</span>
        <span className={`font-mono text-[8px] uppercase tracking-widest ${front ? "text-white/70" : "text-muted-foreground"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
    </button>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function ProductsShowcase() {
  const ref = useFadeUp();
  const N = PRODUCTS.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<Leaving>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const change = useCallback(
    (to: number, dir: 1 | -1) => {
      const target = ((to % N) + N) % N;
      if (target === active) return;
      timers.current.forEach(clearTimeout);
      setLeaving({ id: PRODUCTS[active].id, dir, boost: true });
      setActive(target);
      timers.current = [
        setTimeout(() => setLeaving((l) => (l ? { ...l, boost: false } : l)), 360),
        setTimeout(() => setLeaving(null), 820),
      ];
    },
    [active, N]
  );
  const go = useCallback((i: number) => change(i, i > active ? 1 : -1), [change, active]);
  const next = useCallback(() => change(active + 1, 1), [change, active]);
  const prev = useCallback(() => change(active - 1, -1), [change, active]);

  // swipe on touch / pen (mouse drag ignored so hover pop-ups stay usable)
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("[data-no-swipe]")) return;
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const arrowCls =
    "absolute top-1/2 z-[50] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary shadow-lg ring-1 ring-border backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-sm:h-9 max-sm:w-9";

  return (
    <section
      ref={ref}
      id="products-services"
      aria-label="Products and services"
      className="relative py-8 md:py-12"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge text="What we build" className="lrbc-anim mb-5" />
          <h2 className="lrbc-anim lrbc-anim-d1 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Products &amp; Services</h2>
          <p className="lrbc-anim lrbc-anim-d2 mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Software built around how your business actually operates. Hover (or tap) any card to see what it does and how it works.
          </p>
        </div>

        {/* stage */}
        <div
          className="lrbc-anim lrbc-anim-d2 relative mx-auto mt-10 max-w-[980px] touch-pan-y select-none [--off:14px] sm:[--off:20px] md:mt-12"
          style={
            {
              "--n": N,
              "--w": "min(128px, calc((100% - 56px) / var(--n) - 6px))",
            } as React.CSSProperties
          }
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
        >
          {/* side arrows */}
          {N > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Previous product" className={`${arrowCls} left-1 xl:-left-14`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} aria-label="Next product" className={`${arrowCls} right-1 xl:-right-14`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* bookmark ribbons (above every layer) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[40] h-0">
            <div className="pointer-events-auto relative">
              {PRODUCTS.map((p, i) => (
                <Ribbon key={p.id} product={p} index={i} pos={(i - active + N) % N} onSelect={() => go(i)} />
              ))}
            </div>
          </div>

          {/* stacked tablets — all share one grid cell so height = tallest */}
          <div className="grid grid-cols-[minmax(0,1fr)] pt-[calc(var(--off)*(var(--n)-1)+34px)]">
            {PRODUCTS.map((p, i) => (
              <Tablet key={p.id} product={p} pos={(i - active + N) % N} count={N} leaving={leaving} />
            ))}
          </div>
        </div>

        {/* dots — under the section */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Products">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={p.name}
                onClick={() => go(i)}
                className={`h-3 rounded-full border-2 transition-all duration-300 ${
                  i === active ? "w-9 border-primary bg-primary" : "w-3 border-primary/45 bg-transparent hover:border-primary"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {PRODUCTS[active].name} · {String(active + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

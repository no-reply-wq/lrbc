"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Et, Hide, Lnk } from "@/components/cms/editable";
import { ArrowUpRight, BatteryFull, Check, ChevronDown, ChevronLeft, ChevronRight, Info, Signal, Wifi } from "lucide-react";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import { PRODUCTS, cid, pid, type Product, type ShowcaseCard } from "./data";
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
          <Et as="p" id={pid(product, "name")} def={product.name} className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground" />
          <Et as="h4" id={cid(product, card, "dheading")} def={card.detail.heading} className="text-sm font-bold leading-tight" />
        </div>
      </div>
      <Et as="p" id={cid(product, card, "dbody")} def={card.detail.body} className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground" />

      {card.metrics && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {card.metrics.map((m, mi) => (
            <div key={m.label} className="rounded-xl bg-primary/5 px-2.5 py-2">
              <Et as="p" id={cid(product, card, `m.${mi}.value`)} def={m.value} className="font-heading text-lg font-extrabold leading-none text-primary" />
              <Et as="p" id={cid(product, card, `m.${mi}.label`)} def={m.label} className="mt-1 text-[10px] leading-tight text-muted-foreground" />
            </div>
          ))}
        </div>
      )}

      <ul className="mt-3 space-y-1.5">
        {card.detail.points.map((p, pi) => (
          <li key={p} className="flex items-start gap-2 text-[12px] leading-snug">
            <span className="mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <Et id={cid(product, card, `pt.${pi}`)} def={p} />
          </li>
        ))}
      </ul>

      {interactive && (
        <Lnk
          id={pid(product, "href")}
          href={product.href}
          className="mt-3.5 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
        >
          <span>
            <Et id="home.products.learnmore" def="Learn more about" /> <Et id={pid(product, "name")} def={product.name} />
          </span>
          <ArrowUpRight className="h-3 w-3" />
        </Lnk>
      )}
    </>
  );
}

/* ───────────────────────── bento card ───────────────────────── */

function BentoCard({ card, product }: { card: ShowcaseCard; product: Product }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; ny: number } | null>(null);
  // wide screens: the pop-up opens OUTSIDE the tablet, on the side where the card sits
  const side: "l" | "r" = card.align === "left" ? "l" : "r";
  const Icon = card.icon;

  useLayoutEffect(() => {
    if (!open) return;
    const compute = () => {
      if (!window.matchMedia("(min-width: 1280px)").matches) { setPos(null); return; }
      const root = rootRef.current, pop = popRef.current;
      const frame = root?.closest("[data-tablet-frame]") as HTMLElement | null;
      if (!root || !pop || !frame) return;
      const f = frame.getBoundingClientRect(), c = root.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight, gap = 20;
      const x = side === "l" ? f.left - c.left - pw - gap : f.right - c.left + gap;
      const minTop = f.top + 8, maxTop = Math.max(minTop, f.bottom - ph - 8);
      const absTop = Math.min(Math.max(c.top, minTop), maxTop);
      const y = absTop - c.top;
      setPos({ x, y, ny: Math.min(ph - 22, Math.max(22, c.height / 2 - y)) });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [open, side]);
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
          open ? "border-primary/40 shadow-lg md:opacity-30 xl:opacity-100 xl:ring-2 xl:ring-primary/30" : "hover:border-primary/30"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <Et as="h3" id={cid(product, card, "title")} def={card.title} className="min-w-0 flex-1 line-clamp-2 break-words text-[12px] font-bold leading-tight tracking-tight sm:text-[12.5px]" />
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

      {/* Wide screens (xl+): pop-up opens outside the tablet, on the card's own side */}
      <div
        ref={popRef}
        aria-hidden={!open}
        data-open={open && !!pos}
        style={{ left: pos?.x ?? 0, top: pos?.y ?? 0 }}
        className={`pointer-events-none absolute z-50 hidden w-[284px] rounded-2xl border border-primary/25 bg-popover/95 p-4 opacity-0 shadow-[0_30px_60px_-20px_rgba(80,40,240,0.45)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out xl:block data-[open=true]:opacity-100 data-[open=true]:translate-x-0 ${
          side === "l" ? "-translate-x-2" : "translate-x-2"
        }`}
      >
        {open && pos && (
          <span
            aria-hidden
            className={`absolute h-3 w-3 rotate-45 border-primary/25 bg-popover ${side === "l" ? "-right-[7px] border-r border-t" : "-left-[7px] border-b border-l"}`}
            style={{ top: pos.ny - 6 }}
          />
        )}
        {open && <DetailBody card={card} product={product} />}
      </div>

      {/* Tablet-size screens: pop-up card inside the tablet */}
      <div
        className={`pointer-events-none absolute inset-0 hidden md:flex xl:hidden ${ALIGN_X[card.align]} ${ALIGN_Y[card.valign]}`}
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
          <Hide key={card.id} id={cid(product, card, "card")}>
            <BentoCard card={card} product={product} />
          </Hide>
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

type Leaving = { id: string; dir: 1 | -1 } | null;

/** One "app" inside the tablet screen. Only the active app is visible; switching slides the app content, never the device. */
function AppPanel({ product, front, leaving, entering }: { product: Product; front: boolean; leaving: Leaving; entering: 1 | -1 | 0 }) {
  const isLeaving = leaving?.id === product.id;
  const anim = isLeaving
    ? `${leaving!.dir === 1 ? "ps-app-out-l" : "ps-app-out-r"} 380ms cubic-bezier(0.4, 0, 0.6, 1) both`
    : front && entering
      ? `${entering === 1 ? "ps-app-in-r" : "ps-app-in-l"} 520ms cubic-bezier(0.22, 1, 0.36, 1) both`
      : undefined;
  return (
    <div
      className={`col-start-1 row-start-1 min-w-0 ${isLeaving || (front && entering) ? "overflow-x-clip" : ""} ${front ? "ps-front" : "pointer-events-none"}`}
      style={{
        opacity: front || isLeaving ? 1 : 0,
        visibility: front || isLeaving ? "visible" : "hidden",
        contain: front ? undefined : "size",
        animation: anim,
      }}
      aria-hidden={!front}
      inert={!front}
    >
      {/* app header — product name + button to the product page */}
      <div className="mb-3 mt-3 flex items-center gap-3 px-3 sm:mt-1 sm:px-5 md:h-12">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] font-heading text-lg font-extrabold text-white shadow-lg ring-1 ring-white/40"
          style={{ background: product.gradient }}
        >
          {product.initial}
        </span>
        <div className="min-w-0">
          <Et
            as="p"
            id={pid(product, "name")}
            def={product.name}
            className="truncate font-heading text-lg font-extrabold leading-tight tracking-tight text-transparent sm:text-xl"
            style={{ backgroundImage: product.gradient, WebkitBackgroundClip: "text", backgroundClip: "text" }}
          />
          <Et as="p" id={pid(product, "tagline")} def={product.tagline} className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs" />
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-5 sm:pb-4">
        <CardsArea product={product} />
      </div>
    </div>
  );
}

type TabAnim = { dir: 1 | -1; phase: "out" | "in" } | null;

function Tablet({ active, leaving, entering, tabAnim }: { active: number; leaving: Leaving; entering: 1 | -1 | 0; tabAnim: TabAnim }) {
  // phones only: the whole tablet slides away and the next one slides in
  const wrapAnim = tabAnim
    ? tabAnim.phase === "out"
      ? `${tabAnim.dir === 1 ? "ps-stk-out-l" : "ps-stk-out-r"} 230ms cubic-bezier(0.4, 0, 1, 1) both`
      : `ps-stk-in 460ms cubic-bezier(0.22, 1.2, 0.36, 1) both`
    : undefined;
  return (
    <div className="relative min-w-0">
      {/* phones: cards waiting underneath, like a stack */}
      <span aria-hidden className="pointer-events-none absolute inset-x-5 -bottom-2.5 top-5 rounded-[32px] bg-gradient-to-br from-zinc-200 to-zinc-400 opacity-80 shadow-md sm:hidden" />
      <span aria-hidden className="pointer-events-none absolute inset-x-9 -bottom-5 top-9 rounded-[32px] bg-gradient-to-br from-zinc-200 to-zinc-400 opacity-50 shadow sm:hidden" />
      <div className="relative z-10 min-w-0" style={{ animation: wrapAnim }}>
      {/* side hardware buttons */}
      <div className="relative">
        <span className="absolute -right-[3px] top-24 hidden h-14 w-[4px] rounded-r bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />
        <span className="absolute -left-[3px] top-20 hidden h-9 w-[4px] rounded-l bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />
        <span className="absolute -left-[3px] top-32 hidden h-9 w-[4px] rounded-l bg-gradient-to-b from-zinc-300 to-zinc-500 sm:block" aria-hidden />

        {/* aluminium frame */}
        <div data-tablet-frame className="rounded-[30px] bg-gradient-to-br from-zinc-200 via-zinc-50 to-zinc-400 p-[3px] shadow-[0_50px_90px_-35px_rgba(40,20,120,0.6),0_18px_30px_-18px_rgba(0,0,0,0.35)] sm:rounded-[40px]">
          {/* black bezel */}
          <div className="relative rounded-[27px] bg-[#0a0a14] p-2.5 sm:rounded-[37px] sm:p-4">
            {/* front camera */}
            <span className="absolute left-1/2 top-[6px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1d1d33] ring-1 ring-white/10 sm:top-[9px] sm:h-2 sm:w-2" aria-hidden />

            {/* screen */}
            <div className="relative flex flex-col overflow-visible rounded-[18px] border border-black/40 bg-gradient-to-br from-background via-background to-secondary sm:rounded-[24px]">
              {/* status bar */}
              <div className="flex items-center justify-between px-4 pb-1 pt-2 font-mono text-[9px] font-medium text-foreground/70 sm:px-6 sm:text-[10px]">
                <span>9:41</span>
                <span className="flex items-center gap-1.5">
                  <Signal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <Wifi className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <BatteryFull className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
              </div>

              {/* app area — the only part that changes */}
              <div className="grid grid-cols-[minmax(0,1fr)]">
                {PRODUCTS.map((p, i) => (
                  <AppPanel key={p.id} product={p} front={i === active} leaving={leaving} entering={entering} />
                ))}
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
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function ProductsShowcase() {
  const ref = useFadeUp();
  const N = PRODUCTS.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<Leaving>(null);
  const [entering, setEntering] = useState<1 | -1 | 0>(0);
  const [tabAnim, setTabAnim] = useState<TabAnim>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const change = useCallback(
    (to: number, dir: 1 | -1) => {
      const target = ((to % N) + N) % N;
      if (target === active) return;
      // phones: whole-tablet transition (desktop / tablet screens keep the in-screen slide)
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
        if (tabAnim) return;
        setTabAnim({ dir, phase: "out" });
        timers.current = [
          setTimeout(() => { setActive(target); setTabAnim({ dir, phase: "in" }); }, 230),
          setTimeout(() => setTabAnim(null), 660),
        ];
        return;
      }
      timers.current.forEach(clearTimeout);
      setLeaving({ id: PRODUCTS[active].id, dir });
      setEntering(dir);
      setActive(target);
      timers.current = [
        setTimeout(() => setLeaving(null), 400),
        setTimeout(() => setEntering(0), 560),
      ];
    },
    [active, N, tabAnim]
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
    <Hide id="home.products.sec">
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
          <div className="lrbc-eyebrow-row lrbc-anim mb-5"><Et as="div" id="home.products.badge" def="What we build" className="lrbc-eyebrow" /></div>
          <Et as="h2" id="home.products.heading" def="Products & Services" className="lrbc-anim lrbc-anim-d1 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl" />
          <Et as="p" id="home.products.subtitle" def="Software built around how your business actually operates." className="lrbc-anim lrbc-anim-d2 mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg" />
        </div>

        {/* stage */}
        <div
          className="lrbc-anim lrbc-anim-d2 relative mx-auto mt-10 max-w-[980px] touch-pan-y select-none md:mt-12 xl:max-w-[clamp(680px,calc(100vw-600px),980px)]"
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
              <button type="button" onClick={prev} aria-label="Previous product" className={`${arrowCls} left-1 xl:hidden`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} aria-label="Next product" className={`${arrowCls} right-1 xl:hidden`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* one fixed tablet — only the app on its screen changes */}
          <Tablet active={active} leaving={leaving} entering={entering} tabAnim={tabAnim} />
        </div>

        {/* dots — under the section */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
          {N > 1 && (
            <button type="button" onClick={prev} aria-label="Previous product" className="hidden h-9 w-9 place-items-center rounded-full bg-background/90 text-primary shadow-md ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground xl:grid">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
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
          {N > 1 && (
            <button type="button" onClick={next} aria-label="Next product" className="hidden h-9 w-9 place-items-center rounded-full bg-background/90 text-primary shadow-md ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground xl:grid">
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          </div>
          <div key={PRODUCTS[active].id} className="ps-fade-up mt-3 flex w-full justify-center">
            <Lnk
              id={pid(PRODUCTS[active], "cta.href")}
              href={PRODUCTS[active].ctaHref ?? PRODUCTS[active].href}
              labelId={pid(PRODUCTS[active], "explore")}
              label={`Explore ${PRODUCTS[active].name}`}
              className="lrbc-btn lrbc-btn-primary sm:!w-auto"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Lnk>
          </div>
        </div>
      </div>
    </section>
    </Hide>
  );
}

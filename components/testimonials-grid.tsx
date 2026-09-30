"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

/**
 * Testimonials — multi-card, fixed-size layout.
 *  • Every card is exactly the same size (fixed height, never follows content length).
 *  • Each card shows a catchy summary headline; the full review opens on hover / tap
 *    (pop-up over the card, so the layout never shifts).
 *  • Cards change only every REVIEW_DELAY ms and never while someone is reading (hover / focus / open).
 *  • Reviewer names, photos, companies and review wording are unchanged — only headlines are added.
 */

const REVIEW_DELAY = 20000; // 20 s — plenty of time to read

type Testimonial = {
  headline: string;
  quote: string;
  name: string;
  company: string;
  designation: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    headline: "Built for our needs — not a standard product",
    quote:
      "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    name: "Varun Bathwal",
    company: "ARV",
    designation: "CEO",
    image: "/images/Varun.jpeg",
  },
  {
    headline: "Sharp process insight, every time we ask",
    quote:
      "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    name: "Kanul Verma",
    company: "Hitco Group",
    designation: "Executive Director",
    image: "/images/Kanul.jpeg",
  },
  {
    headline: "One connected system — and far less manual effort",
    quote:
      "We engaged LRBC to streamline our internal systems, and we are incredibly pleased with the results. They provided a true end-to-end solution that handles everything from initial inquiries and the complete sales process to our manufacturing and stores modules. We are very happy with how seamlessly the product connects all our processes. Thanks to this system, our dependency on manual effort has reduced significantly.",
    name: "Prabhu Pandurang",
    company: "Chefmate",
    designation: "CEO",
    image: "/images/Prabhu.jpeg",
  },
  {
    headline: "A technology partner who truly listens and delivers",
    quote:
      "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
    name: "Ekkta V Vohra",
    company: "Wedding Alliances",
    designation: "Founder",
    image: "/images/Ekkta.jpeg",
  },
];

// Accent per card — all from the site's violet / indigo / sky family
const ACCENTS = ["#6d3df0", "#0ea5e9", "#c026d3", "#4f46e5"];

/* ───────────────────────── card ───────────────────────── */
/* Shape follows the reference: soft white "leaf" card, slightly tilted edge,
   round quote badge overhanging the top-left corner, centred content. */

const SHAPE = "rounded-[44px] rounded-bl-[52px]";

function ReviewCard({ t, accent, align = "center" }: { t: Testimonial; accent: string; align?: "left" | "center" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const Stars = (
    <div className="mx-auto flex w-fit gap-0.5 rounded-full bg-secondary/80 px-3 py-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );

  const Person = (
    <div className="flex items-center justify-center gap-3">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
        <Image src={t.image} alt={t.name} width={40} height={40} className="h-full w-full object-cover" />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-heading text-[15px] font-bold leading-tight">{t.name}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">
          {t.designation} · {t.company}
        </p>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`group relative h-[400px] pl-6 ${open ? "z-30" : "z-0"}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      {/* tilted card shape */}
      <div className="absolute inset-y-3 left-6 right-0" aria-hidden>
        <div className={`h-full w-full -skew-y-[2.5deg] bg-card shadow-[0_18px_40px_-18px_rgba(80,40,240,0.35)] ${SHAPE}`} />
      </div>

      {/* round quote badge — overhangs the top-left corner */}
      <span
        className="absolute left-0 top-12 z-10 grid h-16 w-16 place-items-center rounded-full text-white shadow-lg ring-4 ring-secondary"
        style={{ background: accent }}
        aria-hidden
      >
        <Quote className="h-7 w-7 fill-white" />
      </span>

      {/* faint closing quote mark */}
      <Quote className="pointer-events-none absolute bottom-10 right-6 h-9 w-9 fill-muted text-muted" aria-hidden />

      {/* resting content (fixed size) */}
      <article
        tabIndex={0}
        onClick={(e) => {
          if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setOpen((o) => !o);
        }}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen((o) => !o))}
        aria-label={`${t.headline} — ${t.name}, ${t.company}`}
        className="relative z-[5] flex h-full flex-col px-7 pb-12 pt-11 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="pl-9">{Person}</div>
        <div className="mt-3">{Stars}</div>

        {/* summary headline — always visible */}
        <h3 className="mt-4 line-clamp-3 font-heading text-[18px] font-bold leading-snug tracking-tight sm:text-[19px]">{t.headline}</h3>

        {/* compact preview */}
        <p className="mt-2.5 line-clamp-4 text-[12.5px] leading-relaxed text-muted-foreground">{t.quote}</p>
        <span className="mt-auto text-lg leading-none tracking-[0.3em] text-muted-foreground/60" aria-hidden>
          ···
        </span>
      </article>

      {/* Full review — replaces the preview inside the SAME card (same size, no pop-up outside the card) */}
      <div
        aria-hidden={!open}
        className={`absolute inset-y-3 left-6 right-0 z-20 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* same tilted shape as the card, with an accent edge */}
        <div
          className={`absolute inset-0 -skew-y-[2.5deg] border bg-card shadow-[0_18px_40px_-18px_rgba(80,40,240,0.4)] ${SHAPE}`}
          style={{ borderColor: `${accent}66`, borderTop: `3px solid ${accent}` }}
        />
        {/* scrolls inside the card if the review is long */}
        <div className="rv-scroll absolute bottom-6 left-0 right-5 top-5 overflow-y-auto overscroll-contain pb-3 pl-7 pr-3 pt-4 text-left">
          <div className="flex items-center gap-3 pl-8">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
              <Image src={t.image} alt="" width={40} height={40} className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[14.5px] font-bold leading-tight">{t.name}</p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {t.designation} · {t.company}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h3 className="mt-2.5 font-heading text-[15px] font-bold leading-snug tracking-tight" style={{ color: accent }}>
            {t.headline}
          </h3>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-foreground/85">{t.quote}</p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── grid ───────────────────────── */

function useColumns() {
  // 1 = mobile (swipe row), 2 = tablet, 3 = desktop
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const mdQ = window.matchMedia("(min-width: 768px)");
    const lgQ = window.matchMedia("(min-width: 1024px)");
    const update = () => setCols(lgQ.matches ? 3 : mdQ.matches ? 2 : 1);
    update();
    mdQ.addEventListener("change", update);
    lgQ.addEventListener("change", update);
    return () => {
      mdQ.removeEventListener("change", update);
      lgQ.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

function Dots({ count, active, onSelect, label }: { count: number; active: number; onSelect: (i: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5" role="tablist" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`${label} ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-3 rounded-full border-2 transition-all duration-300 ${
            i === active ? "w-9 border-primary bg-primary" : "w-3 border-primary/45 bg-transparent hover:border-primary"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsGrid() {
  const cols = useColumns();
  const n = TESTIMONIALS.length;
  const pages = cols === 1 ? n : Math.ceil(n / cols);
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(true);
  const paused = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const [mIdx, setMIdx] = useState(0);

  useEffect(() => setPage(0), [cols]);

  const goTo = useCallback(
    (p: number) => {
      if (cols === 1) {
        const el = rowRef.current;
        const child = el?.children[((p % n) + n) % n] as HTMLElement | undefined;
        if (el && child) el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
        return;
      }
      setVisible(false);
      setTimeout(() => {
        setPage(((p % pages) + pages) % pages);
        setVisible(true);
      }, 300);
    },
    [pages, cols, n]
  );

  // Slow rotation (desktop / tablet) — pauses while anyone is reading; off for reduced-motion users
  useEffect(() => {
    if (cols === 1 || pages < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) goTo(page + 1);
    }, REVIEW_DELAY);
    return () => clearInterval(id);
  }, [page, pages, cols, goTo]);

  const onRowScroll = () => {
    const el = rowRef.current;
    if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement;
    setMIdx(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / (first.offsetWidth + 8)))));
  };

  const shown = Array.from({ length: cols === 1 ? n : cols }, (_, k) => {
    const i = cols === 1 ? k : (page * cols + k) % n;
    return { t: TESTIMONIALS[i], i };
  });

  return (
    <div
      className="relative w-full rounded-[36px] bg-gradient-to-br from-secondary via-secondary/70 to-accent/40 px-3 pb-12 pt-10 sm:px-6 sm:pb-16 lg:px-16"
      onPointerEnter={(e) => e.pointerType === "mouse" && (paused.current = true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
    >
      {cols === 1 ? (
        /* Mobile — native swipe row, identical card size */
        <div
          ref={rowRef}
          onScroll={onRowScroll}
          className="-mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shown.map(({ t, i }) => (
            <div key={t.name} className="w-[88%] shrink-0 snap-center">
              <ReviewCard t={t} accent={ACCENTS[i % ACCENTS.length]} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-6 transition-opacity duration-300 lg:gap-8 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"} ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {shown.map(({ t, i }, k) => (
            <ReviewCard
              key={`${page}-${t.name}`}
              t={t}
              accent={ACCENTS[i % ACCENTS.length]}
              align={k === 0 ? "left" : k === cols - 1 ? "right" : "center"}
            />
          ))}
        </div>
      )}

      {/* side arrows (left / right of the panel) */}
      {cols > 1 && pages > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            aria-label="Previous reviews"
            className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-primary shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            aria-label="Next reviews"
            className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-primary shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* dots — bottom of the panel */}
      {pages > 1 && (
        <div className="absolute inset-x-0 bottom-6">
          <Dots
            count={pages}
            active={cols === 1 ? mIdx : page}
            onSelect={goTo}
            label={cols === 1 ? "Review" : "Reviews page"}
          />
        </div>
      )}
    </div>
  );
}

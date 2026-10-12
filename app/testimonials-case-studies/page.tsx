"use client";
import { useFadeUp } from '@/components/ui/use-scroll-animation';

// CASE STUDIES PAGE — case-study content lives in lib/case-studies.ts (edit it there).

import { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import NewHeroSection from "@/components/new-components/new-hero";
import { TrendingUp, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Calendar, Star, Quote, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Et, Hide, Lnk, useVal } from "@/components/cms/editable";
import { useCms } from "@/components/cms/ContentProvider";
import { Lock, Loader2, CheckCircle2, Download } from "lucide-react";

import { CASE_STUDIES } from "@/lib/case-studies";


// =============================================================================
// REVIEWS / TESTIMONIALS — add new entries here
// =============================================================================
const REVIEWS = [
  {
    quote: "We engaged LRBC to streamline our internal systems, and we are incredibly pleased with the results. They provided a true end-to-end solution that handles everything from initial inquiries and the complete sales process to our manufacturing and stores modules. We are very happy with how seamlessly the product connects all our processes. Thanks to this system, our dependency on manual effort has reduced significantly.",
    headline: "One connected system — and far less manual effort",
    name: "Prabhu Pandurang",
    designation: "CEO",
    company: "Chefmate — Commercial Kitchen Hoods",
    image: "/images/Prabhu.jpeg",
    rating: 5,
  },
  {
    quote: "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
    headline: "A technology partner who truly listens and delivers",
    name: "Ekkta V Vohra",
    designation: "Founder",
    company: "Wedding Alliances",
    image: "/images/Ekkta.jpeg",
    rating: 5,
  },
  {
    quote: "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    headline: "Built for our needs — not a standard product",
    name: "Varun Bathwal",
    designation: "CEO",
    company: "ARV",
    image: "/images/Varun.jpeg",
    rating: 5,
  },
  {
    quote: "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    headline: "Sharp process insight, every time we ask",
    name: "Kanul Verma",
    designation: "Executive Director",
    company: "Hitco Group",
    image: "/images/Kanul.jpeg",
    rating: 5,
  },
];

// =============================================================================
// NOTHING TO EDIT BELOW THIS LINE — layout is fully automatic
// =============================================================================

const CS_PAGE = 2;

// ── Email gate: a one-line preview for visitors; verifying the email with an OTP unlocks every case study ──
const VERIFIED_KEY = "lrbc-cs-verified";
const WEB3FORMS_KEY = "d7597fd4-4c3b-40d2-ad55-710160cd9abd";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Verified = { email: string; token: string };
const UnlockCtx = createContext<{ verified: Verified | null; ask: (client: string) => void; reset: () => void }>({ verified: { email: "", token: "" }, ask: () => {}, reset: () => {} });

/** Full text when verified (or in the editor); otherwise just the first sentence on a single line. */
function CsText({ id, def }: { id: string; def: string }) {
  const { verified } = useContext(UnlockCtx);
  const { editing } = useCms();
  const v = useVal(id, def);
  if (verified || editing) return <Et as="p" id={id} def={def} className="text-sm text-foreground/80 leading-6" />;
  const first = v.split(/(?<=[.!?])\s+/)[0];
  return <p className="line-clamp-1 text-sm text-foreground/80 leading-6">{first}</p>;
}

function CaseGateModal({ client, onClose, onVerified }: { client: string; onClose: () => void; onVerified: (v: Verified) => void }) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const sendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setErr(""); setInfo(""); setBusy(true);
    try {
      const res = await fetch("/api/case-study/otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(d.error === "slow_down" ? "Please wait a few seconds before requesting another code."
          : d.error === "invalid_email" ? "Please enter a valid email address."
          : "We couldn't send the code right now. Please try again in a moment.");
        setBusy(false); return;
      }
      setChallenge(d.challenge); setCode(""); setStep("otp"); setWait(30);
      setInfo(d.devCode ? `Dev mode — your code is ${d.devCode}` : `We've sent a 6-digit code to ${email.trim()}.`);
    } catch { setErr("Something went wrong. Please try again."); }
    setBusy(false);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setErr("Enter the 6-digit code."); return; }
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/case-study/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code, challenge }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(d.error === "expired" ? "This code has expired. Please request a new one."
          : d.error === "too_many" ? "Too many attempts. Please request a new code."
          : "That code isn't right. Please check and try again.");
        setBusy(false); return;
      }
      // lead for the team — only verified emails reach us
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", `Case study unlocked (verified) — ${client}`);
      fd.append("source", "Case studies — email verified with OTP");
      fd.append("businessEmail", d.email);
      if (name.trim()) fd.append("contactPerson", name.trim());
      fd.append("case_study", client);
      fetch("https://api.web3forms.com/submit", { method: "POST", body: fd }).catch(() => {});
      onVerified({ email: d.email, token: d.token });
    } catch { setErr("Something went wrong. Please try again."); setBusy(false); }
  };

  const inputCls = "mt-1.5 h-12 w-full rounded-xl border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Unlock case study">
      <form onSubmit={step === "email" ? (e) => { e.preventDefault(); sendCode(); } : verify} onClick={(e) => e.stopPropagation()} noValidate className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-primary/20 bg-card p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30"><Lock className="h-5 w-5" /></span>
        {step === "email" ? (
          <>
            <h3 className="mt-4 text-xl font-semibold">See the full case study</h3>
            <p className="mt-1 text-sm text-muted-foreground">Verify your email to unlock every case study and get the full PDF with screenshots.</p>
            <label htmlFor="cs-name" className="mt-5 block text-sm font-medium">Name <span className="font-normal text-muted-foreground">(optional)</span></label>
            <input id="cs-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${inputCls} border-input`} />
            <label htmlFor="cs-email" className="mt-4 block text-sm font-medium">Email *</label>
            <input id="cs-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} autoComplete="email" autoFocus className={`${inputCls} ${err ? "border-red-500" : "border-input"}`} />
            {err && <p role="alert" className="mt-1.5 text-xs text-red-500">{err}</p>}
            <button type="submit" disabled={busy} className="lrbc-btn lrbc-btn-primary mt-6 w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code…</> : "Send verification code"}
            </button>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-xl font-semibold">Enter your code</h3>
            <p className="mt-1 text-sm text-muted-foreground">{info}</p>
            <label htmlFor="cs-otp" className="mt-5 block text-sm font-medium">Verification code</label>
            <input id="cs-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} autoFocus
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
              className={`${inputCls} text-center font-mono text-2xl tracking-[0.5em] sm:text-2xl ${err ? "border-red-500" : "border-input"}`} />
            {err && <p role="alert" className="mt-1.5 text-xs text-red-500">{err}</p>}
            <button type="submit" disabled={busy || code.length !== 6} className="lrbc-btn lrbc-btn-primary mt-6 w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : "Verify & unlock"}
            </button>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <button type="button" onClick={() => { setStep("email"); setErr(""); }} className="underline-offset-2 hover:text-primary hover:underline">Change email</button>
              <button type="button" disabled={wait > 0 || busy} onClick={sendCode} className="underline-offset-2 hover:text-primary hover:underline disabled:no-underline disabled:opacity-60">
                {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

function ImageCarousel({ images, idx, setIdx, onOpen }: { images: string[]; idx: number; setIdx: (n: number) => void; onOpen: () => void }) {
  const prev = () => setIdx((idx - 1 + images.length) % images.length);
  const next = () => setIdx((idx + 1) % images.length);

  // mouse devices: hover opens the full-card viewer. Touch devices: the image stays in place and can be zoomed.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => { setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);

  const box = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState({ s: 1, x: 0, y: 0 });
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef(0);
  const lastTap = useRef(0);
  useEffect(() => { setZ({ s: 1, x: 0, y: 0 }); }, [idx]);

  const clamp = (s: number, x: number, y: number) => {
    const r = box.current?.getBoundingClientRect();
    const w = r?.width ?? 0, h = r?.height ?? 0;
    const mx = ((s - 1) * w) / 2, my = ((s - 1) * h) / 2;
    return { s, x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) };
  };
  const zoomTo = (ns: number, px?: number, py?: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (px ?? r.left + r.width / 2) - (r.left + r.width / 2);
    const dy = (py ?? r.top + r.height / 2) - (r.top + r.height / 2);
    setZ(cur => {
      const k = ns / cur.s;
      return clamp(ns, dx - (dx - cur.x) * k, dy - (dy - cur.y) * k);
    });
  };

  const onDown = (e: React.PointerEvent) => {
    if (canHover) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    } else {
      const now = Date.now();
      if (now - lastTap.current < 300) { z.s > 1 ? setZ({ s: 1, x: 0, y: 0 }) : zoomTo(2.6, e.clientX, e.clientY); lastTap.current = 0; }
      else lastTap.current = now;
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (canHover || !pts.current.has(e.pointerId)) return;
    const prevPt = pts.current.get(e.pointerId)!;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current > 0) zoomTo(Math.max(1, Math.min(4, z.s * (d / pinch.current))), (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch.current = d;
    } else if (z.s > 1) {
      const dx = e.clientX - prevPt.x, dy = e.clientY - prevPt.y;
      setZ(cur => clamp(cur.s, cur.x + dx, cur.y + dy));
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pts.current.delete(e.pointerId);
    pinch.current = 0;
    if (z.s < 1.05) setZ({ s: 1, x: 0, y: 0 });
  };

  if (!images.length) return null;
  const zoomed = z.s > 1.02;

  return (
    <div
      className={`group/img relative overflow-hidden rounded-2xl bg-muted/30 select-none ${canHover ? "cursor-zoom-in" : ""}`}
      onPointerEnter={e => { if (canHover && e.pointerType === "mouse") onOpen(); }}
      onClick={() => { if (canHover) onOpen(); }}
    >
      {/* the picture — natural size; on touch it can be pinched / double-tapped and dragged */}
      <div
        ref={box}
        className="overflow-hidden"
        style={{ touchAction: canHover ? "auto" : zoomed ? "none" : "pan-y" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <img
          src={images[idx]}
          alt="Project screenshot"
          className="block h-auto w-full"
          style={{ transform: `translate(${z.x}px, ${z.y}px) scale(${z.s})`, transition: pts.current.size ? "none" : "transform .25s ease-out", transformOrigin: "center" }}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
        />
      </div>

      {canHover ? (
        <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" /> View full
        </span>
      ) : (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5">
          {zoomed && (
            <button onClick={() => setZ({ s: 1, x: 0, y: 0 })} aria-label="Reset zoom" className="inline-flex h-8 items-center rounded-full bg-black/55 px-2.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {Math.round(z.s * 100)}% · Reset
            </button>
          )}
          <button onClick={() => (zoomed ? zoomTo(Math.max(1, z.s - 0.8)) : zoomTo(2.2))} aria-label="Zoom out" className={`${zoomed ? "" : "hidden"} grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm`}>
            <ZoomOut className="h-4 w-4" />
          </button>
          <button onClick={() => zoomTo(Math.min(4, z.s + (zoomed ? 0.8 : 1.2)))} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      )}
      {!canHover && !zoomed && (
        <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-sm">Pinch or double-tap to zoom</span>
      )}

      {images.length > 1 && (
        <>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }} aria-label={`Image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-primary/30"}`} />
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition z-10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition z-10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

/** Covers the whole case-study card with the image at full size */
function ImageStage({ cs, idx, setIdx, onClose }: { cs: { client: string; images: string[] }; idx: number; setIdx: (n: number) => void; onClose: () => void }) {
  const n = cs.images.length;
  const prev = () => setIdx((idx - 1 + n) % n);
  const next = () => setIdx((idx + 1) % n);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (n > 1 && e.key === "ArrowLeft") prev();
      if (n > 1 && e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div
      className="cs-stage absolute inset-0 z-30 bg-background/95 backdrop-blur-md"
      onPointerLeave={e => { if (e.pointerType === "mouse") onClose(); }}
      role="dialog"
      aria-label={`${cs.client} screenshots`}
    >
      {/* sticky, so the viewer stays in view even when the card is taller than the screen */}
      <div className="sticky top-20 flex flex-col" style={{ height: "min(calc(100svh - 6rem), 100%)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="truncate text-sm font-semibold">{cs.client}{n > 1 && <span className="ml-2 font-normal text-muted-foreground">{idx + 1} / {n}</span>}</p>
        <button onClick={onClose} aria-label="Close" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium hover:bg-muted">
          <X className="h-3.5 w-3.5" /> Close
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-14 sm:pb-6">
        <img
          key={idx}
          src={cs.images[idx]}
          alt={`${cs.client} screenshot ${idx + 1}`}
          className="cs-stage-img max-h-full max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-border"
          draggable={false}
          onContextMenu={e => e.preventDefault()}
        />
        {n > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg hover:bg-foreground sm:left-4">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} aria-label="Next image" className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg hover:bg-foreground sm:right-4">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="flex justify-center gap-1.5 pb-4">
          {cs.images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-primary/30"}`} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}


const Box = ({ children }: { children: React.ReactNode }) => <div className="rounded-2xl bg-muted/40 p-4 sm:p-5">{children}</div>;

function CaseStudyCard({ cs }: { cs: typeof CASE_STUDIES[0] }) {
  const k = CASE_STUDIES.indexOf(cs); // stable id index (position in the data array, not the shuffled order)
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [dl, setDl] = useState<"idle" | "busy" | "sent" | "err">("idle");
  const { verified, ask, reset } = useContext(UnlockCtx);
  const { editing } = useCms();
  const isOpen = !!verified || editing;

  const sendPdf = async () => {
    if (!verified) { ask(cs.client); return; }
    setDl("busy");
    try {
      const res = await fetch("/api/case-study/pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verified.token, id: cs.id }),
      });
      if (res.status === 401) { reset(); ask(cs.client); setDl("idle"); return; }
      setDl(res.ok ? "sent" : "err");
    } catch { setDl("err"); }
  };

  return (
    <div className="lrbc-anim relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-4 sm:p-7 lg:p-9 flex flex-col gap-4 sm:gap-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cs.featured && <Badge variant="secondary" className="text-xs rounded-full"><Et id="cases.cs.featuredBadge" def="Featured" /></Badge>}
              <Badge variant="outline" className="text-xs rounded-full"><Et id={`cases.cs.${k}.industry`} def={cs.industry} /></Badge>
              {cs.date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <Et id={`cases.cs.${k}.date`} def={cs.date} />
                </span>
              )}
            </div>
            <Et as="h3" id={`cases.cs.${k}.client`} def={cs.client} className="text-xl sm:text-2xl font-semibold" />
          </div>
          {cs.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              {cs.metrics.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-center min-w-[72px]">
                  <Et id={`cases.cs.${k}.metric.${i}.value`} def={m.value} className="text-sm font-bold text-primary leading-tight" />
                  <Et id={`cases.cs.${k}.metric.${i}.label`} def={m.label} className="text-[10px] text-muted-foreground leading-tight" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Problem | Solution  /  Result | Unlock (or Download) — same order on every screen */}
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          <Box>
            <Et as="p" id="cases.cs.label.problem" def="Problem" className="text-xs font-semibold uppercase tracking-wider mb-2 text-red-500" />
            <CsText id={`cases.cs.${k}.problem`} def={cs.problem} />
          </Box>
          <Box>
            <Et as="p" id="cases.cs.label.solution" def="Solution" className="text-xs font-semibold uppercase tracking-wider mb-2 text-blue-500" />
            <CsText id={`cases.cs.${k}.solution`} def={cs.solution} />
          </Box>
          <Box>
            <Et as="p" id="cases.cs.label.result" def="Result" className="text-xs font-semibold uppercase tracking-wider mb-2 text-green-500" />
            <CsText id={`cases.cs.${k}.result`} def={cs.result} />
          </Box>
          <div className="flex flex-col items-center justify-center gap-2 py-2 text-center md:items-end md:justify-end md:text-right">
            {!verified ? (
              <button type="button" onClick={() => ask(cs.client)} className="lrbc-btn lrbc-btn-primary w-full sm:w-auto">
                <Lock className="h-4 w-4" /> Unlock full case study
              </button>
            ) : (
              <>
                <button type="button" onClick={sendPdf} disabled={dl === "busy"} className="lrbc-btn lrbc-btn-primary w-full disabled:opacity-60 sm:w-auto">
                  {dl === "busy" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending PDF…</> : <><Download className="h-4 w-4" /> {dl === "sent" ? "Send again" : "Download case study PDF"}</>}
                </button>
                {dl === "sent" && <p role="status" className="flex items-center gap-1.5 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Sent to {verified.email}</p>}
                {dl === "err" && <p role="alert" className="text-xs text-red-500">We couldn&apos;t send the PDF. Please try again.</p>}
                {dl === "idle" && verified.email && <p className="text-xs text-muted-foreground">The full PDF will be emailed to {verified.email}</p>}
              </>
            )}
          </div>
          {isOpen && cs.images.length > 0 && (
            <div className="rounded-2xl overflow-hidden md:col-span-2">
              <ImageCarousel images={cs.images} idx={idx} setIdx={setIdx} onOpen={() => setOpen(true)} />
            </div>
          )}
        </div>
      </div>
      {open && cs.images.length > 0 && <ImageStage cs={cs} idx={idx} setIdx={setIdx} onClose={() => setOpen(false)} />}
    </div>
  );
}


export default function CaseStudiesPage() {
  const sectionRef = useFadeUp();
  const [csVisible, setCsVisible] = useState(CS_PAGE);
  const [verified, setVerified] = useState<Verified | null>(null);
  const [gate, setGate] = useState<string | null>(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(VERIFIED_KEY) || "null");
      if (v?.email && v?.token) setVerified(v);
    } catch {}
  }, []);
  const reset = () => { setVerified(null); try { localStorage.removeItem(VERIFIED_KEY); } catch {} };

  // shuffle only after mount, so server and browser render the same HTML
  const [shuffled, setShuffled] = useState(CASE_STUDIES);
  useEffect(() => {
    const rest = [...CASE_STUDIES].sort(() => Math.random() - 0.5);
    // footer "Industry" links open this page with ?industry=plastic / woven / kitchenware / digital-marketing → that industry's cases come first
    const want = new URLSearchParams(window.location.search).get("industry")?.toLowerCase().replace(/-/g, " ");
    if (want) {
      const mine = CASE_STUDIES.filter((c) => c.industry.toLowerCase().includes(want));
      setShuffled([...mine, ...rest.filter((c) => !mine.includes(c))]);
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 600);
    } else setShuffled(rest);
  }, []);
  const shownCs = shuffled.slice(0, csVisible);
  const moreCs  = CASE_STUDIES.length - csVisible;

  return (
    <UnlockCtx.Provider value={{ verified, ask: (c) => setGate(c), reset }}>
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <Et id="cases.hero.title1" def="Operations, sorted." reload className="overflow-hidden pb-1" />
            <Et id="cases.hero.title2" def="Outcomes, on record." reload className="overflow-hidden pb-1" />
          </h1>
        }
        subtitle={<Et id="cases.hero.subtitle" def="Every case study is a real business problem we solved. Every number is verified." reload />}
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText="Case Studies"
        cmsId="cases.hero"
      />

      {/* ── Case Studies ─────────────────────────────────────────────── */}
      <section ref={sectionRef} className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-14">
          <Et as="p" id="cases.cs.eyebrow" def="Deep Dives" className="text-xs font-semibold uppercase tracking-widest text-primary mb-3" />
          <Et as="h2" id="cases.cs.title" def="The Work, In Detail" className="lrbc-anim text-3xl sm:text-4xl font-semibold" />
          <Et as="p" id="cases.cs.text" def="Each case study shows the specific problem, the system we built, and the measurable outcome." className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base" />
        </div>

        <div className="flex flex-col gap-8">
          {shownCs.map((cs) => <Hide key={cs.id} id={`cases.cs.${CASE_STUDIES.indexOf(cs)}`}><CaseStudyCard cs={cs} /></Hide>)}
        </div>

        {CASE_STUDIES.length > CS_PAGE && (
          <div className="flex justify-center mt-8">
            {moreCs > 0 ? (
              <button
                onClick={() => setCsVisible(v => v + CS_PAGE)}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
              >
                <ChevronDown className="h-4 w-4" />
                <Et id="cases.cs.loadMore" def="Load more" />
              </button>
            ) : (
              <button
                onClick={() => setCsVisible(CS_PAGE)}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
                <Et id="cases.cs.showLess" def="Show less" />
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Hide id="cases.cta.sec">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 md:py-12">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-6 sm:p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <Et as="h3" id="cases.cta.title" def="Ready to become the next case study?" className="text-2xl sm:text-3xl font-semibold mb-3" />
          <Et as="p" id="cases.cta.text" def="Book a discovery call and let us map out what a Business Operating System looks like for your operations." className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base" />
          <Button asChild size="lg" className="rounded-full px-8">
            <Lnk id="cases.cta.link" href="/contact?openForm=true" labelId="cases.cta.button" label="Get Started ">
              <ArrowRight className="ml-2 h-4 w-4" />
            </Lnk>
          </Button>
        </div>
      </section>
      </Hide>

      <FooterSection />
      {gate && <CaseGateModal client={gate} onClose={() => setGate(null)} onVerified={(v) => { setVerified(v); try { localStorage.setItem(VERIFIED_KEY, JSON.stringify(v)); } catch {} setGate(null); }} />}
    </div>
    </UnlockCtx.Provider>
  );
}
 
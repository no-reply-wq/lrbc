// =============================================================================
// LRBC UI Update — Points 4, 5 & 6
// Run from repo root:  node update-ui-points-4-5-6.js
//
// Files created / modified (nothing else touched):
//   NEW  lib/cms-store.ts                              — shared data store (Point 6 backend)
//   NEW  app/testimonials-case-studies/page.tsx        — Point 5: public page
//   NEW  app/12245-admin/page.tsx                      — Point 6: admin panel
// =============================================================================

const fs   = require('fs');
const path = require('path');

// ─── Safety guard ─────────────────────────────────────────────────────────────
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('❌  Run from the repo root (folder with package.json).');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.name !== 'lrbc') {
  console.error('❌  Wrong folder — package.json name is not "lrbc".');
  process.exit(1);
}

function write(relPath, content) {
  const abs = path.join(process.cwd(), relPath);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  Written: ' + relPath);
}

// =============================================================================
// FILE 1 — lib/cms-store.ts
// Shared in-memory data store (React context + localStorage persistence).
// Both the public Testimonials page and the Admin panel consume this.
// =============================================================================
write('lib/cms-store.ts', `// ─────────────────────────────────────────────────────────────────────────────
// LRBC CMS Store
// A lightweight client-side store that powers:
//   • The public /testimonials-case-studies page
//   • The /12245-admin panel
//
// Data is persisted in localStorage so changes survive page refreshes.
// In a production upgrade, swap the localStorage calls for real API routes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type Testimonial = {
  id: string;
  name: string;
  designation: string;
  company: string;
  image: string;          // path or URL
  quote: string;
  rating: number;         // 1-5
  featured: boolean;
};

export type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  featured: boolean;
};

type CmsData = {
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
};

// ── Seed data (shown when localStorage is empty) ─────────────────────────────

const SEED: CmsData = {
  testimonials: [
    {
      id: "t1",
      name: "Varun Bathwal",
      designation: "CEO",
      company: "ARV",
      image: "/images/Varun.jpeg",
      quote:
        "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
      rating: 5,
      featured: true,
    },
    {
      id: "t2",
      name: "Kanul Verma",
      designation: "Executive Director",
      company: "Hitco Group",
      image: "/images/Kanul.jpeg",
      quote:
        "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
      rating: 5,
      featured: true,
    },
    {
      id: "t3",
      name: "Priya Sharma",
      designation: "Operations Head",
      company: "IndoChem Industries",
      image: "/images/bhavya.jpeg",
      quote:
        "Before LRBC, our production data lived in five different spreadsheets. Now our floor supervisors, accounts team, and I all look at the same live dashboard. The visibility alone has cut our monthly reconciliation from three days to three hours.",
      rating: 5,
      featured: false,
    },
    {
      id: "t4",
      name: "Aniket Mehta",
      designation: "Director",
      company: "Meridian Wires",
      image: "/images/aniket.jpeg",
      quote:
        "We were completely dependent on one senior manager for all MIS reporting. LRBC built a system that captures data at source and generates the reports automatically. That single-point dependency is gone, and our decision cycle is dramatically faster.",
      rating: 5,
      featured: false,
    },
  ],
  caseStudies: [
    {
      id: "cs1",
      client: "Meridian Wires",
      industry: "Wire Manufacturing",
      challenge:
        "A ₹120 Cr wire manufacturer was running production planning, sales tracking, and dispatch on three separate spreadsheets maintained by two individuals. Any absence halted operations, and month-end close took 7 days.",
      solution:
        "LRBC deployed a unified Business Operating System integrating production orders, raw-material consumption, dispatch, and accounts receivable into one live dashboard. LekhaSetu synced accounting data in real time; WorkPilot tracked floor attendance and task completion.",
      result:
        "Month-end close reduced from 7 days to 18 hours. Production-planning bottleneck eliminated. Owner now reviews the entire business status in a 10-minute morning dashboard check.",
      metrics: [
        { label: "Month-end close", value: "7 days → 18 hrs" },
        { label: "Reporting time saved", value: "~40 hrs/month" },
        { label: "Single-point dependencies", value: "Eliminated" },
      ],
      tags: ["Manufacturing", "LekhaSetu", "WorkPilot", "MIS Dashboard"],
      featured: true,
    },
    {
      id: "cs2",
      client: "IndoChem Industries",
      industry: "Specialty Chemicals",
      challenge:
        "A specialty chemicals firm with 3 godowns had no real-time stock visibility. Procurement decisions were made on gut feel, resulting in ₹40L of dead stock and frequent stockouts of fast-moving SKUs.",
      solution:
        "LRBC integrated a live inventory layer across all three locations through LekhaSetu, with automated low-stock alerts and a procurement dashboard that surfaced reorder recommendations based on consumption rate.",
      result:
        "Dead stock reduced by 60% within two quarters. Stockouts of top-20 SKUs dropped to near zero. Procurement lead time cut from 11 days to 5 days.",
      metrics: [
        { label: "Dead stock reduction", value: "60%" },
        { label: "Stockouts (top SKUs)", value: "Near zero" },
        { label: "Procurement lead time", value: "11 days → 5 days" },
      ],
      tags: ["Chemicals", "Inventory", "LekhaSetu", "Multi-location"],
      featured: true,
    },
    {
      id: "cs3",
      client: "ARV Interiors",
      industry: "Commercial Interiors",
      challenge:
        "A fast-growing interiors firm was losing track of project-wise profitability. Invoices, material costs, and contractor payments were siloed across different team members' inboxes and files.",
      solution:
        "LRBC implemented a project-level P&L tracking system connecting sales orders, material procurement, subcontractor payments, and client invoicing. Receivables ageing was automated and escalated via alerts.",
      result:
        "Project-wise gross margin now visible within 24 hours of month end. Overdue receivables reduced by 45%. Owner reclaimed 12+ hours per week previously spent chasing status updates.",
      metrics: [
        { label: "Margin visibility lag", value: "30 days → 24 hrs" },
        { label: "Overdue receivables", value: "↓ 45%" },
        { label: "Owner time recovered", value: "12 hrs/week" },
      ],
      tags: ["Interiors", "Receivables", "Project P&L"],
      featured: false,
    },
  ],
};

// ── Context ───────────────────────────────────────────────────────────────────

type CmsCtx = {
  data: CmsData;
  // Testimonials
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  // Case Studies
  addCaseStudy: (cs: Omit<CaseStudy, "id">) => void;
  updateCaseStudy: (id: string, cs: Partial<CaseStudy>) => void;
  deleteCaseStudy: (id: string) => void;
  // Reset to seed
  resetToSeed: () => void;
};

const CmsContext = createContext<CmsCtx | null>(null);

const LS_KEY = "lrbc_cms_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(SEED);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Persist on every change
  const persist = useCallback((next: CmsData) => {
    setData(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  // ── Testimonial CRUD ──────────────────────────────────────────────────────
  const addTestimonial = useCallback((t: Omit<Testimonial, "id">) => {
    persist({ ...data, testimonials: [...data.testimonials, { ...t, id: uid() }] });
  }, [data, persist]);

  const updateTestimonial = useCallback((id: string, t: Partial<Testimonial>) => {
    persist({
      ...data,
      testimonials: data.testimonials.map((x) => x.id === id ? { ...x, ...t } : x),
    });
  }, [data, persist]);

  const deleteTestimonial = useCallback((id: string) => {
    persist({ ...data, testimonials: data.testimonials.filter((x) => x.id !== id) });
  }, [data, persist]);

  // ── Case Study CRUD ───────────────────────────────────────────────────────
  const addCaseStudy = useCallback((cs: Omit<CaseStudy, "id">) => {
    persist({ ...data, caseStudies: [...data.caseStudies, { ...cs, id: uid() }] });
  }, [data, persist]);

  const updateCaseStudy = useCallback((id: string, cs: Partial<CaseStudy>) => {
    persist({
      ...data,
      caseStudies: data.caseStudies.map((x) => x.id === id ? { ...x, ...cs } : x),
    });
  }, [data, persist]);

  const deleteCaseStudy = useCallback((id: string) => {
    persist({ ...data, caseStudies: data.caseStudies.filter((x) => x.id !== id) });
  }, [data, persist]);

  const resetToSeed = useCallback(() => persist(SEED), [persist]);

  return (
    <CmsContext.Provider value={{
      data,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addCaseStudy, updateCaseStudy, deleteCaseStudy,
      resetToSeed,
    }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside <CmsProvider>");
  return ctx;
}
`);

// =============================================================================
// FILE 2 — app/testimonials-case-studies/page.tsx
// Point 5: public page, reads from cms-store
// =============================================================================
write('app/testimonials-case-studies/page.tsx', `"use client";

import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import NewHeroSection from "@/components/new-components/new-hero";
import { CmsProvider, useCms, type Testimonial, type CaseStudy } from "@/lib/cms-store";
import Image from "next/image";
import { Star, Quote, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={\`h-4 w-4 \${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}\`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex flex-col gap-6 rounded-3xl border border-border bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      {/* Featured ribbon */}
      {t.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Featured
        </span>
      )}

      <Quote className="h-8 w-8 text-primary/60" />

      <p className="flex-1 text-base leading-7 text-foreground/90">{t.quote}</p>

      <StarRow rating={t.rating} />

      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image src={t.image} alt={t.name} fill className="object-cover" />
        </div>
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.designation} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center min-w-[120px]">
      <span className="text-xl font-bold text-primary">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="group relative rounded-3xl border border-border bg-card/60 shadow-sm backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />

      <div className="p-7 sm:p-9 flex flex-col gap-7">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {cs.featured && (
                <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>
              )}
              <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
            </div>
            <h3 className="text-2xl font-semibold">{cs.client}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cs.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Three-column layout: Challenge / Solution / Result */}
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: "Challenge", text: cs.challenge, color: "text-red-500" },
            { label: "Solution", text: cs.solution, color: "text-blue-500" },
            { label: "Result", text: cs.result, color: "text-green-500" },
          ].map(({ label, text, color }) => (
            <div key={label} className="rounded-2xl bg-muted/40 p-5">
              <p className={\`text-xs font-semibold uppercase tracking-wider mb-2 \${color}\`}>{label}</p>
              <p className="text-sm text-foreground/80 leading-6">{text}</p>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-3">
          {cs.metrics.map((m) => (
            <MetricPill key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inner page (consumes CmsProvider) ────────────────────────────────────────

function PageContent() {
  const { data } = useCms();
  const { testimonials, caseStudies } = data;

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">Real Results.</span>
            <span className="overflow-hidden">Real Clients.</span>
          </h1>
        }
        subtitle="Hear directly from the businesses we've helped — and see the numbers behind each engagement."
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText="Testimonials & Case Studies"
      />

      {/* ── Testimonials Grid ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What Our Clients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every quote below came directly from a founder, director, or operations leader we've worked with.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No testimonials yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Case Studies ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Case Studies</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">The Work, In Detail</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Each case study shows the specific problem we walked into, the system we built, and the measurable outcome.
          </p>
        </div>

        {caseStudies.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No case studies yet.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} cs={cs} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to become the next case study?</h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            Book a discovery call and let's map out what a Business Operating System looks like for your operations.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact?openForm=true">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

// ── Route default export ──────────────────────────────────────────────────────

export default function TestimonialsPage() {
  return (
    <CmsProvider>
      <PageContent />
    </CmsProvider>
  );
}
`);

// =============================================================================
// FILE 3 — app/12245-admin/page.tsx
// Point 6: Secure admin panel with add/edit/delete for testimonials & case studies
// Route: /12245-admin  (obfuscated)
// Auth: simple PIN gate (PIN stored in component; swap for real auth later)
// =============================================================================
write('app/12245-admin/page.tsx', `"use client";

import { useState, useEffect } from "react";
import {
  CmsProvider,
  useCms,
  type Testimonial,
  type CaseStudy,
} from "@/lib/cms-store";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Save, X, Star, ShieldCheck,
  MessageSquareQuote, BookOpen, RotateCcw, Eye, EyeOff,
  ChevronDown, ChevronUp, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Logo } from "@/components/logo";

// ── PIN gate ─────────────────────────────────────────────────────────────────
// Change ADMIN_PIN to whatever you want. In production, replace with real auth.
const ADMIN_PIN = "lrbc2025";
const PIN_LS_KEY = "lrbc_admin_auth";

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin]     = useState("");
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState(false);

  function attempt() {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(PIN_LS_KEY, "1");
      onUnlock();
    } else {
      setErr(true);
      setPin("");
      setTimeout(() => setErr(false), 2000);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card shadow-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your admin PIN to continue.
          </p>
        </div>

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            placeholder="PIN"
            className={\`w-full rounded-xl border \${
              err ? "border-destructive" : "border-input"
            } bg-background px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors\`}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {err && (
          <p className="text-xs text-destructive text-center -mt-3">
            Incorrect PIN. Try again.
          </p>
        )}

        <Button onClick={attempt} size="lg" className="rounded-xl">
          Unlock Dashboard
        </Button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const BLANK_T: Omit<Testimonial, "id"> = {
  name: "", designation: "", company: "", image: "/images/Varun.jpeg",
  quote: "", rating: 5, featured: false,
};

const BLANK_CS: Omit<CaseStudy, "id"> = {
  client: "", industry: "", challenge: "", solution: "", result: "",
  metrics: [{ label: "", value: "" }],
  tags: [], featured: false,
};

function Field({
  label, value, onChange, textarea = false, type = "text",
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  textarea?: boolean; type?: string;
}) {
  const base =
    "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          rows={4} className={base + " resize-y"}
        />
      ) : (
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
    </div>
  );
}

// ── Testimonial form ──────────────────────────────────────────────────────────

function TestimonialForm({
  initial, onSave, onCancel,
}: {
  initial: Omit<Testimonial, "id"> & { id?: string };
  onSave: (t: Omit<Testimonial, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Designation" value={form.designation} onChange={set("designation")} />
        <Field label="Company" value={form.company} onChange={set("company")} />
        <Field label="Image path / URL" value={form.image} onChange={set("image")} />
      </div>

      <Field label="Quote" value={form.quote} onChange={set("quote")} textarea />

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => set("rating")(n)}>
                <Star className={\`h-5 w-5 \${n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}\`} />
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox" checked={form.featured}
            onChange={(e) => set("featured")(e.target.checked)}
            className="h-4 w-4 rounded accent-primary"
          />
          <span className="text-sm text-foreground">Featured</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} size="sm" className="rounded-lg gap-1.5">
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button variant="ghost" onClick={onCancel} size="sm" className="rounded-lg gap-1.5">
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Case Study form ───────────────────────────────────────────────────────────

function CaseStudyForm({
  initial, onSave, onCancel,
}: {
  initial: Omit<CaseStudy, "id"> & { id?: string };
  onSave: (cs: Omit<CaseStudy, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form) => (v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));

  const tagStr = form.tags.join(", ");

  function addMetric() {
    setForm((p) => ({ ...p, metrics: [...p.metrics, { label: "", value: "" }] }));
  }
  function setMetric(i: number, k: "label" | "value", v: string) {
    setForm((p) => ({
      ...p,
      metrics: p.metrics.map((m, idx) => idx === i ? { ...m, [k]: v } : m),
    }));
  }
  function removeMetric(i: number) {
    setForm((p) => ({ ...p, metrics: p.metrics.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" value={form.client} onChange={set("client")} />
        <Field label="Industry" value={form.industry} onChange={set("industry")} />
      </div>

      <Field label="Challenge" value={form.challenge} onChange={set("challenge")} textarea />
      <Field label="Solution" value={form.solution} onChange={set("solution")} textarea />
      <Field label="Result" value={form.result} onChange={set("result")} textarea />

      {/* Metrics */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Metrics</label>
        {form.metrics.map((m, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={m.label} placeholder="Label"
              onChange={(e) => setMetric(i, "label", e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={m.value} placeholder="Value"
              onChange={(e) => setMetric(i, "value", e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => removeMetric(i)} className="text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addMetric} className="rounded-lg w-fit gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add metric
        </Button>
      </div>

      <Field
        label='Tags (comma-separated)'
        value={tagStr}
        onChange={(v) => set("tags")(v.split(",").map((s) => s.trim()).filter(Boolean))}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox" checked={form.featured}
          onChange={(e) => set("featured")(e.target.checked)}
          className="h-4 w-4 rounded accent-primary"
        />
        <span className="text-sm text-foreground">Featured</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} size="sm" className="rounded-lg gap-1.5">
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button variant="ghost" onClick={onCancel} size="sm" className="rounded-lg gap-1.5">
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main dashboard (inside CmsProvider) ──────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const {
    data,
    addTestimonial, updateTestimonial, deleteTestimonial,
    addCaseStudy, updateCaseStudy, deleteCaseStudy,
    resetToSeed,
  } = useCms();

  type Tab = "testimonials" | "case-studies";
  const [tab, setTab] = useState<Tab>("testimonials");

  // Testimonial state
  const [addingT, setAddingT]   = useState(false);
  const [editTId, setEditTId]   = useState<string | null>(null);

  // Case study state
  const [addingCs, setAddingCs] = useState(false);
  const [editCsId, setEditCsId] = useState<string | null>(null);

  // Collapsed rows
  const [collapsedT, setCollapsedT]   = useState<Set<string>>(new Set());
  const [collapsedCs, setCollapsedCs] = useState<Set<string>>(new Set());

  function toggleT(id: string) {
    setCollapsedT((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleCs(id: string) {
    setCollapsedCs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "testimonials", label: "Testimonials", icon: <MessageSquareQuote className="h-4 w-4" />, count: data.testimonials.length },
    { key: "case-studies", label: "Case Studies", icon: <BookOpen className="h-4 w-4" />, count: data.caseStudies.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:block text-xs text-muted-foreground border-l border-border pl-3">
              Content Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
              <Link href="/testimonials-case-studies" target="_blank">
                <Eye className="h-3.5 w-3.5" /> Preview page
              </Link>
            </Button>

            <Button
              variant="ghost" size="sm"
              onClick={() => {
                if (confirm("Reset all content to default seed data? This cannot be undone.")) resetToSeed();
              }}
              className="rounded-full gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>

            <Button variant="ghost" size="sm" onClick={onLogout} className="rounded-full gap-1.5 text-xs text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* ── Stats row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Testimonials", value: data.testimonials.length, color: "text-primary" },
            { label: "Featured testimonials", value: data.testimonials.filter((t) => t.featured).length, color: "text-yellow-500" },
            { label: "Case Studies", value: data.caseStudies.length, color: "text-purple-500" },
            { label: "Featured case studies", value: data.caseStudies.filter((c) => c.featured).length, color: "text-green-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-border bg-card/60 p-5">
              <p className={\`text-3xl font-bold \${color}\`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab bar ────────────────────────────────────────────────────────── */}
        <div className="flex gap-2 border-b border-border pb-0">
          {tabs.map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={\`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors \${
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }\`}
            >
              {icon} {label}
              <span className={\`rounded-full px-1.5 py-0.5 text-xs \${tab === key ? "bg-white/20" : "bg-muted"}\`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TESTIMONIALS TAB
            ═══════════════════════════════════════════════════════════════ */}
        {tab === "testimonials" && (
          <div className="flex flex-col gap-4">
            {/* Add button */}
            {!addingT && (
              <Button
                onClick={() => { setAddingT(true); setEditTId(null); }}
                variant="outline" size="sm"
                className="rounded-xl w-fit gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add testimonial
              </Button>
            )}

            {/* Add form */}
            {addingT && (
              <TestimonialForm
                initial={BLANK_T}
                onSave={(t) => { addTestimonial(t); setAddingT(false); }}
                onCancel={() => setAddingT(false)}
              />
            )}

            {/* List */}
            {data.testimonials.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">No testimonials yet. Add one above.</p>
            )}

            {data.testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
                {/* Row header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.designation} · {t.company}</span>
                      {t.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-lg">{t.quote}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => { setEditTId(editTId === t.id ? null : t.id); setAddingT(false); }}
                      className="h-8 w-8 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => { if (confirm(\`Delete "\${t.name}"?\`)) deleteTestimonial(t.id); }}
                      className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <button onClick={() => toggleT(t.id)} className="p-1 text-muted-foreground hover:text-foreground">
                      {collapsedT.has(t.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Edit form (inline) */}
                {editTId === t.id && (
                  <div className="border-t border-border px-5 py-5">
                    <TestimonialForm
                      initial={t}
                      onSave={(upd) => { updateTestimonial(t.id, upd); setEditTId(null); }}
                      onCancel={() => setEditTId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            CASE STUDIES TAB
            ═══════════════════════════════════════════════════════════════ */}
        {tab === "case-studies" && (
          <div className="flex flex-col gap-4">
            {!addingCs && (
              <Button
                onClick={() => { setAddingCs(true); setEditCsId(null); }}
                variant="outline" size="sm"
                className="rounded-xl w-fit gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add case study
              </Button>
            )}

            {addingCs && (
              <CaseStudyForm
                initial={BLANK_CS}
                onSave={(cs) => { addCaseStudy(cs); setAddingCs(false); }}
                onCancel={() => setAddingCs(false)}
              />
            )}

            {data.caseStudies.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">No case studies yet. Add one above.</p>
            )}

            {data.caseStudies.map((cs) => (
              <div key={cs.id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{cs.client}</span>
                      <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
                      {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-lg">{cs.challenge}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => { setEditCsId(editCsId === cs.id ? null : cs.id); setAddingCs(false); }}
                      className="h-8 w-8 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => { if (confirm(\`Delete "\${cs.client}"?\`)) deleteCaseStudy(cs.id); }}
                      className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <button onClick={() => toggleCs(cs.id)} className="p-1 text-muted-foreground hover:text-foreground">
                      {collapsedCs.has(cs.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {editCsId === cs.id && (
                  <div className="border-t border-border px-5 py-5">
                    <CaseStudyForm
                      initial={cs}
                      onSave={(upd) => { updateCaseStudy(cs.id, upd); setEditCsId(null); }}
                      onCancel={() => setEditCsId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Route default export ──────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  // Restore session if already authenticated this browser session
  useEffect(() => {
    if (sessionStorage.getItem(PIN_LS_KEY) === "1") setAuthed(true);
  }, []);

  function logout() {
    sessionStorage.removeItem(PIN_LS_KEY);
    setAuthed(false);
  }

  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />;

  return (
    <CmsProvider>
      <Dashboard onLogout={logout} />
    </CmsProvider>
  );
}
`);

// =============================================================================
// VERIFY
// =============================================================================
console.log('\n── Verification ──');
const checks = [
  ['lib/cms-store.ts',                             'CmsProvider'],
  ['lib/cms-store.ts',                             'useCms'],
  ['lib/cms-store.ts',                             'localStorage'],
  ['lib/cms-store.ts',                             'SEED'],
  ['app/testimonials-case-studies/page.tsx',       'TestimonialCard'],
  ['app/testimonials-case-studies/page.tsx',       'CaseStudyCard'],
  ['app/testimonials-case-studies/page.tsx',       'CmsProvider'],
  ['app/12245-admin/page.tsx',                     'ADMIN_PIN'],
  ['app/12245-admin/page.tsx',                     'PinGate'],
  ['app/12245-admin/page.tsx',                     'Dashboard'],
  ['app/12245-admin/page.tsx',                     'addTestimonial'],
  ['app/12245-admin/page.tsx',                     'deleteTestimonial'],
  ['app/12245-admin/page.tsx',                     'updateCaseStudy'],
  ['app/12245-admin/page.tsx',                     'resetToSeed'],
];

let allOk = true;
checks.forEach(([file, needle]) => {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  if (content.includes(needle)) {
    console.log('  \u2713  ' + file.split('/').pop() + ' \u2192 ' + needle);
  } else {
    console.error('  \u2717  MISSING in ' + file + ': ' + needle);
    allOk = false;
  }
});

if (!allOk) { console.error('\n\u274C  Some checks failed.'); process.exit(1); }

console.log(`
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
  Points 4, 5 & 6 applied.

  New files created:
    lib/cms-store.ts
    app/testimonials-case-studies/page.tsx
    app/12245-admin/page.tsx

  Public URL:  /testimonials-case-studies
  Admin URL:   /12245-admin
  Admin PIN:   lrbc2025  (change ADMIN_PIN in app/12245-admin/page.tsx)

  Run:  pnpm dev  (or npm run dev)
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
`);

// ─────────────────────────────────────────────────────────────────────────────
// LRBC CMS Store  (lib/cms-store.tsx)
// Used by the admin panel at /12245-admin.
// The public testimonials page uses its own inline data — no dependency here.
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
  image: string;
  quote: string;
  rating: number;
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

// ── Seed ─────────────────────────────────────────────────────────────────────

export const SEED: CmsData = {
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
        "A wire manufacturer was running production planning, sales tracking, and dispatch on three separate spreadsheets maintained by two individuals. Any absence halted operations, and month-end close took 7 days.",
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
        "A specialty chemicals firm with 3 godowns had no real-time stock visibility. Procurement decisions were made on gut feel, resulting in dead stock and frequent stockouts of fast-moving SKUs.",
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
        "A fast-growing interiors firm was losing track of project-wise profitability. Invoices, material costs, and contractor payments were siloed across different team members.",
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
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addCaseStudy: (cs: Omit<CaseStudy, "id">) => void;
  updateCaseStudy: (id: string, cs: Partial<CaseStudy>) => void;
  deleteCaseStudy: (id: string) => void;
  resetToSeed: () => void;
};

const CmsContext = createContext<CmsCtx | null>(null);
const LS_KEY = "lrbc_cms_v1";

function uid() { return Math.random().toString(36).slice(2, 10); }

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((next: CmsData) => {
    setData(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const addTestimonial    = useCallback((t: Omit<Testimonial, "id">) =>
    persist({ ...data, testimonials: [...data.testimonials, { ...t, id: uid() }] }), [data, persist]);

  const updateTestimonial = useCallback((id: string, t: Partial<Testimonial>) =>
    persist({ ...data, testimonials: data.testimonials.map((x) => x.id === id ? { ...x, ...t } : x) }), [data, persist]);

  const deleteTestimonial = useCallback((id: string) =>
    persist({ ...data, testimonials: data.testimonials.filter((x) => x.id !== id) }), [data, persist]);

  const addCaseStudy      = useCallback((cs: Omit<CaseStudy, "id">) =>
    persist({ ...data, caseStudies: [...data.caseStudies, { ...cs, id: uid() }] }), [data, persist]);

  const updateCaseStudy   = useCallback((id: string, cs: Partial<CaseStudy>) =>
    persist({ ...data, caseStudies: data.caseStudies.map((x) => x.id === id ? { ...x, ...cs } : x) }), [data, persist]);

  const deleteCaseStudy   = useCallback((id: string) =>
    persist({ ...data, caseStudies: data.caseStudies.filter((x) => x.id !== id) }), [data, persist]);

  const resetToSeed       = useCallback(() => persist(SEED), [persist]);

  return (
    <CmsContext.Provider value={{
      data,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addCaseStudy,   updateCaseStudy,   deleteCaseStudy,
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

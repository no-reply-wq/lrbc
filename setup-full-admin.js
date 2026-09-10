// =============================================================================
// LRBC — Full Admin Panel + Testimonials Page Overhaul
// Run: node setup-full-admin.js
//
// What this writes:
//   lib/models/SiteContent.ts          — stores all editable page sections
//   lib/models/CaseStudy.ts            — adds demo seed data
//   app/api/site-content/route.ts      — GET/POST site content
//   app/api/site-content/[key]/route.ts— PUT site content section
//   lib/db.ts                          — adds getSiteContent / updateSiteContent
//   app/testimonials-case-studies/page.tsx — clean public page, no admin links
//   app/12245-admin/page.tsx           — full WordPress-style admin panel
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from repo root'); process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'lrbc') { console.error('❌  Wrong folder'); process.exit(1); }

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  ' + rel);
}

// =============================================================================
// 1. SiteContent model — stores all editable page sections in one collection
//    Each doc has: key (unique), page, section, data (flexible JSON)
// =============================================================================
write('lib/models/SiteContent.ts', `import mongoose, { Schema, type Document } from 'mongoose';

export interface ISiteContent extends Document {
  key: string;       // unique e.g. "home_hero", "about_story"
  page: string;      // "home" | "about" | "lekhasetu" | "contact" | "testimonials"
  section: string;   // human-readable e.g. "Hero Section"
  data: Record<string, unknown>;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>({
  key:     { type: String, required: true, unique: true },
  page:    { type: String, required: true },
  section: { type: String, required: true },
  data:    { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.SiteContent ??
  mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
`);

// =============================================================================
// 2. API routes for SiteContent
// =============================================================================
write('app/api/site-content/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

// Seed data — default content for every editable section
const SEED_CONTENT = [
  // ── HOME ──────────────────────────────────────────────────────────────────
  { key: 'home_hero', page: 'home', section: 'Hero Section', data: {
    badge: 'Lean Resource Business Consulting Private Limited',
    heading_line1: 'Better Tools.',
    heading_line2: 'Better Business.',
    subheading: "The right technology doesn't complicate your business. It helps it flow.",
    cta_primary: 'Contact our team',
    cta_secondary: 'Request a demo',
  }},
  { key: 'home_about', page: 'home', section: 'About ERP Section', data: {
    badge: 'About Our ERP',
    heading: 'One ERP. Every Process. Zero Bottlenecks.',
    body: 'One platform for everything your business needs. Our ERP solutions keep your operations connected, simple, and efficient.',
    sub_body: 'One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual\'s.',
  }},
  { key: 'home_features', page: 'home', section: 'Why Choose Us Section', data: {
    heading: 'Why Businesses Choose Our ERP',
    subheading: 'One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual\'s',
    features: [
      'Built around your unique workflows',
      'Easy for every team to learn and use',
      'Real-time dashboards for complete operational visibility',
      'Scales as your business grows',
    ],
  }},
  { key: 'home_products', page: 'home', section: 'Products Section', data: {
    heading: 'Products',
    lekhasetu_title: 'LekhaSetu',
    lekhasetu_desc: 'Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.',
    lekhasetu_features: ['Real-time cloud sync', 'Multi-company management', 'Inventory insights', 'Google Sheets reports'],
    workpilot_title: 'WorkPilot',
    workpilot_desc: 'WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform.',
    workpilot_features: ['Attendance', 'Task assignment', 'Activity history', 'Performance tracking'],
  }},

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  { key: 'about_hero', page: 'about', section: 'Hero Section', data: {
    badge: 'About Us',
    heading_line1: 'Building Technology',
    heading_line2: 'Around People,',
    heading_line3: 'Not Processes.',
    subheading: 'Every growing business deserves software that\'s simple, reliable, and built around the way it works.',
  }},
  { key: 'about_story', page: 'about', section: 'Our Story', data: {
    badge: 'Our Story',
    image_url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop',
    story_heading: 'Our journey began with a simple observation.',
    story_body: 'While working closely with businesses across industries, our founder saw organizations struggling with paperwork, disconnected systems, and software that was often too complicated for everyday users.',
    story_tagline: 'Rather than asking businesses to adapt to technology, we chose to build technology that adapts to them.',
  }},
  { key: 'about_team', page: 'about', section: 'Team Section', data: {
    badge: 'Team',
    heading: 'Meet the team',
    subheading: 'During the working process, we perform regular fitting with the client because he is the only person who can feel whether a new suit fits or not.',
  }},

  // ── LEKHASETU ─────────────────────────────────────────────────────────────
  { key: 'lekhasetu_hero', page: 'lekhasetu', section: 'Hero Section', data: {
    badge: 'LekhaSetu',
    heading_line1: 'Your accounting data,',
    heading_line2: 'always current.',
    subheading: 'Forget manual exports and outdated reports. LekhaSetu continuously syncs your accounting data with the cloud so every dashboard, report and insight is always current.',
    cta_primary: 'Get Started',
    cta_secondary: 'See how it works',
  }},
  { key: 'lekhasetu_features', page: 'lekhasetu', section: 'Features Section', data: {
    heading: 'Everything you need, connected.',
    features: [
      { title: 'Real-time cloud sync', desc: 'Data syncs automatically — no manual exports ever.' },
      { title: 'Multi-company management', desc: 'Manage multiple entities from one unified dashboard.' },
      { title: 'Inventory insights', desc: 'Live stock levels across all locations.' },
      { title: 'Custom reporting', desc: 'Build the reports your team actually needs.' },
    ],
  }},

  // ── CONTACT ───────────────────────────────────────────────────────────────
  { key: 'contact_hero', page: 'contact', section: 'Hero Section', data: {
    badge: 'Contact Us',
    heading: 'Your next stage of growth starts here.',
    subheading: 'Less time managing operations. More time building your business.',
  }},
  { key: 'contact_info', page: 'contact', section: 'Contact Details', data: {
    email: 'contact@lrbc.ai',
    phone: '+91-9954953008',
    office1_label: 'Head Office',
    office1_address: '7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd, Hyderabad, Telangana 500084',
    office2_label: 'Corporate Office',
    office2_address: 'Plot no, 24, Shanti Nagar, Kompally, Hyderabad, Telangana 500100',
  }},

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  { key: 'testimonials_hero', page: 'testimonials', section: 'Hero Section', data: {
    badge: 'Testimonials and Case Studies',
    heading_line1: 'Real Results.',
    heading_line2: 'Real Clients.',
    subheading: 'Hear directly from the businesses we have helped and see the numbers behind each engagement.',
  }},
  { key: 'testimonials_section', page: 'testimonials', section: 'Testimonials Section', data: {
    eyebrow: 'Client Voices',
    heading: 'What Our Clients Say',
    subheading: 'Every quote came directly from a founder, director, or operations leader we have worked with.',
  }},
  { key: 'casestudies_section', page: 'testimonials', section: 'Case Studies Section', data: {
    eyebrow: 'Deep Dives',
    heading: 'The Work, In Detail',
    subheading: 'Each case study shows the specific problem, the system we built, and the measurable outcome.',
  }},
  { key: 'testimonials_cta', page: 'testimonials', section: 'CTA Banner', data: {
    heading: 'Ready to become the next case study?',
    subheading: 'Book a discovery call and let us map out what a Business Operating System looks like for your operations.',
    button_text: 'Get Started',
    button_href: '/contact?openForm=true',
  }},
];

export async function GET() {
  try {
    await connectDB();
    // Upsert seed content if docs don't exist yet
    for (const item of SEED_CONTENT) {
      await SiteContent.updateOne({ key: item.key }, { $setOnInsert: item }, { upsert: true });
    }
    const docs = await SiteContent.find().sort({ page: 1, key: 1 }).lean();
    return NextResponse.json(docs);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const doc = await SiteContent.findOneAndUpdate(
      { key: body.key },
      body,
      { upsert: true, new: true }
    );
    return NextResponse.json(doc, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
`);

write('app/api/site-content/[key]/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    await connectDB();
    const { key } = await params;
    const doc = await SiteContent.findOne({ key }).lean();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    await connectDB();
    const { key } = await params;
    const body = await req.json();
    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { $set: { data: body.data, section: body.section } },
      { new: true, upsert: true }
    );
    return NextResponse.json(doc);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
`);

// =============================================================================
// 3. Update lib/db.ts — add SiteContent functions
// =============================================================================
write('lib/db.ts', `// lib/db.ts — runs in the BROWSER, calls /api routes
export type Testimonial = {
  _id?: string; name: string; designation: string; company: string;
  image_url: string; quote: string; rating: number;
  featured: boolean; sort_order?: number;
};
export type CaseStudy = {
  _id?: string; client: string; industry: string; challenge: string;
  solution: string; result: string;
  metrics: { label: string; value: string }[];
  tags: string[]; featured: boolean; sort_order?: number;
};
export type FAQ = {
  _id?: string; question: string; answer: string;
  icon: string; sort_order?: number;
};
export type TeamMember = {
  _id?: string; name: string; role: string; avatar_url: string;
  linkedin_url: string; object_position: string; sort_order?: number;
};
export type BlogPost = {
  _id?: string; title: string; slug: string; excerpt: string;
  content: string; cover_url: string; author_name: string;
  tags: string[]; published: boolean; published_at?: string | null;
};
export type SiteContent = {
  _id?: string; key: string; page: string; section: string;
  data: Record<string, unknown>;
};

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }, ...options,
  });
  if (!res.ok) throw new Error('API ' + res.status + ': ' + await res.text());
  return res.json();
}

export const getTestimonials   = () => api<Testimonial[]>('/api/testimonials');
export const addTestimonial    = (t: Omit<Testimonial,'_id'>) => api<Testimonial>('/api/testimonials', { method:'POST', body:JSON.stringify(t) });
export const updateTestimonial = (id: string, t: Partial<Testimonial>) => api<Testimonial>(\`/api/testimonials/\${id}\`, { method:'PUT', body:JSON.stringify(t) });
export const deleteTestimonial = (id: string) => api<{ok:boolean}>(\`/api/testimonials/\${id}\`, { method:'DELETE' });

export const getCaseStudies    = () => api<CaseStudy[]>('/api/case-studies');
export const addCaseStudy      = (cs: Omit<CaseStudy,'_id'>) => api<CaseStudy>('/api/case-studies', { method:'POST', body:JSON.stringify(cs) });
export const updateCaseStudy   = (id: string, cs: Partial<CaseStudy>) => api<CaseStudy>(\`/api/case-studies/\${id}\`, { method:'PUT', body:JSON.stringify(cs) });
export const deleteCaseStudy   = (id: string) => api<{ok:boolean}>(\`/api/case-studies/\${id}\`, { method:'DELETE' });

export const getFAQs    = () => api<FAQ[]>('/api/faqs');
export const addFAQ     = (f: Omit<FAQ,'_id'>) => api<FAQ>('/api/faqs', { method:'POST', body:JSON.stringify(f) });
export const updateFAQ  = (id: string, f: Partial<FAQ>) => api<FAQ>(\`/api/faqs/\${id}\`, { method:'PUT', body:JSON.stringify(f) });
export const deleteFAQ  = (id: string) => api<{ok:boolean}>(\`/api/faqs/\${id}\`, { method:'DELETE' });

export const getTeamMembers    = () => api<TeamMember[]>('/api/team');
export const addTeamMember     = (m: Omit<TeamMember,'_id'>) => api<TeamMember>('/api/team', { method:'POST', body:JSON.stringify(m) });
export const updateTeamMember  = (id: string, m: Partial<TeamMember>) => api<TeamMember>(\`/api/team/\${id}\`, { method:'PUT', body:JSON.stringify(m) });
export const deleteTeamMember  = (id: string) => api<{ok:boolean}>(\`/api/team/\${id}\`, { method:'DELETE' });

export const getBlogPosts   = (all = false) => api<BlogPost[]>(\`/api/blog\${all ? '?all=1' : ''}\`);
export const addBlogPost    = (p: Omit<BlogPost,'_id'>) => api<BlogPost>('/api/blog', { method:'POST', body:JSON.stringify(p) });
export const updateBlogPost = (id: string, p: Partial<BlogPost>) => api<BlogPost>(\`/api/blog/\${id}\`, { method:'PUT', body:JSON.stringify(p) });
export const deleteBlogPost = (id: string) => api<{ok:boolean}>(\`/api/blog/\${id}\`, { method:'DELETE' });

export const getSiteContent    = () => api<SiteContent[]>('/api/site-content');
export const updateSiteContent = (key: string, section: string, data: Record<string, unknown>) =>
  api<SiteContent>(\`/api/site-content/\${key}\`, { method:'PUT', body:JSON.stringify({ section, data }) });

export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed: ' + await res.text());
  const { url } = await res.json();
  return url;
}
`);

// =============================================================================
// 4. app/testimonials-case-studies/page.tsx
//    Clean public page — no admin links, shows demo case studies from DB
// =============================================================================
write('app/testimonials-case-studies/page.tsx', `"use client";

import { useEffect, useState } from "react";
import { HeroHeader }   from "@/components/header";
import FooterSection    from "@/components/footer-section";
import NewHeroSection   from "@/components/new-components/new-hero";
import { getTestimonials, getCaseStudies, getSiteContent, type Testimonial, type CaseStudy, type SiteContent } from "@/lib/db";
import { Star, Quote, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const T_PAGE  = 4;
const CS_PAGE = 2;

// ── Demo case studies shown when DB is empty ──────────────────────────────────
const DEMO_CASE_STUDIES: CaseStudy[] = [
  {
    _id: "demo1",
    client: "Meridian Wires",
    industry: "Wire Manufacturing",
    challenge: "Running production planning, sales tracking, and dispatch on three separate spreadsheets maintained by two individuals. Any absence halted operations, and month-end close took 7 days.",
    solution: "LRBC deployed a unified Business Operating System integrating production orders, raw-material consumption, dispatch, and accounts receivable into one live dashboard. LekhaSetu synced accounting data in real time; WorkPilot tracked floor attendance and task completion.",
    result: "Month-end close reduced from 7 days to 18 hours. Production-planning bottleneck eliminated. Owner now reviews the entire business status in a 10-minute morning dashboard check.",
    metrics: [
      { label: "Month-end close", value: "7 days → 18 hrs" },
      { label: "Reporting time saved", value: "~40 hrs/month" },
      { label: "Dependencies", value: "Eliminated" },
    ],
    tags: ["Manufacturing", "LekhaSetu", "WorkPilot", "MIS Dashboard"],
    featured: true,
    sort_order: 1,
  },
  {
    _id: "demo2",
    client: "IndoChem Industries",
    industry: "Specialty Chemicals",
    challenge: "No real-time stock visibility across 3 godowns. Procurement decisions made on gut feel, resulting in dead stock and frequent stockouts of fast-moving SKUs.",
    solution: "LRBC integrated a live inventory layer across all three locations with automated low-stock alerts and a procurement dashboard that surfaced reorder recommendations based on consumption rate.",
    result: "Dead stock reduced by 60% within two quarters. Stockouts of top-20 SKUs dropped to near zero. Procurement lead time cut from 11 days to 5 days.",
    metrics: [
      { label: "Dead stock", value: "↓ 60%" },
      { label: "Stockouts", value: "Near zero" },
      { label: "Lead time", value: "11 → 5 days" },
    ],
    tags: ["Chemicals", "Inventory", "LekhaSetu", "Multi-location"],
    featured: true,
    sort_order: 2,
  },
  {
    _id: "demo3",
    client: "ARV Interiors",
    industry: "Commercial Interiors",
    challenge: "Fast-growing interiors firm losing track of project-wise profitability. Invoices, material costs, and contractor payments were siloed across different team members.",
    solution: "LRBC implemented a project-level P&L tracking system connecting sales orders, material procurement, subcontractor payments, and client invoicing. Receivables ageing was automated and escalated via alerts.",
    result: "Project-wise gross margin now visible within 24 hours of month end. Overdue receivables reduced by 45%. Owner reclaimed 12+ hours per week previously spent chasing status updates.",
    metrics: [
      { label: "Margin visibility", value: "30 days → 24 hrs" },
      { label: "Overdue receivables", value: "↓ 45%" },
      { label: "Time recovered", value: "12 hrs/week" },
    ],
    tags: ["Interiors", "Receivables", "Project P&L"],
    featured: false,
    sort_order: 3,
  },
];

const FALLBACK_T: Testimonial[] = [
  { _id:"f1", name:"Varun Bathwal", designation:"CEO", company:"ARV", image_url:"/images/Varun.jpeg", rating:5, featured:true,
    quote:"The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product." },
  { _id:"f2", name:"Kanul Verma", designation:"Executive Director", company:"Hitco Group", image_url:"/images/Kanul.jpeg", rating:5, featured:true,
    quote:"Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function get(content: SiteContent[], key: string, field: string, fallback: string): string {
  const item = content.find(c => c.key === key);
  return (item?.data?.[field] as string) ?? fallback;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={\`h-4 w-4 \${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}\`} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      {t.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Featured</span>
      )}
      <Quote className="h-8 w-8 text-primary/60" />
      <p className="flex-1 text-base leading-7 text-foreground/90">{t.quote}</p>
      <StarRow rating={t.rating} />
      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        {t.image_url ? (
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{t.name[0]}</div>
        )}
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.designation} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-7 sm:p-9 flex flex-col gap-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
              <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
            </div>
            <h3 className="text-2xl font-semibold">{cs.client}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cs.tags.map(tag => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: "Challenge", text: cs.challenge, color: "text-red-500" },
            { label: "Solution",  text: cs.solution,  color: "text-blue-500" },
            { label: "Result",    text: cs.result,    color: "text-green-500" },
          ].map(({ label, text, color }) => (
            <div key={label} className="rounded-2xl bg-muted/40 p-5">
              <p className={\`text-xs font-semibold uppercase tracking-wider mb-2 \${color}\`}>{label}</p>
              <p className="text-sm text-foreground/80 leading-6">{text}</p>
            </div>
          ))}
        </div>
        {cs.metrics.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {cs.metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-center min-w-[130px]">
                <span className="text-xl font-bold text-primary">{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadMoreBtn({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  return (
    <div className="flex justify-center mt-8">
      <button onClick={onClick}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5">
        <ChevronDown className="h-4 w-4" />
        Load {remaining} more
      </button>
    </div>
  );
}

function SkeletonGrid({ cols = 2, rows = 2, h = "h-64" }: { cols?: number; rows?: number; h?: string }) {
  return (
    <div className={\`grid gap-6 \${cols === 1 ? '' : 'sm:grid-cols-2'}\`}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className={\`rounded-3xl border border-border bg-card/40 \${h} animate-pulse\`} />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies,  setCaseStudies]  = useState<CaseStudy[]>([]);
  const [content,      setContent]      = useState<SiteContent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [tVisible,     setTVisible]     = useState(T_PAGE);
  const [csVisible,    setCsVisible]    = useState(CS_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const [t, cs, sc] = await Promise.all([
          getTestimonials(),
          getCaseStudies(),
          getSiteContent(),
        ]);
        setTestimonials(t.length > 0 ? t : FALLBACK_T);
        // Use demo data if no real case studies exist yet
        setCaseStudies(cs.length > 0 ? cs : DEMO_CASE_STUDIES);
        setContent(sc);
      } catch {
        setTestimonials(FALLBACK_T);
        setCaseStudies(DEMO_CASE_STUDIES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const c = (key: string, field: string, fb: string) => get(content, key, field, fb);
  const shownT  = testimonials.slice(0, tVisible);
  const shownCs = caseStudies.slice(0, csVisible);
  const moreT   = testimonials.length - tVisible;
  const moreCs  = caseStudies.length  - csVisible;

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">{c('testimonials_hero', 'heading_line1', 'Real Results.')}</span>
            <span className="overflow-hidden">{c('testimonials_hero', 'heading_line2', 'Real Clients.')}</span>
          </h1>
        }
        subtitle={c('testimonials_hero', 'subheading', 'Hear directly from the businesses we have helped.')}
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText={c('testimonials_hero', 'badge', 'Testimonials and Case Studies')}
      />

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {c('testimonials_section', 'eyebrow', 'Client Voices')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            {c('testimonials_section', 'heading', 'What Our Clients Say')}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            {c('testimonials_section', 'subheading', 'Every quote came directly from a founder, director, or operations leader we have worked with.')}
          </p>
        </div>
        {loading ? <SkeletonGrid cols={2} rows={2} /> : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {shownT.map(t => <TestimonialCard key={t._id ?? t.name} t={t} />)}
            </div>
            {moreT > 0 && <LoadMoreBtn remaining={Math.min(moreT, T_PAGE)} onClick={() => setTVisible(v => v + T_PAGE)} />}
          </>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Case Studies ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {c('casestudies_section', 'eyebrow', 'Deep Dives')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            {c('casestudies_section', 'heading', 'The Work, In Detail')}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            {c('casestudies_section', 'subheading', 'Each case study shows the specific problem, the system we built, and the measurable outcome.')}
          </p>
        </div>
        {loading ? <SkeletonGrid cols={1} rows={2} h="h-80" /> : (
          <>
            <div className="flex flex-col gap-8">
              {shownCs.map(cs => <CaseStudyCard key={cs._id ?? cs.client} cs={cs} />)}
            </div>
            {moreCs > 0 && <LoadMoreBtn remaining={Math.min(moreCs, CS_PAGE)} onClick={() => setCsVisible(v => v + CS_PAGE)} />}
          </>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">
            {c('testimonials_cta', 'heading', 'Ready to become the next case study?')}
          </h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base">
            {c('testimonials_cta', 'subheading', 'Book a discovery call and let us map out what a Business Operating System looks like for your operations.')}
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href={c('testimonials_cta', 'button_href', '/contact?openForm=true')}>
              {c('testimonials_cta', 'button_text', 'Get Started')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
`);

// =============================================================================
// 5. app/12245-admin/page.tsx — Full WordPress-style admin panel
// =============================================================================
write('app/12245-admin/page.tsx', `"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Save, X, Star, ShieldCheck, Eye, EyeOff,
  MessageSquareQuote, BookOpen, Users, HelpCircle, FileText,
  LogOut, Upload, Loader2, ChevronDown, ChevronUp,
  ExternalLink, Home, Info, Layers, Phone, LayoutDashboard,
  AlertCircle, Image as ImageIcon, Type, List, ChevronRight,
  Check, RefreshCw,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Badge }   from "@/components/ui/badge";
import { Logo }    from "@/components/logo";
import {
  getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
  getCaseStudies,  addCaseStudy,   updateCaseStudy,   deleteCaseStudy,
  getFAQs,         addFAQ,         updateFAQ,          deleteFAQ,
  getTeamMembers,  addTeamMember,  updateTeamMember,  deleteTeamMember,
  getBlogPosts,    addBlogPost,    updateBlogPost,     deleteBlogPost,
  getSiteContent,  updateSiteContent,
  uploadImage,
  type Testimonial, type CaseStudy, type FAQ, type TeamMember,
  type BlogPost, type SiteContent,
} from "@/lib/db";

// ── PIN Gate ──────────────────────────────────────────────────────────────────
const ADMIN_PIN    = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "lrbc2025";
const PIN_SESS_KEY = "lrbc_admin_v3";

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin]   = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr]   = useState(false);
  function attempt() {
    if (pin === ADMIN_PIN) { sessionStorage.setItem(PIN_SESS_KEY, "1"); onUnlock(); }
    else { setErr(true); setPin(""); setTimeout(() => setErr(false), 2000); }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <Logo />
          <p className="text-sm text-muted-foreground text-center mt-1">Content Management System</p>
        </div>
        <div className="relative">
          <input type={show ? "text" : "password"} value={pin}
            onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Admin PIN"
            className={\`w-full rounded-xl border \${err ? "border-destructive" : "border-input"} bg-background px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-ring\`}
          />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {err && <p className="text-xs text-destructive text-center -mt-3">Incorrect PIN. Try again.</p>}
        <Button onClick={attempt} size="lg" className="rounded-xl">Enter Dashboard</Button>
      </div>
    </div>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Field({ label, value, onChange, textarea = false, placeholder = "", type = "text", hint = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string; type?: string; hint?: string;
}) {
  const cls = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground/60">{hint}</span>}
      </div>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} placeholder={placeholder} className={cls + " resize-y"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

function ImageField({ label, value, onChange, folder }: {
  label: string; value: string; onChange: (url: string) => void; folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setErr("");
    try { onChange(await uploadImage(file, folder)); }
    catch (ex: unknown) { setErr(ex instanceof Error ? ex.message : "Upload failed"); }
    finally { setUploading(false); }
  }
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded-xl border bg-muted/30">
          <img src={value} alt="preview" className="h-full w-full object-cover" />
          <button onClick={() => onChange("")} className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <span className="text-xs text-muted-foreground">or paste URL</span>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 min-w-[160px] rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

function SaveBtn({ onClick, saving, label = "Save changes" }: { onClick: () => void; saving?: boolean; label?: string }) {
  return (
    <Button onClick={onClick} size="sm" className="rounded-lg gap-1.5" disabled={saving}>
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {saving ? "Saving…" : label}
    </Button>
  );
}

function SectionCard({ title, icon, children, defaultOpen = false }: {
  title: string; icon: ReactNode; children: ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border px-5 py-5 flex flex-col gap-5">{children}</div>}
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={\`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg \${
      type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-500" : "bg-destructive/10 border border-destructive/30 text-destructive"
    }\`}>
      {type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg}
    </div>
  );
}

// ── Page Content Editor ───────────────────────────────────────────────────────
// Generic editor for any SiteContent section

function ContentEditor({ item, onSaved }: { item: SiteContent; onSaved: () => void }) {
  const [data, setData] = useState<Record<string, unknown>>(item.data ?? {});
  const [saving, setSaving] = useState(false);

  const set = (k: string) => (v: unknown) => setData(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try { await updateSiteContent(item.key, item.section, data); onSaved(); }
    catch { /* silent */ }
    finally { setSaving(false); }
  }

  // Render a field based on the key name heuristic
  function renderField(k: string, v: unknown) {
    if (Array.isArray(v)) {
      // Array of strings
      if (typeof v[0] === "string") {
        return (
          <div key={k} className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.replace(/_/g," ")}</label>
            {(v as string[]).map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={e => { const a = [...v as string[]]; a[i] = e.target.value; set(k)(a); }}
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <button onClick={() => set(k)((v as string[]).filter((_,j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-fit rounded-lg gap-1.5"
              onClick={() => set(k)([...(v as string[]), ""])}>
              <Plus className="h-3.5 w-3.5" /> Add item
            </Button>
          </div>
        );
      }
      // Array of objects (features with title+desc)
      if (typeof v[0] === "object") {
        return (
          <div key={k} className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k.replace(/_/g," ")}</label>
            {(v as Record<string,string>[]).map((obj, i) => (
              <div key={i} className="rounded-xl border border-border p-4 flex flex-col gap-3">
                {Object.entries(obj).map(([fk, fv]) => (
                  <div key={fk} className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground capitalize">{fk}</label>
                    <input value={fv} onChange={e => {
                      const a = [...(v as Record<string,string>[])];
                      a[i] = { ...a[i], [fk]: e.target.value };
                      set(k)(a);
                    }} className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
                <button onClick={() => set(k)((v as Record<string,string>[]).filter((_,j) => j !== i))}
                  className="text-xs text-destructive hover:underline text-left">Remove</button>
              </div>
            ))}
          </div>
        );
      }
    }
    const strVal = String(v ?? "");
    const isImage = k.includes("image") || k.includes("cover") || k.includes("photo") || k.includes("avatar") || k.includes("url");
    const isLong  = k.includes("body") || k.includes("story") || k.includes("address") || k.includes("desc") || k.includes("heading") || strVal.length > 80;
    if (isImage) {
      return <ImageField key={k} label={k.replace(/_/g," ")} value={strVal} onChange={v => set(k)(v)} folder="site" />;
    }
    return <Field key={k} label={k.replace(/_/g," ")} value={strVal} onChange={v => set(k)(v)} textarea={isLong} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([k, v]) => renderField(k, v))}
      <div className="pt-2"><SaveBtn onClick={save} saving={saving} /></div>
    </div>
  );
}

// ── Page Sections Panel ───────────────────────────────────────────────────────
function PageSectionsPanel({ page, label, content, onRefresh }: {
  page: string; label: string; content: SiteContent[];
  onRefresh: () => void;
}) {
  const [toast, setToast] = useState<{msg:string; type:"success"|"error"} | null>(null);
  const sections = content.filter(c => c.page === page);

  function showToast(msg: string, type: "success"|"error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSaved() {
    showToast("Section saved successfully", "success");
    onRefresh();
  }

  const ICONS: Record<string, ReactNode> = {
    "Hero Section": <Layers className="h-4 w-4" />,
    "About ERP Section": <Info className="h-4 w-4" />,
    "Why Choose Us Section": <List className="h-4 w-4" />,
    "Products Section": <LayoutDashboard className="h-4 w-4" />,
    "Our Story": <FileText className="h-4 w-4" />,
    "Team Section": <Users className="h-4 w-4" />,
    "Features Section": <List className="h-4 w-4" />,
    "Contact Details": <Phone className="h-4 w-4" />,
    "Testimonials Section": <MessageSquareQuote className="h-4 w-4" />,
    "Case Studies Section": <BookOpen className="h-4 w-4" />,
    "CTA Banner": <Type className="h-4 w-4" />,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{sections.length} editable section{sections.length !== 1 ? "s" : ""} on the {label} page</p>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>
      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
          No sections found. They will appear here after first page load.
        </div>
      ) : (
        sections.map(item => (
          <SectionCard key={item.key} title={item.section} icon={ICONS[item.section] ?? <Type className="h-4 w-4" />}>
            <ContentEditor item={item} onSaved={handleSaved} />
          </SectionCard>
        ))
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── Testimonials CRUD ─────────────────────────────────────────────────────────
const BLANK_T: Omit<Testimonial,"_id"> = { name:"", designation:"", company:"", image_url:"", quote:"", rating:5, featured:false, sort_order:0 };

function TestimonialsPanel() {
  const [rows, setRows]       = useState<Testimonial[]>([]);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [form, setForm]       = useState<Omit<Testimonial,"_id">>(BLANK_T);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error") { setToast({msg,type}); setTimeout(() => setToast(null), 3000); }
  const load = useCallback(async () => { setLoading(true); setRows(await getTestimonials()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: keyof typeof form) => (v: unknown) => setForm(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      if (editId) { await updateTestimonial(editId, form); setEditId(null); showToast("Testimonial updated", "success"); }
      else { await addTestimonial(form); setAdding(false); showToast("Testimonial added", "success"); }
      await load();
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Error", "error"); }
    finally { setSaving(false); }
  }

  async function del(id: string, name: string) {
    if (!confirm(\`Delete "\${name}"?\`)) return;
    try { await deleteTestimonial(id); await load(); showToast("Deleted", "success"); }
    catch { showToast("Delete failed", "error"); }
  }

  const Form = () => (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-primary">{editId ? "Edit testimonial" : "New testimonial"}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Designation" value={form.designation} onChange={set("designation")} />
        <Field label="Company" value={form.company} onChange={set("company")} />
        <Field label="Sort order" value={String(form.sort_order??0)} onChange={v=>set("sort_order")(Number(v))} type="number" />
      </div>
      <ImageField label="Photo" value={form.image_url} onChange={v=>set("image_url")(v)} folder="testimonials" />
      <Field label="Quote" value={form.quote} onChange={set("quote")} textarea />
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => set("rating")(n)}>
                <Star className={\`h-5 w-5 \${n<=form.rating?"fill-yellow-400 text-yellow-400":"text-muted-foreground/30"}\`} />
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e=>set("featured")(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
          <span className="text-sm">Featured</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} saving={saving} />
        <Button variant="ghost" onClick={() => { setAdding(false); setEditId(null); }} size="sm" className="rounded-lg gap-1.5">
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {!adding && !editId && (
        <Button onClick={() => { setAdding(true); setForm(BLANK_T); }} variant="outline" size="sm" className="rounded-xl w-fit gap-1.5">
          <Plus className="h-4 w-4" /> Add testimonial
        </Button>
      )}
      {adding && <Form />}
      {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
      {!loading && rows.length===0 && <p className="text-sm text-muted-foreground py-8 text-center">No testimonials yet.</p>}
      {rows.map(t => (
        <div key={t._id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              {t.image_url && <div className="h-9 w-9 overflow-hidden rounded-full shrink-0"><img src={t.image_url} alt={t.name} className="h-full w-full object-cover" /></div>}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.designation} · {t.company}</span>
                  {t.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{t.quote}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => { setEditId(t._id!); setAdding(false); setForm({name:t.name,designation:t.designation,company:t.company,image_url:t.image_url,quote:t.quote,rating:t.rating,featured:t.featured,sort_order:t.sort_order}); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                onClick={() => del(t._id!, t.name)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {editId===t._id && <div className="border-t border-border px-5 py-5"><Form /></div>}
        </div>
      ))}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── Case Studies CRUD ─────────────────────────────────────────────────────────
const BLANK_CS: Omit<CaseStudy,"_id"> = { client:"", industry:"", challenge:"", solution:"", result:"", metrics:[{label:"",value:""}], tags:[], featured:false, sort_order:0 };

function CaseStudiesPanel() {
  const [rows, setRows]       = useState<CaseStudy[]>([]);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [form, setForm]       = useState<Omit<CaseStudy,"_id">>(BLANK_CS);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error") { setToast({msg,type}); setTimeout(() => setToast(null), 3000); }
  const load = useCallback(async () => { setLoading(true); setRows(await getCaseStudies()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: keyof typeof form) => (v: unknown) => setForm(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      if (editId) { await updateCaseStudy(editId, form); setEditId(null); showToast("Case study updated", "success"); }
      else { await addCaseStudy(form); setAdding(false); showToast("Case study added", "success"); }
      await load();
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Error", "error"); }
    finally { setSaving(false); }
  }

  async function del(id: string, name: string) {
    if (!confirm(\`Delete "\${name}"?\`)) return;
    try { await deleteCaseStudy(id); await load(); showToast("Deleted", "success"); }
    catch { showToast("Delete failed", "error"); }
  }

  const Form = () => (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-primary">{editId ? "Edit case study" : "New case study"}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" value={form.client} onChange={set("client")} />
        <Field label="Industry" value={form.industry} onChange={set("industry")} />
      </div>
      <Field label="Challenge" value={form.challenge} onChange={set("challenge")} textarea />
      <Field label="Solution" value={form.solution} onChange={set("solution")} textarea />
      <Field label="Result" value={form.result} onChange={set("result")} textarea />
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metrics</label>
        {form.metrics.map((m,i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={m.label} placeholder="Label" onChange={e => set("metrics")(form.metrics.map((x,j)=>j===i?{...x,label:e.target.value}:x))}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <input value={m.value} placeholder="Value" onChange={e => set("metrics")(form.metrics.map((x,j)=>j===i?{...x,value:e.target.value}:x))}
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={() => set("metrics")(form.metrics.filter((_,j)=>j!==i))} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="rounded-lg w-fit gap-1.5" onClick={() => set("metrics")([...form.metrics,{label:"",value:""}])}>
          <Plus className="h-3.5 w-3.5" /> Add metric
        </Button>
      </div>
      <Field label="Tags (comma-separated)" value={form.tags.join(", ")}
        onChange={v => set("tags")(v.split(",").map(s=>s.trim()).filter(Boolean))} />
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e=>set("featured")(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
        <span className="text-sm">Featured</span>
      </label>
      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} saving={saving} />
        <Button variant="ghost" onClick={() => { setAdding(false); setEditId(null); }} size="sm" className="rounded-lg gap-1.5"><X className="h-4 w-4" /> Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {!adding && !editId && (
        <Button onClick={() => { setAdding(true); setForm(BLANK_CS); }} variant="outline" size="sm" className="rounded-xl w-fit gap-1.5">
          <Plus className="h-4 w-4" /> Add case study
        </Button>
      )}
      {adding && <Form />}
      {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
      {rows.map(cs => (
        <div key={cs._id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-sm">{cs.client}</span>
                <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
                {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{cs.challenge}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => { setEditId(cs._id!); setAdding(false); setForm({client:cs.client,industry:cs.industry,challenge:cs.challenge,solution:cs.solution,result:cs.result,metrics:cs.metrics,tags:cs.tags,featured:cs.featured,sort_order:cs.sort_order}); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                onClick={() => del(cs._id!, cs.client)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {editId===cs._id && <div className="border-t border-border px-5 py-5"><Form /></div>}
        </div>
      ))}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── FAQs CRUD ─────────────────────────────────────────────────────────────────
const BLANK_FAQ: Omit<FAQ,"_id"> = { question:"", answer:"", icon:"circle-help", sort_order:0 };

function FAQsPanel() {
  const [rows, setRows]       = useState<FAQ[]>([]);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [form, setForm]       = useState<Omit<FAQ,"_id">>(BLANK_FAQ);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error") { setToast({msg,type}); setTimeout(() => setToast(null), 3000); }
  const load = useCallback(async () => { setLoading(true); setRows(await getFAQs()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: keyof typeof form) => (v: unknown) => setForm(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      if (editId) { await updateFAQ(editId, form); setEditId(null); showToast("FAQ updated","success"); }
      else { await addFAQ(form); setAdding(false); showToast("FAQ added","success"); }
      await load();
    } catch { showToast("Error","error"); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try { await deleteFAQ(id); await load(); showToast("Deleted","success"); }
    catch { showToast("Delete failed","error"); }
  }

  const Form = () => (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-5 flex flex-col gap-4">
      <Field label="Question" value={form.question} onChange={set("question")} />
      <Field label="Answer" value={form.answer} onChange={set("answer")} textarea />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Icon (lucide name)" value={form.icon} onChange={set("icon")} placeholder="circle-help" hint="e.g. cpu, handshake, timer" />
        <Field label="Sort order" value={String(form.sort_order??0)} onChange={v=>set("sort_order")(Number(v))} type="number" />
      </div>
      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} saving={saving} />
        <Button variant="ghost" onClick={() => { setAdding(false); setEditId(null); }} size="sm" className="rounded-lg gap-1.5"><X className="h-4 w-4" /> Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {!adding && !editId && (
        <Button onClick={() => { setAdding(true); setForm(BLANK_FAQ); }} variant="outline" size="sm" className="rounded-xl w-fit gap-1.5">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      )}
      {adding && <Form />}
      {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
      {rows.map(f => (
        <div key={f._id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{f.question}</p>
              <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{f.answer}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => { setEditId(f._id!); setAdding(false); setForm({question:f.question,answer:f.answer,icon:f.icon,sort_order:f.sort_order}); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => del(f._id!)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {editId===f._id && <div className="border-t border-border px-5 py-5"><Form /></div>}
        </div>
      ))}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── Team CRUD ─────────────────────────────────────────────────────────────────
const BLANK_TM: Omit<TeamMember,"_id"> = { name:"", role:"", avatar_url:"", linkedin_url:"", object_position:"center top", sort_order:0 };

function TeamPanel() {
  const [rows, setRows]       = useState<TeamMember[]>([]);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [form, setForm]       = useState<Omit<TeamMember,"_id">>(BLANK_TM);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error") { setToast({msg,type}); setTimeout(() => setToast(null), 3000); }
  const load = useCallback(async () => { setLoading(true); setRows(await getTeamMembers()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: keyof typeof form) => (v: unknown) => setForm(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      if (editId) { await updateTeamMember(editId, form); setEditId(null); showToast("Updated","success"); }
      else { await addTeamMember(form); setAdding(false); showToast("Added","success"); }
      await load();
    } catch { showToast("Error","error"); }
    finally { setSaving(false); }
  }

  async function del(id: string, name: string) {
    if (!confirm(\`Remove "\${name}"?\`)) return;
    try { await deleteTeamMember(id); await load(); showToast("Removed","success"); }
    catch { showToast("Error","error"); }
  }

  const Form = () => (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-5 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={set("name")} />
        <Field label="Role" value={form.role} onChange={set("role")} />
        <Field label="LinkedIn URL" value={form.linkedin_url} onChange={set("linkedin_url")} />
        <Field label="Object position" value={form.object_position} onChange={set("object_position")} placeholder="center top" />
        <Field label="Sort order" value={String(form.sort_order??0)} onChange={v=>set("sort_order")(Number(v))} type="number" />
      </div>
      <ImageField label="Photo" value={form.avatar_url} onChange={v=>set("avatar_url")(v)} folder="team" />
      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} saving={saving} />
        <Button variant="ghost" onClick={() => { setAdding(false); setEditId(null); }} size="sm" className="rounded-lg gap-1.5"><X className="h-4 w-4" /> Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {!adding && !editId && (
        <Button onClick={() => { setAdding(true); setForm(BLANK_TM); }} variant="outline" size="sm" className="rounded-xl w-fit gap-1.5">
          <Plus className="h-4 w-4" /> Add team member
        </Button>
      )}
      {adding && <Form />}
      {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
      {rows.map(m => (
        <div key={m._id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              {m.avatar_url && <div className="h-9 w-9 overflow-hidden rounded-full shrink-0"><img src={m.avatar_url} alt={m.name} className="h-full w-full object-cover" /></div>}
              <div>
                <span className="font-medium text-sm">{m.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{m.role}</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => { setEditId(m._id!); setAdding(false); setForm({name:m.name,role:m.role,avatar_url:m.avatar_url,linkedin_url:m.linkedin_url,object_position:m.object_position,sort_order:m.sort_order}); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => del(m._id!, m.name)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {editId===m._id && <div className="border-t border-border px-5 py-5"><Form /></div>}
        </div>
      ))}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── Blog CRUD ─────────────────────────────────────────────────────────────────
const BLANK_POST: Omit<BlogPost,"_id"> = { title:"", slug:"", excerpt:"", content:"", cover_url:"", author_name:"LRBC Team", tags:[], published:false, published_at:null };

function BlogPanel() {
  const [rows, setRows]       = useState<BlogPost[]>([]);
  const [adding, setAdding]   = useState(false);
  const [editId, setEditId]   = useState<string|null>(null);
  const [form, setForm]       = useState<Omit<BlogPost,"_id">>(BLANK_POST);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);

  function showToast(msg: string, type: "success"|"error") { setToast({msg,type}); setTimeout(() => setToast(null), 3000); }
  const load = useCallback(async () => { setLoading(true); setRows(await getBlogPosts(true)); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: keyof typeof form) => (v: unknown) => setForm(p => ({ ...p, [k]: v }));
  function autoSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, published_at: form.published && !form.published_at ? new Date().toISOString() : form.published_at };
      if (editId) { await updateBlogPost(editId, payload); setEditId(null); showToast("Post updated","success"); }
      else { await addBlogPost(payload); setAdding(false); showToast("Post created","success"); }
      await load();
    } catch { showToast("Error","error"); }
    finally { setSaving(false); }
  }

  async function del(id: string, title: string) {
    if (!confirm(\`Delete "\${title}"?\`)) return;
    try { await deleteBlogPost(id); await load(); showToast("Deleted","success"); }
    catch { showToast("Error","error"); }
  }

  const Form = () => (
    <div className="rounded-2xl border border-primary/20 bg-card/70 p-5 flex flex-col gap-4">
      <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title:v, slug: editId ? p.slug : autoSlug(v) }))} />
      <Field label="Slug (URL path)" value={form.slug} onChange={set("slug")} placeholder="my-blog-post" />
      <Field label="Excerpt" value={form.excerpt} onChange={set("excerpt")} textarea />
      <Field label="Content (Markdown)" value={form.content} onChange={set("content")} textarea />
      <ImageField label="Cover image" value={form.cover_url} onChange={v=>set("cover_url")(v)} folder="blog" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Author" value={form.author_name} onChange={set("author_name")} />
        <Field label="Tags (comma-separated)" value={form.tags.join(", ")} onChange={v=>set("tags")(v.split(",").map(s=>s.trim()).filter(Boolean))} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e=>set("published")(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
        <span className="text-sm">Published (visible on site)</span>
      </label>
      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} saving={saving} />
        <Button variant="ghost" onClick={() => { setAdding(false); setEditId(null); }} size="sm" className="rounded-lg gap-1.5"><X className="h-4 w-4" /> Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {!adding && !editId && (
        <Button onClick={() => { setAdding(true); setForm(BLANK_POST); }} variant="outline" size="sm" className="rounded-xl w-fit gap-1.5">
          <Plus className="h-4 w-4" /> New blog post
        </Button>
      )}
      {adding && <Form />}
      {loading && <p className="text-sm text-muted-foreground py-4">Loading…</p>}
      {rows.length===0 && !loading && <p className="text-sm text-muted-foreground py-8 text-center">No blog posts yet.</p>}
      {rows.map(post => (
        <div key={post._id} className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            {post.cover_url && <div className="h-12 w-16 overflow-hidden rounded-lg shrink-0"><img src={post.cover_url} alt={post.title} className="h-full w-full object-cover" /></div>}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-sm">{post.title}</span>
                <Badge variant={post.published?"default":"secondary"} className="text-xs rounded-full">{post.published?"Published":"Draft"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-lg">{post.excerpt}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => { setEditId(post._id!); setAdding(false); setForm({title:post.title,slug:post.slug,excerpt:post.excerpt,content:post.content,cover_url:post.cover_url,author_name:post.author_name,tags:post.tags,published:post.published,published_at:post.published_at}); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => del(post._id!, post.title)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {editId===post._id && <div className="border-t border-border px-5 py-5"><Form /></div>}
        </div>
      ))}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

type Tab =
  | "home" | "about" | "lekhasetu" | "contact" | "testimonials-page"
  | "testimonials" | "case-studies" | "faqs" | "team" | "blog";

const TABS: { key: Tab; label: string; icon: ReactNode; group: string }[] = [
  // Page content
  { key:"home",              label:"Home Page",           icon:<Home className="h-4 w-4" />,              group:"Pages" },
  { key:"about",             label:"About Page",          icon:<Info className="h-4 w-4" />,              group:"Pages" },
  { key:"lekhasetu",         label:"LekhaSetu Page",      icon:<Layers className="h-4 w-4" />,            group:"Pages" },
  { key:"contact",           label:"Contact Page",        icon:<Phone className="h-4 w-4" />,             group:"Pages" },
  { key:"testimonials-page", label:"Testimonials Page",   icon:<MessageSquareQuote className="h-4 w-4" />,group:"Pages" },
  // Content collections
  { key:"testimonials",  label:"Testimonials",   icon:<MessageSquareQuote className="h-4 w-4" />, group:"Content" },
  { key:"case-studies",  label:"Case Studies",   icon:<BookOpen className="h-4 w-4" />,           group:"Content" },
  { key:"faqs",          label:"FAQs",           icon:<HelpCircle className="h-4 w-4" />,         group:"Content" },
  { key:"team",          label:"Team Members",   icon:<Users className="h-4 w-4" />,              group:"Content" },
  { key:"blog",          label:"Blog Posts",     icon:<FileText className="h-4 w-4" />,           group:"Content" },
];

const PAGE_MAP: Record<string, string> = {
  "home": "home", "about": "about", "lekhasetu": "lekhasetu",
  "contact": "contact", "testimonials-page": "testimonials",
};

const PAGE_LABEL: Record<string, string> = {
  "home":"Home","about":"About","lekhasetu":"LekhaSetu",
  "contact":"Contact","testimonials-page":"Testimonials",
};

const PREVIEW_MAP: Record<string, string> = {
  "home":"/","about":"/about","lekhasetu":"/lekhasetu",
  "contact":"/contact","testimonials-page":"/testimonials-case-studies",
};

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab]           = useState<Tab>("home");
  const [content, setContent]   = useState<SiteContent[]>([]);
  const [cLoading, setCLoading] = useState(true);

  const loadContent = useCallback(async () => {
    setCLoading(true);
    try { setContent(await getSiteContent()); }
    catch { /* silent */ }
    finally { setCLoading(false); }
  }, []);

  useEffect(() => { loadContent(); }, [loadContent]);

  const groups: Record<string, typeof TABS> = {};
  TABS.forEach(t => { if (!groups[t.group]) groups[t.group] = []; groups[t.group].push(t); });

  const isPageTab = tab in PAGE_MAP;
  const previewUrl = isPageTab ? PREVIEW_MAP[tab] : "/testimonials-case-studies";

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card/40 pt-4 pb-6">
        <div className="px-4 mb-6"><Logo /></div>
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-4">
            <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">{group}</p>
            {items.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={\`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors \${
                  tab === key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }\`}>
                {icon} {label}
                {tab === key && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="lg:hidden"><Logo /></div>
              <span className="text-sm font-medium text-foreground">
                {TABS.find(t => t.key === tab)?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
                <Link href={previewUrl} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" /> Preview
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="rounded-full gap-1.5 text-xs text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="lg:hidden flex gap-1 overflow-x-auto border-t border-border px-3 py-2 scrollbar-none">
            {TABS.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={\`flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors \${
                  tab===key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }\`}>
                {icon} {label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-8">
          {/* Page content tabs */}
          {isPageTab && (
            cLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({length:3}).map((_,i) => <div key={i} className="rounded-2xl border border-border bg-card/40 h-16 animate-pulse" />)}
              </div>
            ) : (
              <PageSectionsPanel
                page={PAGE_MAP[tab]}
                label={PAGE_LABEL[tab]}
                content={content}
                onRefresh={loadContent}
              />
            )
          )}

          {/* Collection tabs */}
          {tab === "testimonials"  && <TestimonialsPanel />}
          {tab === "case-studies"  && <CaseStudiesPanel />}
          {tab === "faqs"          && <FAQsPanel />}
          {tab === "team"          && <TeamPanel />}
          {tab === "blog"          && <BlogPanel />}
        </main>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { if (sessionStorage.getItem(PIN_SESS_KEY) === "1") setAuthed(true); }, []);
  function logout() { sessionStorage.removeItem(PIN_SESS_KEY); setAuthed(false); }
  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />;
  return <Dashboard onLogout={logout} />;
}
`);

// =============================================================================
// Verify
// =============================================================================
console.log('\n── Verification ──');
const checks = [
  ['lib/models/SiteContent.ts',                       'ISiteContent'],
  ['app/api/site-content/route.ts',                   'SEED_CONTENT'],
  ['app/api/site-content/[key]/route.ts',             'findOneAndUpdate'],
  ['lib/db.ts',                                       'getSiteContent'],
  ['lib/db.ts',                                       'updateSiteContent'],
  ['app/testimonials-case-studies/page.tsx',          'DEMO_CASE_STUDIES'],
  ['app/testimonials-case-studies/page.tsx',          'LoadMoreBtn'],
  ['app/testimonials-case-studies/page.tsx',          'getSiteContent'],
  ['app/12245-admin/page.tsx',                        'PageSectionsPanel'],
  ['app/12245-admin/page.tsx',                        'ContentEditor'],
  ['app/12245-admin/page.tsx',                        'SectionCard'],
  ['app/api/site-content/route.ts',                   'home_hero'],
  ['app/12245-admin/page.tsx',                        'lekhasetu'],
  ['app/12245-admin/page.tsx',                        'CaseStudiesPanel'],
  ['app/12245-admin/page.tsx',                        'BlogPanel'],
];

let allOk = true;
checks.forEach(([file, needle]) => {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) { console.error('  ✗  MISSING: ' + file); allOk = false; return; }
  if (fs.readFileSync(abs,'utf8').includes(needle)) console.log('  ✓  ' + path.basename(file) + ' → ' + needle);
  else { console.error('  ✗  NOT FOUND: ' + needle + ' in ' + file); allOk = false; }
});

if (!allOk) { console.error('\n❌  Checks failed'); process.exit(1); }

console.log(`
══════════════════════════════════════════════════════════════════
  Done. Run:  pnpm dev

  Admin panel:   http://localhost:3000/12245-admin
  PIN:           lrbc2025

  ── Admin Panel Structure ────────────────────────────────────────
  PAGES sidebar (edit text/images per section):
    Home Page       → Hero, About ERP, Why Choose Us, Products
    About Page      → Hero, Our Story, Team Section
    LekhaSetu Page  → Hero, Features
    Contact Page    → Hero, Contact Details
    Testimonials    → Hero, Testimonials Section, Case Studies, CTA

  CONTENT sidebar (add/edit/delete records):
    Testimonials    → CRUD with photo upload
    Case Studies    → CRUD with metrics builder
    FAQs            → CRUD with icon picker
    Team Members    → CRUD with photo upload
    Blog Posts      → CRUD with cover image, publish toggle

  ── Public Page ─────────────────────────────────────────────────
  http://localhost:3000/testimonials-case-studies
    • Shows 3 demo case studies (Meridian, IndoChem, ARV)
    • Load More button for testimonials (4 shown initially)
    • Load More button for case studies (2 shown initially)
    • No admin links visible to public
    • All text driven by site content from MongoDB
══════════════════════════════════════════════════════════════════
`);

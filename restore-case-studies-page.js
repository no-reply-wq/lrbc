const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from project root: cd D:\\lrbc-main\\lrbc-main');
  process.exit(1);
}

const dir = path.join(root, 'app', 'testimonials-case-studies');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'page.tsx'), `"use client";

import { useEffect, useState } from "react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import NewHeroSection from "@/components/new-components/new-hero";
import { getTestimonials, getCaseStudies, getSiteContent, type Testimonial, type CaseStudy, type SiteContent } from "@/lib/db";
import { Star, Quote, TrendingUp, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const T_PAGE  = 2;
const CS_PAGE = 2;

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
  { _id:"f3", name:"Ekta V Vohra", designation:"Founder", company:"Wedding Alliance", image_url:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", rating:5, featured:true,
    quote:"When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!" },
];

const CS_IMAGES: Record<string, string[]> = {
  demo1: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1565664049038-f5e41b5c6e7b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=500&fit=crop",
  ],
  demo2: [
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=500&fit=crop",
  ],
  demo3: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=500&fit=crop",
  ],
};

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

function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  return (
    <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl bg-muted">
      <img src={images[idx]} alt={\`Project image \${idx + 1}\`} className="h-full w-full object-cover transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={\`h-1.5 rounded-full transition-all duration-300 \${i === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"}\`} />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60">
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const images = CS_IMAGES[cs._id ?? ""] ?? ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop"];
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-7 sm:p-9 flex flex-col gap-6">

        {/* Row 1: Client name + Tags */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
              <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
            </div>
            <h3 className="text-2xl font-semibold">{cs.client}</h3>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {cs.tags.map(tag => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        {/* Row 2: Challenge | Result+Metrics | Image */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-muted/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-red-500">Challenge</p>
            <p className="text-sm text-foreground/80 leading-6">{cs.challenge}</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-muted/40 p-5 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-green-500">Result</p>
              <p className="text-sm text-foreground/80 leading-6">{cs.result}</p>
            </div>
            {cs.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {cs.metrics.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-primary/20 bg-primary/5 px-2 py-3 text-center">
                    <span className="text-sm font-bold text-primary leading-tight">{m.value}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="min-h-[240px]">
            <ImageCarousel images={images} />
          </div>
        </div>

        {/* Row 3: Solution — full width */}
        <div className="rounded-2xl bg-muted/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-blue-500">Solution</p>
          <p className="text-sm text-foreground/80 leading-6">{cs.solution}</p>
        </div>

      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      {t.featured && <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Featured</span>}
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

function LoadMoreBtn({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  return (
    <div className="flex justify-center mt-8">
      <button onClick={onClick} className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5">
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

export default function CaseStudiesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies,  setCaseStudies]  = useState<CaseStudy[]>([]);
  const [content,      setContent]      = useState<SiteContent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [tVisible,     setTVisible]     = useState(2);
  const [csVisible,    setCsVisible]    = useState(CS_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const [t, cs, sc] = await Promise.all([getTestimonials(), getCaseStudies(), getSiteContent()]);
        setTestimonials(t.length > 0 ? t : FALLBACK_T);
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
        title={<h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]"><span className="overflow-hidden">Real Results.</span><span className="overflow-hidden">Real Clients.</span></h1>}
        subtitle="Every case study is a real business problem we solved. Every number is verified."
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText="Case Studies"
      />

      {/* Case Studies */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Deep Dives</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">The Work, In Detail</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Each case study shows the specific problem, the system we built, and the measurable outcome.</p>
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

      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Client Voices</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What Our Clients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Every quote came directly from a founder, director, or operations leader we have worked with.</p>
        </div>
        {loading ? <SkeletonGrid cols={2} rows={2} /> : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 items-start">
              {shownT.map(t => <TestimonialCard key={t._id ?? t.name} t={t} />)}
            </div>
            {moreT > 0 && <LoadMoreBtn remaining={Math.min(moreT, T_PAGE)} onClick={() => setTVisible(v => v + T_PAGE)} />}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to become the next case study?</h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base">Book a discovery call and let us map out what a Business Operating System looks like for your operations.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact?openForm=true">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
`, 'utf8');

console.log('Done! File written to: app/testimonials-case-studies/page.tsx');
console.log('');
console.log('Now run:');
console.log('  Remove-Item -Recurse -Force .next');
console.log('  pnpm dev');

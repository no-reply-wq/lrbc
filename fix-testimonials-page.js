// =============================================================================
// Fix: app/testimonials-case-studies/page.tsx
// - Reads from MongoDB correctly (_id not id)
// - Removes SEED fallback dependency (DB is now live)
// - Adds "Load More" for testimonials (shows 4 initially)
// - Adds "Load More" for case studies (shows 2 initially)
// Run: node fix-testimonials-page.js
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

write('app/testimonials-case-studies/page.tsx', `"use client";

import { useEffect, useState } from "react";
import { HeroHeader }   from "@/components/header";
import FooterSection    from "@/components/footer-section";
import NewHeroSection   from "@/components/new-components/new-hero";
import { getTestimonials, getCaseStudies, type Testimonial, type CaseStudy } from "@/lib/db";
import { Star, Quote, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// How many cards to show before "Load More"
const T_PAGE  = 4;   // testimonials per page
const CS_PAGE = 2;   // case studies per page

// ── Fallback data — shown only if MongoDB returns empty ───────────────────────
const FALLBACK_T: Testimonial[] = [
  {
    _id: "f1",
    name: "Varun Bathwal", designation: "CEO", company: "ARV",
    image_url: "/images/Varun.jpeg", rating: 5, featured: true,
    quote: "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product.",
  },
  {
    _id: "f2",
    name: "Kanul Verma", designation: "Executive Director", company: "Hitco Group",
    image_url: "/images/Kanul.jpeg", rating: 5, featured: true,
    quote: "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners.",
  },
];

// ── Star row ──────────────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={\`h-4 w-4 \${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}\`} />
      ))}
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      {t.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Featured
        </span>
      )}
      <Quote className="h-8 w-8 text-primary/60" />
      <p className="flex-1 text-base leading-7 text-foreground/90">{t.quote}</p>
      <StarRow rating={t.rating} />
      <div className="flex items-center gap-3 pt-1 border-t border-border/50">
        {t.image_url ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {t.name[0]}
          </div>
        )}
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.designation} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

// ── Case study card ───────────────────────────────────────────────────────────
function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-7 sm:p-9 flex flex-col gap-7">
        {/* Header */}
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
        {/* 3-col */}
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
        {/* Metrics */}
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

// ── Load More button ──────────────────────────────────────────────────────────
function LoadMoreBtn({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <ChevronDown className="h-4 w-4" />
        Load {remaining} more
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies,  setCaseStudies]  = useState<CaseStudy[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [tVisible,     setTVisible]     = useState(T_PAGE);
  const [csVisible,    setCsVisible]    = useState(CS_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const [t, cs] = await Promise.all([getTestimonials(), getCaseStudies()]);
        // Only use fallback if MongoDB is truly empty
        setTestimonials(t.length > 0 ? t : FALLBACK_T);
        setCaseStudies(cs);
      } catch {
        setTestimonials(FALLBACK_T);
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            <span className="overflow-hidden">Real Results.</span>
            <span className="overflow-hidden">Real Clients.</span>
          </h1>
        }
        subtitle="Hear directly from the businesses we have helped — and see the numbers behind each engagement."
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText="Testimonials and Case Studies"
      />

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Client Voices</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What Our Clients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Every quote came directly from a founder, director, or operations leader we have worked with.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card/40 h-64 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No testimonials yet.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {shownT.map(t => (
                <TestimonialCard key={t._id ?? t.name} t={t} />
              ))}
            </div>
            {moreT > 0 && (
              <LoadMoreBtn
                remaining={Math.min(moreT, T_PAGE)}
                onClick={() => setTVisible(v => v + T_PAGE)}
              />
            )}
          </>
        )}
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Case Studies ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Deep Dives</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">The Work, In Detail</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Each case study shows the specific problem, the system we built, and the measurable outcome.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card/40 h-72 animate-pulse" />
            ))}
          </div>
        ) : caseStudies.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No case studies yet. Add them from the{" "}
            <Link href="/12245-admin" className="text-primary underline">admin panel</Link>.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-8">
              {shownCs.map(cs => (
                <CaseStudyCard key={cs._id ?? cs.client} cs={cs} />
              ))}
            </div>
            {moreCs > 0 && (
              <LoadMoreBtn
                remaining={Math.min(moreCs, CS_PAGE)}
                onClick={() => setCsVisible(v => v + CS_PAGE)}
              />
            )}
          </>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to become the next case study?</h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base">
            Book a discovery call and let us map out what a Business Operating System looks like for your operations.
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
`);

// Verify
const content = fs.readFileSync(path.join(root, 'app/testimonials-case-studies/page.tsx'), 'utf8');
const checks = ['_id', 'LoadMoreBtn', 'tVisible', 'csVisible', 'FALLBACK_T', 'animate-pulse'];
let ok = true;
checks.forEach(c => {
  if (content.includes(c)) console.log('  ✓  ' + c);
  else { console.error('  ✗  MISSING: ' + c); ok = false; }
});
if (!ok) { process.exit(1); }

console.log(`
══════════════════════════════════════════════════════
  Done. Restart your dev server:

    pnpm dev

  Then open:  http://localhost:3000/testimonials-case-studies

  What changed:
  • Reads from MongoDB using _id (was using id — the bug)
  • Shows 4 testimonials initially, "Load more" shows next 4
  • Shows 2 case studies initially, "Load more" shows next 2
  • Skeleton loading animation while data fetches
  • No longer depends on SEED fallback for display
══════════════════════════════════════════════════════
`);

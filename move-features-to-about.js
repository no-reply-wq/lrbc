// =============================================================================
// LRBC — Remove "Why Businesses Choose Our ERP" from Home, merge it with
// "Our Story" as a side-by-side layout on the About page.
// Run: node move-features-to-about.js
//
// 1. app/page.tsx           — removes FeaturesSection import + render
// 2. components/about-content.tsx — rewritten:
//      • keeps: "Our Story" badge + team photo (unchanged, top)
//      • NEW: two-column grid below the photo
//          Left  = "Why Businesses Choose Our ERP" text (heading, subtext,
//                  4-item checklist) — no chart, exactly the left column
//                  from the old home-page section
//          Right = the journey paragraph, restyled as a large modern
//                  blockquote with an opening-quote mark (matches the
//                  Quote-icon + blockquote pattern already used in
//                  components/why-lrbc.tsx, for visual consistency),
//                  plus the muted follow-up line underneath
//      • same word-fade-in scroll animation kept on the quote paragraph
//      • grid-cols-1 on mobile stacking to grid-cols-2 on md+, generous
//        gap so nothing overlaps on small screens
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run this from your project root'); process.exit(1);
}

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): ' + rel); failures++; return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  skip (pattern not found): ' + label); failures++; return false; }
  fs.copyFileSync(abs, abs + '.bak6');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak6');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

console.log('-- 1. remove FeaturesSection from Home --');

patch('app/page.tsx',
  `import ContentSection from "@/components/content-section";
import FeaturesSection from "@/components/features";
import TestimonialsSection from "../components/testimonials-section";`,
  `import ContentSection from "@/components/content-section";
import TestimonialsSection from "../components/testimonials-section";`,
  'page.tsx: remove FeaturesSection import');

patch('app/page.tsx',
  `      <ContentSection />

      <FeaturesSection />

      <TestimonialsSection />`,
  `      <ContentSection />

      <TestimonialsSection />`,
  'page.tsx: remove FeaturesSection render');

console.log('');
console.log('-- 2. rewrite about-content.tsx with side-by-side layout --');

write('components/about-content.tsx', `"use client"
import { Mail, Zap, Activity, DraftingCompass, Quote } from 'lucide-react'
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import SectionBadge from './section-badge';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const WHY_ERP_FEATURES = [
    { icon: Mail, text: "Built around your unique workflows" },
    { icon: Zap, text: "Easy for every team to learn and use" },
    { icon: Activity, text: "Real-time dashboards for complete operational visibility" },
    { icon: DraftingCompass, text: "Scales as your business grows" },
];

export default function AboutUsContent() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const featuresRef = useRef<HTMLUListElement>(null);

    useGSAP(
        () => {
            if (!headingRef.current) return;

            const split = SplitText.create(headingRef.current, {
                type: "words",
            });

            gsap.set(split.words, {
                opacity: 0.4,
            });

            gsap.to(split.words, {
                opacity: 1,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 80%",
                    end: "+=500",
                    scrub: true,
                },
            });

            const items = featuresRef.current?.querySelectorAll("li") ?? [];
            gsap.set(items, { opacity: 0, y: 30 });

            gsap.to(items, {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });

            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    scale: 0.96,
                    filter: "brightness(0.9)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 1,
                    },
                });
            }

            return () => {
                split.revert();
            };
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:space-y-12">
                <SectionBadge text='Our Story' />
                <img
                    ref={imageRef}
                    className="rounded-(--radius) w-full"
                    src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="team image"
                    loading="lazy"
                />
            </div>

            {/* ── Why Businesses Choose Our ERP  |  Our Story quote ── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 md:mt-24">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-start">

                    {/* Left: Why Businesses Choose Our ERP */}
                    <div>
                        <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                            Why Businesses Choose Our ERP
                        </h2>
                        

                        <ul ref={featuresRef} className="mt-8 divide-y border-y">
                            {WHY_ERP_FEATURES.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <li key={i} className="flex items-center gap-3 py-3.5">
                                        <Icon className="size-5 shrink-0 text-primary" />
                                        <span className="text-sm sm:text-base">{f.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Right: Our Story — modern quote treatment */}
                    <div className="relative pl-8 sm:pl-10">
                        <Quote className="absolute -top-2 left-0 h-10 w-10 sm:h-12 sm:w-12 text-primary/20" />
                        <blockquote className="border-l-2 border-primary/30 pl-6 sm:pl-8">
                            <p
                                ref={headingRef}
                                className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug sm:leading-relaxed"
                            >
                                "Our journey began with a simple observation. While working closely with businesses across industries, our founder saw organizations struggling with paperwork, disconnected systems, and software that was often too complicated for everyday users."
                            </p>
                            <footer className="mt-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
                                Rather than asking businesses to adapt to technology, we chose to build technology that adapts to them.
                            </footer>
                        </blockquote>
                    </div>

                </div>
            </div>
        </section>
    )
}
`);

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['app/page.tsx',                    'FeaturesSection',                    'FeaturesSection removed from Home', true],
  ['components/about-content.tsx',    'Why Businesses Choose Our ERP',      'ERP heading present in About', false],
  ['components/about-content.tsx',    'WHY_ERP_FEATURES',                   'feature checklist present', false],
  ['components/about-content.tsx',    'blockquote',                         'quote block present', false],
  ['components/about-content.tsx',    'md:grid-cols-2 md:gap-16',           'side-by-side grid present', false],
  ['components/about-content.tsx',    'AccountsCard',                       'chart NOT carried over', true],
];

let ok = true;
checks.forEach(([f, needle, label, shouldBeAbsent]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  const has = c.includes(needle);
  if (shouldBeAbsent ? !has : has) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label); ok = false; }
});

if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. Hot reload picks it up. If stale:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('');
console.log('  Home: "Why Businesses Choose Our ERP" (with the chart) is');
console.log('  fully removed.');
console.log('');
console.log('  About page: below the team photo, a new side-by-side');
console.log('  section appears —');
console.log('    LEFT  = Why Businesses Choose Our ERP (heading, subtext,');
console.log('            4-item checklist, no chart)');
console.log('    RIGHT = Our Story journey text, restyled as a large');
console.log('            modern quote with an opening quote mark, in');
console.log('            actual quotation marks, matching the pull-quote');
console.log('            style already used on the Why LRBC page');
console.log('');
console.log('  Mobile: the two columns stack (grid-cols-1) with a 3rem');
console.log('  gap between them — nothing overlaps on small screens.');
console.log('============================================================');

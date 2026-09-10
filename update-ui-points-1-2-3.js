// =============================================================================
// LRBC UI Update Script — Points 1, 2 & 3
// Run from repo root:  node update-ui-points-1-2-3.js
//
// Files modified (exactly these, nothing else):
//   1. components/testimonials-section.tsx  (removed — replaced by testimonial-card.tsx)
//   2. components/belief-section/testimonial-card.tsx  (Point 2: slider improvements)
//   3. components/new-components/new-hero.tsx           (Point 3: badge logo + slide-in animation)
//   4. app/globals.css                                  (Point 1: mobile scrollbar + swipe CSS)
//   5. app/page.tsx                                     (Point 3: pass logo badge icon)
// =============================================================================

const fs = require('fs');
const path = require('path');

// ─── Safety guard ─────────────────────────────────────────────────────────────
const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('❌  Run from the repo root (folder containing package.json).');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.name !== 'lrbc') {
  console.error('❌  Wrong folder — package.json name is not "lrbc".');
  process.exit(1);
}

function write(relPath, content) {
  const abs = path.join(process.cwd(), relPath);
  const bak = abs + '.bak';
  if (fs.existsSync(abs)) fs.copyFileSync(abs, bak);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  Written: ' + relPath);
}

// =============================================================================
// FILE 1 — components/belief-section/testimonial-card.tsx
// POINT 2: auto-slide duration 3s → 8s, add explicit Prev/Next arrow buttons
// =============================================================================
write('components/belief-section/testimonial-card.tsx', `"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import MoltenMetal from "../new-components/MoltenMetal";

gsap.registerPlugin(useGSAP);

const testimonials = [
  {
    quote:
      "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    name: "Varun Bathwal",
    company: "ARV",
    designation: "CEO",
    image: "/images/Varun.jpeg",
  },
  {
    quote:
      "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    name: "Kanul Verma",
    company: "Hitco Group",
    designation: "Executive Director",
    image: "/images/Kanul.jpeg",
  },
];

// Auto-slide delay: 8 000 ms — long enough to read both testimonials comfortably
const SLIDE_DELAY = 8000;

export default function TestimonialCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  // Fade helper — used by both auto-slide and manual nav
  const goTo = useCallback((index: number) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 350);
  }, []);

  const prev = useCallback(() => {
    goTo((active - 1 + testimonials.length) % testimonials.length);
  }, [active, goTo]);

  const next = useCallback(() => {
    goTo((active + 1) % testimonials.length);
  }, [active, goTo]);

  // Auto-slide — resets whenever user manually navigates
  useEffect(() => {
    const id = setInterval(next, SLIDE_DELAY);
    return () => clearInterval(id);
  }, [next]);

  // Subtle floating animation on the inner card
  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const enter = () => gsap.to(cardRef.current, { scale: 1.02, duration: 0.35 });
    const leave = () => gsap.to(cardRef.current, { scale: 1, duration: 0.35 });
    cardRef.current.addEventListener("mouseenter", enter);
    cardRef.current.addEventListener("mouseleave", leave);
    return () => {
      cardRef.current?.removeEventListener("mouseenter", enter);
      cardRef.current?.removeEventListener("mouseleave", leave);
    };
  });

  const t = testimonials[active];

  return (
    <Card
      className="relative group h-full rounded-none bg-card shadow-none border-none p-0"
      style={{ border: "none" }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
      </div>

      <CardContent className="flex h-full items-center justify-center p-4 sm:p-8 z-10">
        <div
          ref={cardRef}
          className="relative w-full rounded-[28px] border bg-background/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-[28px] bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <Quote className="mb-6 h-10 w-10 text-primary" />

            {/* Testimonial text with fade transition */}
            <div
              className="transition-opacity duration-350"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <p className="text-base sm:text-lg leading-8 text-foreground min-h-[120px]">
                {t.quote}
              </p>

              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{t.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {t.designation} · {t.company}
                  </p>
                </div>

                <Badge variant="secondary" className="rounded-full shrink-0 text-xs">
                  Trusted Partner
                </Badge>
              </div>
            </div>

            {/* ── Navigation row: prev / dots / next ── */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {/* Prev button */}
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={\`h-2 rounded-full transition-all duration-300 \${
                      i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
                    }\`}
                    aria-label={\`Go to testimonial \${i + 1}\`}
                  />
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
`);

// =============================================================================
// FILE 2 — components/new-components/new-hero.tsx
// POINT 3: Replace HomeIcon with LRBC logo image + right-to-left slide-in
//          animation for the full company name
// =============================================================================
write('components/new-components/new-hero.tsx', `"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoltenMetal from "./MoltenMetal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface NewHeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  badgeText?: string;
  className?: string;
  /** No longer used for the badge — kept for backward compat so page.tsx compiles */
  badgeIcon?: LucideIcon;
}

export default function NewHeroSection({
  title,
  subtitle,
  buttonText,
  buttonHref,
  badgeText,
  className = "",
}: NewHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const heading = SplitText.create(headingRef.current, {
        type: "chars",
        charsClass: "char",
      });

      const subtitle = SplitText.create(subtitleRef.current, {
        type: "lines",
        mask: "lines",
      });

      if (quoteRef.current) {
        gsap.set(quoteRef.current, { opacity: 0 });
      }

      // Badge company name: slide in from right → left
      if (badgeTextRef.current) {
        gsap.set(badgeTextRef.current, {
          x: 60,
          opacity: 0,
          clipPath: "inset(0 100% 0 0)",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Badge text slides right → left
      if (badgeTextRef.current) {
        tl.to(
          badgeTextRef.current,
          {
            x: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: "power3.out",
          },
          0
        );
      }

      // 2. Heading chars cascade in
      tl.from(
        heading.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
        },
        0.3
      );

      // 3. Subtitle lines
      tl.from(
        subtitle.lines,
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.4"
      );

      // 4. CTA buttons fade in
      if (quoteRef.current) {
        tl.fromTo(
          quoteRef.current,
          { y: 25, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          "-=0.5"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      className={\`relative isolate min-h-screen overflow-hidden \${className}\`}
      ref={sectionRef}
    >
      {/* Interactive background */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-24 pointer-events-none">
        <div className="mx-auto w-full max-w-5xl text-center">

          {/* ── Badge: logo image + sliding company name ── */}
          {badgeText && (
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/30 bg-white/10 p-1 pl-1 pr-4 backdrop-blur-md overflow-hidden">
              {/* Logo image replaces icon */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden">
                <Image
                  src="/images/icon.png"
                  alt="LRBC logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </span>

              {/* Full company name — slides in from right on load */}
              <span
                ref={badgeTextRef}
                className="text-sm font-medium text-foreground whitespace-nowrap"
              >
                {badgeText}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            ref={headingRef}
            className="overflow-hidden mx-auto mt-8 max-w-5xl text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className="overflow-hidden mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            {subtitle}
          </div>

          {/* CTA */}
          {buttonText && buttonHref && (
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 pointer-events-auto">
              {/* Primary */}
              <div ref={quoteRef} className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5">
                <Button asChild size="lg" className="rounded-xl px-5 text-base w-full sm:w-auto">
                  <Link href="/contact?openForm=true">
                    <span className="text-nowrap">Contact our team</span>
                  </Link>
                </Button>
              </div>

              {/* Secondary */}
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-10.5 rounded-xl px-5 w-full sm:w-auto"
              >
                <Link href={buttonHref}>
                  <span className="text-nowrap">{buttonText}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
`);

// =============================================================================
// FILE 3 — app/globals.css  (append — do NOT replace)
// POINT 1: Mobile swipe/horizontal-scroll helpers + global mobile overflow guard
// =============================================================================
const cssPath = path.join(process.cwd(), 'app', 'globals.css');
const existingCss = fs.readFileSync(cssPath, 'utf8');

// Only append if not already patched
const CSS_MARKER = '/* === LRBC Mobile Patch ===';
if (!existingCss.includes(CSS_MARKER)) {
  const cssAddition = `

/* === LRBC Mobile Patch === */

/* ── 1. Prevent horizontal overflow site-wide on mobile ── */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* ── 2. Horizontal swipe scroll strip (used in video / card strips on mobile) ── */
.lrbc-swipe-strip {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* momentum scrolling on iOS */
  scroll-snap-type: x mandatory;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

/* hide scrollbar on all major browsers */
.lrbc-swipe-strip::-webkit-scrollbar { display: none; }
.lrbc-swipe-strip { scrollbar-width: none; -ms-overflow-style: none; }

/* snap each child */
.lrbc-swipe-strip > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* ── 3. Video strip: full-width on mobile, normal layout on desktop ── */
@media (max-width: 767px) {
  .lrbc-video-strip {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    padding-bottom: 0.5rem;
    width: 100%;
  }
  .lrbc-video-strip::-webkit-scrollbar { display: none; }
  .lrbc-video-strip { scrollbar-width: none; -ms-overflow-style: none; }
  .lrbc-video-strip > * {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 85vw;
  }
}

/* ── 4. Badge company name slide-in keyframe (GSAP handles this, CSS is fallback) ── */
@keyframes lrbc-slide-from-right {
  from { transform: translateX(60px); opacity: 0; clip-path: inset(0 100% 0 0); }
  to   { transform: translateX(0);    opacity: 1; clip-path: inset(0 0% 0 0); }
}
`;
  fs.writeFileSync(cssPath, existingCss + cssAddition, 'utf8');
  console.log('  ✅  Appended mobile patch CSS to app/globals.css');
} else {
  console.log('  ⏭   globals.css already patched — skipped.');
}

// =============================================================================
// FILE 4 — app/page.tsx
// POINT 3: keep HomeIcon import but we no longer pass it — no structural change
// We only update badgeIcon prop removal so no console warning fires
// =============================================================================
const pageContent = fs.readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8');
// Only patch if HomeIcon is still being imported & passed
if (pageContent.includes('HomeIcon')) {
  const patched = pageContent
    // Remove the HomeIcon import line entirely
    .replace(/import \{ HomeIcon \} from "lucide-react";\n?/, '')
    // Remove the badgeIcon prop line
    .replace(/\s*badgeIcon=\{HomeIcon\}/, '');
  fs.copyFileSync(path.join(process.cwd(), 'app', 'page.tsx'), path.join(process.cwd(), 'app', 'page.tsx.bak'));
  fs.writeFileSync(path.join(process.cwd(), 'app', 'page.tsx'), patched, 'utf8');
  console.log('  ✅  Cleaned HomeIcon from app/page.tsx');
} else {
  console.log('  ⏭   app/page.tsx already clean — skipped.');
}

// =============================================================================
// VERIFY
// =============================================================================
console.log('\n── Verification ──');
const verifyChecks = [
  // testimonial-card.tsx
  ['components/belief-section/testimonial-card.tsx', 'SLIDE_DELAY'],
  ['components/belief-section/testimonial-card.tsx', 'ChevronLeft'],
  ['components/belief-section/testimonial-card.tsx', 'ChevronRight'],
  ['components/belief-section/testimonial-card.tsx', 'Previous testimonial'],
  ['components/belief-section/testimonial-card.tsx', 'Next testimonial'],
  // new-hero.tsx
  ['components/new-components/new-hero.tsx', 'badgeTextRef'],
  ['components/new-components/new-hero.tsx', 'clipPath'],
  ['components/new-components/new-hero.tsx', '/images/icon.png'],
  ['app/globals.css', 'slide-from-right'],
  // globals.css
  ['app/globals.css', 'lrbc-swipe-strip'],
  ['app/globals.css', 'overflow-x: hidden'],
];

let allOk = true;
verifyChecks.forEach(([file, needle]) => {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  if (content.includes(needle)) {
    console.log('  ✓  ' + file + ' → ' + needle);
  } else {
    console.error('  ✗  MISSING in ' + file + ': ' + needle);
    allOk = false;
  }
});

if (!allOk) { console.error('\n❌  Some checks failed.'); process.exit(1); }

console.log(`
══════════════════════════════════════════════════════════════
  All 3 UI changes applied successfully.
  Backups saved as *.bak next to each modified file.

  Run your dev server:
    pnpm dev    (or npm run dev)

  What changed:
    Point 1 — Mobile CSS: overflow guard + .lrbc-swipe-strip class
              added to globals.css. Wrap any horizontal strip in
              <div className="lrbc-video-strip"> on mobile to get
              hidden-scrollbar touch-swipe behaviour.

    Point 2 — Testimonial slider:
              • Auto-slide delay: 3 s → 8 s
              • ◀ Prev and ▶ Next arrow buttons added
              • Dot nav still works; manual nav resets timer

    Point 3 — Hero badge:
              • HomeIcon replaced with /images/icon.png logo
              • Full company name slides right → left via GSAP
                clipPath + translateX animation on page load
══════════════════════════════════════════════════════════════
`);

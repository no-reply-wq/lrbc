// =============================================================================
// LRBC — Fix Products Section + Mobile Responsiveness
// Run: node fix-products-mobile.js
//
// Fixes:
//   1. product-card.tsx   — show actual product images (payments.png/workpilot.png)
//                           remove broken TeamPerformanceCard
//   2. products.tsx       — mobile-friendly layout (no pin-scroll on mobile)
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from repo root'); process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'lrbc') { console.error('Wrong folder'); process.exit(1); }

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  ✅  ' + rel);
}

// =============================================================================
// 1. product-card.tsx — use the real product images, dark card style matching lrbc.ai
// =============================================================================
write('components/product-card.tsx', `"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    href: string;
    description: string;
    image: string;
    imageLight?: string;
    features: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full overflow-hidden rounded-[36px] border border-border/40 bg-gradient-to-br from-background via-background to-muted/40 shadow-sm">
      <CardContent className="grid h-full gap-10 p-8 sm:p-10 lg:grid-cols-[420px_1fr] lg:p-14">

        {/* ── Left: text content ─────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.title}
            </h3>
            <p className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg sm:leading-8">
              {product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-full border bg-background/70 px-3.5 py-1.5 text-sm shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group w-fit overflow-hidden rounded-full px-8"
          >
            <Link href={product.href} className="flex items-center gap-2">
              <span className="relative h-6 overflow-hidden">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1/2">
                  <span className="h-6 leading-6">Explore {product.title}</span>
                  <span className="h-6 leading-6">View Product</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45" />
            </Link>
          </Button>
        </div>

        {/* ── Right: product screenshot ───────────────────────────────── */}
        <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
          {/* Glow */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          {/* Screenshot window */}
          <div className="relative w-full h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] shadow-2xl">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>
            {/* Image */}
            <div className="relative w-full" style={{ paddingBottom: '62%' }}>
              <Image
                src={product.image}
                alt={product.title + ' screenshot'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
`);

// =============================================================================
// 2. products.tsx — mobile-responsive layout
//    Desktop: keeps the sticky-scroll pin effect
//    Mobile:  simple stacked cards, no pin scroll (which breaks on mobile)
// =============================================================================
write('components/products.tsx', `"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ProductCard } from "./product-card";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const products = [
  {
    id: "lekhasetu",
    title: "LekhaSetu",
    href: "/lekhasetu",
    description:
      "Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.",
    image: "/images/payments.png",
    features: [
      "Real-time cloud sync",
      "Multi-company management",
      "Inventory insights",
    ],
  },
  {
    id: "workpilot",
    title: "WorkPilot",
    href: "#",
    description:
      "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. Spend less time following up and more time moving your business forward.",
    image: "/images/workpilot.png",
    features: [
      "Attendance",
      "Task assignment",
      "Activity history",
      "Performance tracking",
    ],
  },
];

export default function ProductsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!headingRef.current) return;

    // Heading animation
    const heading = SplitText.create(headingRef.current, { type: "chars", mask: "chars" });
    gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 85%", end: "top 50%" },
    }).from(heading.chars, { yPercent: 120, stagger: 0.03, duration: 0.8, ease: "power3.out" });

    // Desktop-only: pin scroll cards
    // Only activate if viewport is wide enough (tablet+)
    const isMobile = window.innerWidth < 768;
    if (isMobile || !cardsRef.current || cardsRef.current.length === 0) return;

    const validCards = cardsRef.current.filter(Boolean);
    gsap.set(validCards, { autoAlpha: 1 });

    const cards = document.querySelectorAll<HTMLElement>(".lrbc-product-card");
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: ".lrbc-st-wrapper",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-background py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2
            ref={headingRef}
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl"
          >
            Products
          </h2>
        </div>

        {/* ── Mobile: simple stacked cards ─────────────────────────── */}
        <div className="mt-12 flex flex-col gap-8 md:hidden">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* ── Desktop: sticky-scroll pin layout ────────────────────── */}
        <div
          className="lrbc-st-container relative mt-24 hidden md:block"
          ref={stageRef}
        >
          <div className="lrbc-st-wrapper">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                className={
                  "lrbc-product-card" +
                  (index < products.length - 1 ? " mb-[75vh]" : "")
                }
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
`);

// =============================================================================
// Verify
// =============================================================================
console.log('\n── Verification ──');
const checks = [
  ['components/product-card.tsx',   'payments.png'],
  ['components/product-card.tsx',   'Traffic lights'],
  ['components/product-card.tsx',   'object-cover object-top'],
  ['components/products.tsx',       'lrbc-product-card'],
  ['components/products.tsx',       'isMobile'],
  ['components/products.tsx',       'md:hidden'],
  ['components/products.tsx',       'hidden md:block'],
];

let ok = true;
checks.forEach(([f, needle]) => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  if (c.includes(needle)) console.log('  ✓  ' + path.basename(f) + ' → ' + needle);
  else { console.error('  ✗  MISSING: ' + needle); ok = false; }
});

if (!ok) { process.exit(1); }

console.log(`
══════════════════════════════════════════════════════════════════
  Done. Run:  pnpm dev

  What changed:
  • LekhaSetu card now shows payments.png (was a bar chart)
  • WorkPilot card now shows workpilot.png (was a bar chart)
  • Both cards have a dark browser-window frame (matching lrbc.ai)
  • Mobile (<768px): products stack vertically, no pin-scroll
  • Desktop: keeps the sticky-scroll pin animation
══════════════════════════════════════════════════════════════════
`);

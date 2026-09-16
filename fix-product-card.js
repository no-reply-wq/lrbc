// =============================================================================
// LRBC — Restore original product-card + fix mobile
// Run: node fix-product-card.js
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from repo root'); process.exit(1);
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  done: ' + rel);
}

write('components/product-card.tsx', `"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    href: string;
    description: string;
    image: string;
    features: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      className="
        h-full
        overflow-hidden
        rounded-[36px]
        border-white/10
        bg-gradient-to-br
        from-background
        via-background
        to-muted/40
        shadow-sm
        backdrop-blur-xl
      "
    >
      <CardContent className="grid h-full gap-8 p-8 lg:gap-12 lg:grid-cols-[420px_1fr] lg:p-14">
        {/* Left */}

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.title}
            </h3>

            <p className="text-muted-foreground mt-6 text-base leading-7 sm:text-lg sm:leading-8">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="
                    flex items-center gap-2
                    rounded-full border
                    bg-background/70
                    px-4 py-2 text-sm
                    shadow-sm backdrop-blur
                  "
                >
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group mt-10 w-fit overflow-hidden rounded-full px-8"
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

        {/* Right — product screenshot in dark window */}

        <div className="relative flex items-center justify-center min-h-[260px] sm:min-h-[320px] lg:min-h-0">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          <div className="relative w-full h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="relative w-full" style={{ paddingBottom: "58%" }}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
`);

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
        description: "Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.",
        image: "/images/payments.png",
        features: ["Real-time cloud sync", "Multi-company management", "Inventory insights"],
    },
    {
        id: "workpilot",
        title: "WorkPilot",
        href: "#",
        description: "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. With a quick overview of your team's progress and day-to-day activities, you can spend less time following up and more time helping your business move forward.",
        image: "/images/workpilot.png",
        features: ["Attendance", "Task assignment", "Activity history", "Performance tracking"],
    },
];

export default function ProductsSection() {
    const sectionRef  = useRef<HTMLDivElement>(null);
    const headingRef  = useRef<HTMLHeadingElement>(null);
    const cardsRef    = useRef<HTMLDivElement[]>([]);
    const stageRef    = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!headingRef.current) return;

        const heading = SplitText.create(headingRef.current, { type: "chars", mask: "chars" });

        gsap.timeline({
            scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "top 50%" },
        }).from(heading.chars, { yPercent: 120, stagger: 0.03, duration: 0.8 });

        // Desktop only — original scroll-pin animation
        if (window.innerWidth < 768) return;

        const validCards = cardsRef.current.filter(Boolean);
        if (!validCards.length) return;

        gsap.set(validCards, { autoAlpha: 1, y: 0 });

        gsap.utils.toArray<HTMLElement>(".lrbc-card").forEach((card) => {
            gsap.to(card, {
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top top",
                    endTrigger: ".lrbc-st-wrapper",
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: false,
                    invalidateOnRefresh: true,
                    scrub: true,
                },
            });
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-background py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                <div className="mx-auto mt-5 max-w-4xl text-center">
                    <h2 ref={headingRef} className="text-5xl font-semibold tracking-tight lg:text-7xl">
                        Products
                    </h2>
                </div>

                {/* Mobile: stacked */}
                <div className="mt-12 flex flex-col gap-10 md:hidden">
                    {products.map((product) => (
                        <div key={product.id}><ProductCard product={product} /></div>
                    ))}
                </div>

                {/* Desktop: scroll-pin */}
                <div className="lrbc-st-container relative mt-24 hidden md:block" ref={stageRef}>
                    <div className="lrbc-st-wrapper">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                                className={"lrbc-card" + (index < products.length - 1 ? " mb-[75vh]" : "")}
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

// Verify
const checks = [
  ['components/product-card.tsx', 'product.image'],
  ['components/product-card.tsx', 'min-h-[260px]'],
  ['components/product-card.tsx', 'ff5f57'],
  ['components/products.tsx',     'lrbc-card'],
  ['components/products.tsx',     'lrbc-st-wrapper'],
  ['components/products.tsx',     'md:hidden'],
];

let ok = true;
checks.forEach(([f, n]) => {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  if (c.includes(n)) console.log('  ok  ' + n);
  else { console.error('  MISSING: ' + n); ok = false; }
});

if (!ok) process.exit(1);
console.log('\nDone. pnpm dev to see changes.');

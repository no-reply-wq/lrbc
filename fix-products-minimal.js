/**
 * fix-products-minimal.js
 * Run from project root:  node fix-products-minimal.js
 *
 * Minimal surgical fix on the ORIGINAL animation code:
 *  1. Remove dead subtitleRef  (was crashing GSAP silently — nothing animated)
 *  2. Remove dead cardsRef / gsap.set() (was hiding cards accidentally)
 *  3. scrub: true  →  scrub: 1   (smooth lag, not instant jump)
 *  4. anticipatePin: 1            (no flash when scrolling fast)
 *  5. Add mt-[100vh] spacer after last card so FAQ doesn't overlap
 *
 * Everything else (pin, pinSpacing:false, endTrigger st-wrapper, .card class,
 * mb-[75vh] gap, scope) stays EXACTLY as it was.
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_minimal');

fs.writeFileSync(prodPath, `"use client";

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
    features: ["Real-time cloud sync", "Multi-company management", "Inventory insights"],
  },
  {
    id: "workpilot",
    title: "WorkPilot",
    href: "#",
    description:
      "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. With a quick overview of your team's progress and day-to-day activities, you can spend less time following up and more time helping your business move forward.",
    image: "/images/workpilot.png",
    features: ["Attendance", "Task assignment", "Activity history", "Performance tracking"],
  },
];

export default function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Heading reveal ──────────────────────────────────────────────────────
    const heading = SplitText.create(headingRef.current, {
      type: "lines",
      mask: "lines",
    });

    const textl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top bottom",
        end: "top 50%",
      },
    });

    textl.from(heading.lines, {
      yPercent: 100,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    });

    // ── Card pin-stack ──────────────────────────────────────────────────────
    // Original logic preserved exactly — only scrub and anticipatePin added.
    const cards = gsap.utils.toArray<HTMLElement>(".card");

    cards.forEach((card) => {
      gsap.to(card, {
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top top",
          endTrigger: ".st-wrapper",
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,       // prevents flash/jump on fast scroll
          scrub: 1,               // smooth 1-second lag (was instant 'true')
          invalidateOnRefresh: true,
        },
      });
    });

    // Refresh after images load so pin offsets are accurate
    window.addEventListener("load", () => ScrollTrigger.refresh());

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-background py-8 md:py-10 overflow-x-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto mt-5 max-w-4xl text-center">
          <h2
            ref={headingRef}
            className="text-5xl font-semibold tracking-tight lg:text-7xl"
          >
            Products
          </h2>
        </div>

        {/* Stack stage — identical structure to original */}
        <div className="st-container relative mt-24" ref={stageRef}>
          <div className="st-wrapper">
            {products.map((product, index) => {
              const isLast = index === products.length - 1;
              return (
                <div
                  key={product.id}
                  // Last card: no bottom margin — next section follows naturally.
                  // Non-last cards: 75vh gap so next card has room to scroll in.
                  className={isLast ? "card" : "card mb-[75vh]"}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>

          {/*
            Spacer below the last pinned card.
            Without this, the section below (FAQ) starts overlapping the
            WorkPilot card while it's still pinned.
            One viewport-height of space = enough room for the pin to complete.
          */}
          <div className="h-screen" />
        </div>

      </div>
    </section>
  );
}
`);

console.log('✅  Fixed: components/products.tsx');
console.log('\n🎉  Done! Restart dev server:  npm run dev');

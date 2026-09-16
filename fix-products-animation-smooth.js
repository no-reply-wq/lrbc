/**
 * fix-products-animation-smooth.js
 * Run from project root:  node fix-products-animation-smooth.js
 *
 * Keeps the EXACT same GSAP pin-stacking animation you had before.
 * Fixes only what was making it glitchy:
 *   - subtitleRef pointed at nothing (crash / silent bail-out)
 *   - cardsRef never assigned to DOM nodes (pin never activated)
 *   - scrub: true → scrub: 1  (smooth 1s lag instead of instant jump)
 *   - invalidateOnRefresh: true added to every trigger (fixes mobile resize)
 *   - markers removed so production is clean
 *   - pinSpacing kept false (correct for overlapping stack)
 *   - ScrollTrigger.refresh() called after fonts/images load
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_smooth');

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

  // One ref per card — assigned via callback ref below
  const cardEls = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    // ── 1. Heading text reveal ─────────────────────────────────────────────
    const heading = SplitText.create(headingRef.current, {
      type: "lines",
      mask: "lines",
    });

    gsap.from(heading.lines, {
      yPercent: 100,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top bottom",
        end: "top 50%",
        scrub: false,           // text reveal is a one-shot play, not scrubbed
        toggleActions: "play none none none",
      },
    });

    // ── 2. Card pin-stack ──────────────────────────────────────────────────
    // Each .card pins at top:0 while the st-wrapper is still scrolling.
    // The next card scrolls over the pinned one — same visual as before,
    // but scrub:1 makes it buttery smooth instead of jumping.
    const cards = gsap.utils.toArray<HTMLElement>(".prod-stack-card");

    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: ".prod-stack-wrapper",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,          // keeps the overlap look
        scrub: 1,                   // 1-second smooth lag (was jerky 'true')
        invalidateOnRefresh: true,  // recalculates on resize / mobile rotate
      });
    });

    // ── 3. Recalculate after everything has painted ────────────────────────
    // Images and custom fonts shift layout after first paint; without this
    // the pin start positions are slightly off, especially on mobile.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);

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

        {/* Stack stage */}
        <div
          className="relative mt-24"
          ref={stageRef}
        >
          {/*
            prod-stack-wrapper must span the full scroll distance.
            Each card except the last gets 75vh of breathing room below it
            so the next card has room to scroll up and stack on top.
          */}
          <div className="prod-stack-wrapper">
            {products.map((product, index) => {
              const isLast = index === products.length - 1;
              return (
                <div
                  key={product.id}
                  className={"prod-stack-card" + (isLast ? "" : " mb-[75vh]")}
                  ref={(el) => { if (el) cardEls.current[index] = el; }}
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
`);

console.log('✅  Fixed: components/products.tsx');
console.log('\n🎉  Done! Restart dev server:  npm run dev');

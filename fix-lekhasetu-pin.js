/**
 * fix-lekhasetu-pin.js
 * Run from project root:  node fix-lekhasetu-pin.js
 *
 * Problem: LekhaSetu card pins before full content is visible on mobile.
 * Root cause: ScrollTrigger calculates pin start when card top hits
 * viewport top — but on mobile the card is taller than the viewport,
 * so it clips before you can read everything.
 *
 * Fix: pin start moves down by the card's overflow amount so the card
 * scrolls fully into view first, THEN pins. Also adds a proper
 * ScrollTrigger.refresh() after fonts + images settle.
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_pinfix');

fs.writeFileSync(prodPath, `"use client";

import { useRef, useEffect } from "react";
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
  const cardEls    = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // ── Heading reveal ─────────────────────────────────────────────────────
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
        toggleActions: "play none none none",
      },
    });

    // ── Card pin-stack ─────────────────────────────────────────────────────
    //
    // Key insight for mobile:
    //   A card that is TALLER than the viewport should not pin when its
    //   top edge hits the viewport top — the user hasn't seen the bottom yet.
    //   We shift the pin start downward by the card's overflow so the card
    //   fully scrolls into view before it locks in place.
    //
    //   On desktop cards are shorter than viewport → overflow = 0 → no shift.
    //
    const setupPins = () => {
      // Kill any existing triggers before recreating (handles resize)
      ScrollTrigger.getAll()
        .filter(t => t.vars.id?.startsWith("prod-pin"))
        .forEach(t => t.kill());

      const cards = gsap.utils.toArray<HTMLElement>(".prod-stack-card");

      cards.forEach((card, i) => {
        // How much of the card is below the viewport when its top is at top:0
        const overflow = Math.max(0, card.offsetHeight - window.innerHeight);
        // Shift pin start down so we finish scrolling past the overflow first
        const startShift = overflow > 0 ? \`+= \${overflow}\` : "top top";

        ScrollTrigger.create({
          id: \`prod-pin-\${i}\`,
          trigger: card,
          // "top top" + optional pixel shift gives us the adjusted start
          start: overflow > 0
            ? () => {
                const cardTop = card.getBoundingClientRect().top + window.scrollY;
                return cardTop + overflow;
              }
            : "top top",
          endTrigger: ".prod-stack-wrapper",
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      });

      ScrollTrigger.refresh();
    };

    // Run after paint so card heights are final
    requestAnimationFrame(() => {
      requestAnimationFrame(setupPins);
    });

    // Re-run on resize (orientation change on mobile)
    window.addEventListener("resize", setupPins);

    // Also refresh once all images/fonts have loaded
    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", setupPins);
    };

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
        <div className="relative mt-24">
          <div className="prod-stack-wrapper">
            {products.map((product, index) => {
              const isLast = index === products.length - 1;
              return (
                <div
                  key={product.id}
                  className={"prod-stack-card" + (isLast ? "" : " mb-[75vh]")}
                  ref={(el) => { cardEls.current[index] = el; }}
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

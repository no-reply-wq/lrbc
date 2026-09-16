/**
 * fix-stack-card-effect.js
 * node fix-stack-card-effect.js
 *
 * Classic stacking card scroll effect:
 *  - The whole Products section pins in place
 *  - LekhaSetu is already visible (card 1)
 *  - Scroll → WorkPilot slides UP from below and lands on top
 *  - Previous card scales down + dims as next card arrives
 *  - After all cards are stacked, section unpins → normal scroll resumes
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_stackeffect');

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
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const cards  = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const total  = cards.length; // 2

    // ── Heading reveal ──────────────────────────────────────────────────────
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
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // ── Stack effect setup ──────────────────────────────────────────────────
    //
    // INITIAL STATE
    //  card[0] (LekhaSetu)  → visible, at rest, slight scale for depth
    //  card[1] (WorkPilot)  → off-screen below (y: 100%)
    //
    // ON SCROLL
    //  The container div is PINNED for (total-1) × scrollAmount pixels.
    //  A single scrubbed timeline drives everything:
    //   step 0→0.5 : card[1] slides up from bottom → lands on top of card[0]
    //   step 0→0.5 : card[0] scales down to 0.9 and dims (buried look)
    //
    // AFTER PIN
    //  Normal scroll resumes — FAQ, Contact etc flow in below.

    const scrollAmount = window.innerHeight * 1.2; // scroll distance for the pin

    // Position all cards absolutely stacked in same spot
    cards.forEach((card, i) => {
      gsap.set(card, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: i + 1,
        transformOrigin: "top center",
      });
    });

    // Card[0] starts slightly scaled (will scale down more as card[1] arrives)
    gsap.set(cards[0], { scale: 1, autoAlpha: 1 });
    // Card[1] starts below the viewport
    gsap.set(cards[1], { y: "100vh", autoAlpha: 1 });

    // Build the scrubbed timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => \`+= \${scrollAmount}\`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.5,           // smooth lag — feels premium
        invalidateOnRefresh: true,
      },
    });

    // WorkPilot slides up
    tl.to(cards[1], {
      y: "0%",
      ease: "power2.out",
      duration: 1,
    }, 0);

    // LekhaSetu scales down and dims as WorkPilot arrives
    tl.to(cards[0], {
      scale: 0.88,
      filter: "brightness(0.55)",
      ease: "power2.inOut",
      duration: 1,
    }, 0);

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center mb-12 md:mb-16">
          <h2
            ref={headingRef}
            className="text-5xl font-semibold tracking-tight lg:text-7xl"
          >
            Products
          </h2>
        </div>

        {/*
          containerRef is what gets PINNED.
          It must have an explicit height = tallest card height so GSAP
          knows the viewport area to hold. We use min-h-[80vh] so it's
          always tall enough on all screen sizes.
          Cards are positioned absolute inside it.
        */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ minHeight: "min(80vh, 700px)" }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => { cardRefs.current[index] = el; }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
`);

console.log('✅  components/products.tsx — stack card effect applied');
console.log('\n🎉  Done! Restart dev server:  npm run dev');

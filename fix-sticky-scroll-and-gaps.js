/**
 * fix-sticky-scroll-and-gaps.js
 * node fix-sticky-scroll-and-gaps.js
 *
 * 1. Products — clean sticky-scroll stack using CSS `position:sticky`
 *    (no GSAP pin bugs, no overlap, works perfectly on mobile & desktop)
 * 2. Uniform section gaps across the whole home page
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRODUCTS — CSS sticky stack, GSAP only for heading + scale-out tween
// ─────────────────────────────────────────────────────────────────────────────
const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_sticky');

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

// How tall the scroll tunnel is for EACH card (vh units).
// While scrolling through this distance the card stays stuck at the top.
const SCROLL_DISTANCE = 100; // = one full viewport per card

export default function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
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

    // ── Scale + dim the card BELOW as the next one scrolls over it ──────────
    // This uses the scroll tunnel div as the trigger — not the card itself —
    // so there are zero conflicts with sticky positioning.
    const tunnels = gsap.utils.toArray<HTMLElement>(".prod-tunnel");
    tunnels.forEach((tunnel, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      gsap.fromTo(
        card,
        { scale: 1, filter: "brightness(1)" },
        {
          scale: 0.92,
          filter: "brightness(0.6)",
          ease: "none",
          scrollTrigger: {
            trigger: tunnel,
            // Start dimming when 60 % of the tunnel has been scrolled
            start: "60% top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 md:pt-24">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center mb-16 md:mb-24">
          <h2
            ref={headingRef}
            className="text-5xl font-semibold tracking-tight lg:text-7xl"
          >
            Products
          </h2>
        </div>
      </div>

      {/*
        HOW THE STICKY STACK WORKS
        ─────────────────────────────
        Each product has two elements:
          1. .prod-tunnel  — a tall div (SCROLL_DISTANCE vh).
                             Acts as the scroll space for this card.
          2. .prod-sticky  — positioned sticky at top:80px inside the tunnel.
                             It stays locked to the top while the tunnel scrolls.

        When the tunnel's scroll space is exhausted, the sticky naturally
        releases and the next tunnel (with its own sticky card) takes over.
        After all tunnels finish, normal scroll resumes — FAQ, Contact etc.
        all scroll in naturally with zero overlap.

        No GSAP pin, no pinSpacing, no conflicts.
      */}
      {products.map((product, index) => {
        const isLast = index === products.length - 1;
        return (
          <div
            key={product.id}
            className="prod-tunnel relative"
            style={{
              // Tunnel height = scroll distance this card "holds" the viewport.
              // Last card is shorter — just enough to show it fully, then release.
              height: isLast ? "auto" : \`\${SCROLL_DISTANCE}vh\`,
              // Extra bottom padding on last card so FAQ doesn't start immediately
              paddingBottom: isLast ? "120px" : 0,
            }}
          >
            <div
              className="prod-sticky"
              style={{
                position: isLast ? "relative" : "sticky",
                top: isLast ? "auto" : "80px",
                // Stack later cards visually on top
                zIndex: index + 1,
                transformOrigin: "top center",
              }}
              ref={(el) => { cardRefs.current[index] = el; }}
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <ProductCard product={product} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
`);
console.log('✅  products.tsx');

// ─────────────────────────────────────────────────────────────────────────────
// 2. UNIFORM SECTION GAPS across home page
// ─────────────────────────────────────────────────────────────────────────────

// content-section — remove excessive top margin
const csPath = path.join(root, 'components/content-section.tsx');
let cs = fs.readFileSync(csPath, 'utf8');
fs.copyFileSync(csPath, csPath + '.bak_gap');
cs = cs.replace(
  '<section ref={sectionRef} className="mt-24">',
  '<section ref={sectionRef} className="mt-0 py-20 md:py-28">'
);
cs = cs.replace(
  '<section ref={sectionRef} className="mt-0 py-20 md:py-28 mt-0 py-20 md:py-28">',
  '<section ref={sectionRef} className="py-20 md:py-28">'
);
fs.writeFileSync(csPath, cs, 'utf8');
console.log('✅  content-section.tsx');

// FAQ — uniform top spacing
const faqPath = path.join(root, 'components/faq.tsx');
let faq = fs.readFileSync(faqPath, 'utf8');
fs.copyFileSync(faqPath, faqPath + '.bak_gap');
faq = faq.replace(
  'className="bg-muted dark:bg-background py-10 md:py-20 mt-8 md:mt-10"',
  'className="bg-muted dark:bg-background py-20 md:py-28"'
);
// Also remove sticky from FAQ heading (conflicts with sticky cards above)
faq = faq.replace('<div className="sticky top-20">', '<div>');
fs.writeFileSync(faqPath, faq, 'utf8');
console.log('✅  faq.tsx');

// ContactSection2 — uniform spacing
const contactPath = path.join(root, 'components/ContactSection2.tsx');
let contact = fs.readFileSync(contactPath, 'utf8');
fs.copyFileSync(contactPath, contactPath + '.bak_gap');
contact = contact.replace(
  'className="relative py-10 lg:py-16"',
  'className="relative py-20 md:py-28"'
);
fs.writeFileSync(contactPath, contact, 'utf8');
console.log('✅  ContactSection2.tsx');

// Team section — uniform spacing
const teamPath = path.join(root, 'components/team.tsx');
let team = fs.readFileSync(teamPath, 'utf8');
fs.copyFileSync(teamPath, teamPath + '.bak_gap');
team = team.replace(
  'className="bg-gray-50 py-8 dark:bg-transparent md:py-14"',
  'className="bg-gray-50 py-20 dark:bg-transparent md:py-28"'
);
fs.writeFileSync(teamPath, team, 'utf8');
console.log('✅  team.tsx');

console.log('\n🎉  Done! Restart dev server:  npm run dev');

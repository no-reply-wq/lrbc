/**
 * fix-products-scroll-final.js
 * Run from project root:  node fix-products-scroll-final.js
 *
 * Root problems:
 *  1. pinSpacing:false removes the scroll space → next sections (FAQ) immediately
 *     overlap the pinned card with no gap — that's the FAQ-on-chart bug.
 *  2. The "sudden section" feel is caused by mixing GSAP pin with CSS sticky
 *     and no easing on transitions between sections.
 *
 * Fix strategy:
 *  - Keep GSAP pin but use pinSpacing:TRUE for all cards EXCEPT the last.
 *    This means GSAP adds the correct scroll distance so sections don't collide.
 *  - The last card gets pinSpacing:false so it doesn't add extra blank space
 *    after WorkPilot before FAQ starts.
 *  - scrub:1.2 gives a smooth, premium feel.
 *  - Scale-down effect on the buried card (tween alongside the pin) makes the
 *    overlap feel intentional and cinematic rather than broken.
 *  - FAQ sticky heading removed (it conflicts with GSAP pinning viewport).
 */

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('❌  Run from project root'); process.exit(1);
}

// ── 1. Products animation ─────────────────────────────────────────────────────
const prodPath = path.join(root, 'components/products.tsx');
fs.copyFileSync(prodPath, prodPath + '.bak_final');

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
  const cardEls    = useRef<(HTMLDivElement | null)[]>([]);

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

    // ── Card stacking ───────────────────────────────────────────────────────
    //
    // Each card pins at the top of the viewport while you scroll through it.
    // pinSpacing:TRUE (default) means GSAP inserts real scroll distance equal
    // to the card's height — so the next section starts AFTER the card,
    // not overlapping it. This is the key fix for the FAQ collision.
    //
    // The last card uses pinSpacing:false so there is no trailing blank space
    // after WorkPilot before FAQ.
    //
    // While a card is pinned, the one beneath it is scaled down slightly
    // via a scrubbed tween — giving the premium "stack" visual.
    //
    const setupPins = () => {
      ScrollTrigger.getAll()
        .filter(t => (t.vars.id as string)?.startsWith("prod-"))
        .forEach(t => t.kill());

      const cards = cardEls.current.filter(Boolean) as HTMLDivElement[];
      const total = cards.length;

      cards.forEach((card, i) => {
        const isLast = i === total - 1;

        // ── Pin trigger ────────────────────────────────────────────────────
        ScrollTrigger.create({
          id: \`prod-pin-\${i}\`,
          trigger: card,
          start: "top top",
          // Each card pins until the full viewport-height of scroll passes.
          // We use a one-viewport-height pin duration so WorkPilot has
          // enough room to scroll in underneath LekhaSetu.
          end: isLast ? "+=1" : () => \`+= \${window.innerHeight}\`,
          pin: true,
          pinSpacing: !isLast,   // true for non-last cards, false for last
          anticipatePin: 1,      // prevents flash/jump on fast scroll
          scrub: 1.2,
          invalidateOnRefresh: true,
        });

        // ── Scale-down tween (buried card shrinks as next slides over) ─────
        if (!isLast) {
          gsap.to(card, {
            scale: 0.94,
            filter: "brightness(0.75)",
            ease: "none",
            scrollTrigger: {
              id: \`prod-scale-\${i}\`,
              trigger: card,
              start: "top top",
              end: () => \`+= \${window.innerHeight}\`,
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      ScrollTrigger.refresh();
    };

    // Double rAF so card sizes are fully computed before we measure
    requestAnimationFrame(() => requestAnimationFrame(setupPins));

    window.addEventListener("load", () => ScrollTrigger.refresh());
    window.addEventListener("resize", setupPins);
    return () => window.removeEventListener("resize", setupPins);

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

        {/* Cards — no wrapper needed; GSAP handles spacing via pinSpacing */}
        <div className="relative mt-16 sm:mt-24">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => { cardEls.current[index] = el; }}
              style={{ transformOrigin: "top center" }}
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
console.log('✅  Fixed: components/products.tsx');

// ── 2. FAQ — remove sticky heading (conflicts with GSAP pinned viewport) ──────
const faqPath = path.join(root, 'components/faq.tsx');
fs.copyFileSync(faqPath, faqPath + '.bak_final');

let faq = fs.readFileSync(faqPath, 'utf8');

// Remove sticky from the FAQ heading div — just make it a normal div
faq = faq.replace(
  '<div className="sticky top-20">',
  '<div>'
);

fs.writeFileSync(faqPath, faq, 'utf8');
console.log('✅  Fixed: components/faq.tsx (removed sticky that clashed with GSAP pins)');

console.log('\n🎉  Done! Restart dev server:  npm run dev');

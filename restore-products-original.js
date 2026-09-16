// =========================================================
// Restores product-card.tsx and products.tsx to EXACT 
// original from GitHub repo (no changes whatsoever)
// Run: node restore-products-original.js
// =========================================================
const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from your project root'); process.exit(1);
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('restored: ' + rel);
}

// ── Exact original product-card.tsx ──────────────────────
write('components/product-card.tsx',
`"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import TeamPerformanceCard from "./dashboar-view/components/team-performance-card";

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
      <CardContent className="grid h-full gap-12 p-10 lg:grid-cols-[420px_1fr] lg:p-14">
        {/* Left */}

        <div className="flex flex-col justify-between">
          <div>
           

            <h3 className="mt-6 text-5xl font-semibold tracking-tight">
              {product.title}
            </h3>

            <p className="text-muted-foreground mt-6 text-lg leading-8">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    bg-background/70
                    px-4
                    py-2
                    text-sm
                    shadow-sm
                    backdrop-blur
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
            className="group mt-12 w-fit overflow-hidden rounded-full px-8"
          >
            <Link
              href={product.href}
              className="flex items-center gap-2"
            >
              <span className="relative h-6 overflow-hidden">
                <span
                  className="
          flex
          flex-col
          transition-transform
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          group-hover:-translate-y-1/2
        "
                >
                  <span className="h-6 leading-6">
                    Explore {product.title}
                  </span>

                  <span className="h-6 leading-6">
                    View Product
                  </span>
                </span>
              </span>

              <ArrowUpRight
                className="
        h-4
        w-4
        transition-transform
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        group-hover:rotate-45
      "
              />
            </Link>
          </Button>
        </div>

        {/* Right */}

        <div className="relative flex items-center justify-center">
          {/* Background glow */}

          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          {/* Window */}

          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#171717]
              shadow-2xl
            "
          >
            

            {/* Image */}

            <div className="relative h-full">
              <TeamPerformanceCard />
           
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`
);

// ── Exact original products.tsx ───────────────────────────
write('components/products.tsx',
`"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ProductCard } from "./product-card";
import { ShoppingCart, Users } from "lucide-react";
import SectionBadge from "./section-badge";


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
            "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. With a quick overview of your team's progress and day-to-day activities, you can spend less time following up and more time helping your business move forward.",

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
    const sectionRef = useRef<HTMLDivElement>(null);

    const headingRef = useRef<HTMLHeadingElement>(null);

    const subtitleRef = useRef<HTMLParagraphElement>(null);

    const cardsRef = useRef<HTMLDivElement[]>([]);

    const stageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const heading = SplitText.create(headingRef.current, {
            type: "chars",
            mask: "chars",
        });

        const subtitle = SplitText.create(subtitleRef.current, {
            type: "lines",
            mask: "lines",
        });

        gsap.set(cardsRef.current, {
            y: 120,
            scale: 1,
            autoAlpha: 0,
        });

        gsap.set(cardsRef.current[0], {
            autoAlpha: 1,
            y: 0,
        });

        const textl = gsap.timeline({
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom",

                end: "top 50%",


            },


        })

        textl.from(heading.chars, {
            yPercent: 120,
            stagger: .03,
            duration: .8,
        });

        textl.from(
            subtitle.lines,
            {
                yPercent: 100,
                stagger: .12,
            },
            "-=.4"
        );

        const cards = gsap.utils.toArray<HTMLElement>(".card");

        cards.forEach((card, i) => {
            gsap.to(card, {
                
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top top",
                    endTrigger: ".st-wrapper",
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
        <section
            ref={sectionRef}
            className="relative bg-background py-10"
        >
            <div className="mx-auto max-w-6xl px-6">
                

               

                <div className="mx-auto mt-5 max-w-4xl text-center">

                    <h2
                        ref={headingRef}
                        className="text-5xl font-semibold tracking-tight lg:text-7xl"
                    >
                        Products
                    </h2>


                </div>

                <div

                    className="st-container relative mt-24 "
                    ref={stageRef}
                >
                    <div className="st-wrapper" >
                        {products.map((product, index) => (

                            <div key={product.id} className={index === products.length - 1 ? "card" : "card mb-[75vh]"}>
                                <ProductCard  product={product} />
                            </div>

                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}`
);

// Verify
const c1 = fs.readFileSync(path.join(root, 'components/product-card.tsx'), 'utf8');
const c2 = fs.readFileSync(path.join(root, 'components/products.tsx'), 'utf8');

if (c1.includes('TeamPerformanceCard') && c2.includes('.st-wrapper') && c2.includes('.card')) {
  console.log('\nVerified. Both files restored to original.');
  console.log('Hot reload will pick it up automatically.');
} else {
  console.error('Verification failed');
  process.exit(1);
}

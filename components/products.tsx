"use client";

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
    const sectionRef  = useRef<HTMLDivElement>(null);
    const headingRef  = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const cardsRef    = useRef<HTMLDivElement[]>([]);
    const stageRef    = useRef<HTMLDivElement>(null);

    // ── Mobile: simple fade-up via IntersectionObserver ──────────
    useEffect(() => {
        if (typeof window === "undefined" || window.innerWidth >= 768) return;
        const cards = Array.from(
            document.querySelectorAll<HTMLDivElement>(".lrbc-mobile-card")
        );
        cards.forEach((card, i) => {
            card.style.opacity   = "0";
            card.style.transform = "translateY(40px)";
            card.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    const el = e.target as HTMLElement;
                    el.style.opacity   = "1";
                    el.style.transform = "translateY(0)";
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });
        cards.forEach((c) => obs.observe(c));
        return () => obs.disconnect();
    }, []);

    // ── Desktop: GSAP scroll-pin stacking ────────────────────────
    useGSAP(() => {
        if (!headingRef.current) return;

        const heading  = SplitText.create(headingRef.current,  { type: "chars", mask: "chars" });
        const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines" });

        const textl = gsap.timeline({
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom",
                end: "top 50%",
            },
        });
        textl.from(heading.chars,  { yPercent: 120, stagger: 0.03, duration: 0.8 });
        textl.from(subtitle.lines, { yPercent: 100, stagger: 0.12 }, "-=.4");

        if (window.innerWidth < 768) return;

        gsap.set(cardsRef.current, { autoAlpha: 1, y: 0 });

        const cards = gsap.utils.toArray<HTMLElement>(".lrbc-desk-card");
        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                gsap.to(card, {
                    ease: "none",
                    scrollTrigger: {
                        trigger:             card,
                        start:               "top 80px",
                        endTrigger:          ".lrbc-st-wrapper",
                        end:                 "bottom bottom",
                        pin:                 true,
                        pinSpacing:          false,
                        invalidateOnRefresh: true,
                        scrub:               1.5,
                        anticipatePin:       1,
                    },
                });
            }
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-background py-8 md:py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                <div className="mx-auto mt-5 max-w-4xl text-center">
                    <h2 ref={headingRef} className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                        Products
                    </h2>
                    <p ref={subtitleRef} className="sr-only">Products</p>
                </div>

                {/* MOBILE — simple stacked cards, fade up on scroll */}
                <div className="mt-8 flex flex-col gap-8 md:hidden">
                    {products.map((product) => (
                        <div key={product.id} className="lrbc-mobile-card">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* DESKTOP — GSAP scroll-pin stacking */}
                <div className="lrbc-st-container relative mt-24 hidden md:block" ref={stageRef}>
                    <div className="lrbc-st-wrapper">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                                className={"lrbc-desk-card" + (index < products.length - 1 ? " mb-[75vh]" : "")}
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

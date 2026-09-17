"use client";

import { useRef, useEffect, useState } from "react";
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

    // ── MOBILE: IntersectionObserver slide-up ─────────────────────
    useEffect(() => {
        // Guard: only run on mobile, only in browser
        if (typeof window === "undefined" || window.innerWidth >= 768) return;

        const cards = Array.from(
            document.querySelectorAll<HTMLDivElement>(".lrbc-mobile-card")
        );

        cards.forEach((card, i) => {
            card.style.opacity    = "0";
            card.style.transform  = "translateY(48px)";
            card.style.transition = `opacity 0.65s ease ${i * 0.15}s, transform 0.65s ease ${i * 0.15}s`;
        });

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        el.style.opacity   = "1";
                        el.style.transform = "translateY(0)";
                        obs.unobserve(el);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
        );

        cards.forEach((c) => obs.observe(c));
        return () => obs.disconnect();
    }, []);

    // ── DESKTOP: GSAP stacking pin ────────────────────────────────
    useGSAP(() => {
        if (!headingRef.current || !subtitleRef.current) return;

        // Heading char animation
        const heading = SplitText.create(headingRef.current, {
            type: "chars",
            mask: "chars",
        });
        const subtitle = SplitText.create(subtitleRef.current, {
            type: "lines",
            mask: "lines",
        });

        const textl = gsap.timeline({
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom",
                end:   "top 50%",
            },
        });
        textl.from(heading.chars,  { yPercent: 120, stagger: 0.03, duration: 0.8 });
        textl.from(subtitle.lines, { yPercent: 100, stagger: 0.12 }, "-=.4");

        // ── Desktop pin animation ──────────────────────────────────
        // useGSAP fires after mount so window is safe to access here
        if (window.innerWidth < 768) return;

        const validCards = cardsRef.current.filter(Boolean);
        if (!validCards.length) return;

        // All cards start fully visible
        gsap.set(validCards, { autoAlpha: 1, y: 0 });

        // Query scoped to sectionRef
        const cards = gsap.utils.toArray<HTMLElement>(".lrbc-desk-card");
        if (cards.length < 2) return;

        cards.forEach((card, i) => {
            // Only pin cards that are NOT the last one
            if (i < cards.length - 1) {
                gsap.to(card, {
                    ease: "none",
                    scrollTrigger: {
                        trigger:             card,
                        start:               "top top",
                        endTrigger:          ".lrbc-st-wrapper",
                        end:                 "bottom bottom",
                        pin:                 true,
                        pinSpacing:          false,
                        invalidateOnRefresh: true,
                        scrub:               true,
                    },
                });
            }
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-background py-8 md:py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                {/* Heading */}
                <div className="mx-auto mt-5 max-w-4xl text-center">
                    <h2
                        ref={headingRef}
                        className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl"
                    >
                        Products
                    </h2>
                    {/* Subtitle ref kept for SplitText — hidden visually */}
                    <p ref={subtitleRef} className="sr-only" aria-hidden="true">Products</p>
                </div>

                {/* ── MOBILE: staggered slide-up (hidden on md+) ── */}
                <div className="mt-8 flex flex-col gap-6 md:hidden">
                    {products.map((product) => (
                        <div key={product.id} className="lrbc-mobile-card">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* ── DESKTOP: GSAP scroll-pin stacking (hidden on mobile) ── */}
                {/*
                    .lrbc-st-wrapper  = endTrigger for ScrollTrigger
                    .lrbc-desk-card   = each pinned card
                    mb-[75vh]         = manual scroll space (pinSpacing:false)
                */}
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
                                    "lrbc-desk-card" +
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

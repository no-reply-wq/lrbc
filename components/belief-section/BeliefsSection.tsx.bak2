"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import TopLeft from "./top-left";
import InvoiceCard from "./invoice-card";
import StatsCard from "./stats-card";
import TestimonialCard from "./testimonial-card";
import MapCard from "./map-card";
import AnalyticsCard from "./analytics-card";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function BeliefsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            const heading = SplitText.create(headingRef.current, {
                type: "chars",
                charsClass: "char",
            });

            const subtitle = SplitText.create(subtitleRef.current, {
                type: "lines",
                mask: "lines",
            });

            gsap.from(heading.chars, {
                yPercent: 110,
                opacity: 0,
                stagger: 0.03,
                duration: 0.8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            gsap.from(subtitle.lines, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: subtitleRef.current,
                    start: "top 80%",
                },
            });

            gsap.from(".belief-card", {
                opacity: 0,
                y: 60,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".belief-grid",
                    start: "top 80%",
                },
            });
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-24 md:py-32"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,theme(colors.primary/.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,theme(colors.primary/.12),transparent_60%)]" />

            <div className="mx-auto max-w-7xl px-6">

                {/* Badge */}

                <div className="flex justify-center">
                </div>

                {/* Heading */}

                <div className="mx-auto mt-8 max-w-5xl overflow-hidden">
                    <h2
                        ref={headingRef}
                        className="text-center text-5xl font-semibold tracking-tight md:text-6xl xl:text-8xl"
                    >
                        Before We Build,
                        <br />
                        We Believe.
                    </h2>
                </div>

                {/* Subtitle */}

                <div className="mx-auto mt-8 max-w-3xl overflow-hidden">
                    <p
                        ref={subtitleRef}
                        className="text-center text-xl text-muted-foreground"
                    >
                        We See the People Behind Every Business
                    </p>
                </div>

                {/* ===================== */}
                {/* GRID */}
                {/* ===================== */}

                <div className="belief-grid mt-20 overflow-hidden rounded-[34px] border border-border bg-background">

                    {/* Row 1 */}

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        <TopLeft />

                        <Card className="belief-card rounded-none border-0 border-r bg-transparent shadow-none">
                            <InvoiceCard />
                        </Card>

                    </div>

                    {/* Divider */}

                    <div className="h-px bg-border" />

                    {/* Row 2 */}


                    {/* Divider */}

                    <div className="h-px bg-border" />

                    {/* Row 3 */}

                    <div className="grid lg:grid-cols-2">

                        <MapCard />

                        <AnalyticsCard />

                    </div>

                </div>

            </div>
        </section>
    );
}
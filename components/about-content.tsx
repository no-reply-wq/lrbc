"use client"
import { Mail, Zap, Activity, DraftingCompass, Quote } from 'lucide-react'
import { Et, Hide } from "@/components/cms/editable";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollFadeWords } from "@/components/ui/use-scroll-fade";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WHY_ERP_FEATURES = [
    { icon: Mail, text: "Built around your unique workflows" },
    { icon: Zap, text: "Easy for every team to learn and use" },
    { icon: Activity, text: "Real-time dashboards for complete operational visibility" },
    { icon: DraftingCompass, text: "Scales as your business grows" },
];

export default function AboutUsContent() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useScrollFadeWords<HTMLParagraphElement>();
    const featuresRef = useRef<HTMLUListElement>(null);

    useGSAP(
        () => {
            const items = featuresRef.current?.querySelectorAll("li") ?? [];
            gsap.set(items, { opacity: 0, y: 30 });

            gsap.to(items, {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });

        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-6 md:py-14">
            <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 md:space-y-12">
                <div className="lrbc-eyebrow-row"><Et as="div" id="about.content.badge" def="Our Story" className="lrbc-eyebrow" /></div>
            </div>

            {/* ── Why Businesses Choose Our ERP  |  Our Story quote ── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 md:py-16">
                <div className="grid gap-10 md:grid-cols-2 md:gap-10 lg:gap-16 items-start">

                    {/* Left: Why Businesses Choose Our ERP */}
                    <div>
                        <Et as="h2" id="about.content.title" def="Why Businesses Choose Our ERP" className="text-2xl font-semibold sm:text-3xl lg:text-5xl" />
                        <Et as="p" id="about.content.subtitle" def="One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's" className="mt-5 text-muted-foreground text-base sm:text-lg" />

                        <ul ref={featuresRef} className="mt-8 divide-y border-y">
                            {WHY_ERP_FEATURES.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <Hide key={i} id={`about.content.feature.${i}`}>
                                    <li className="flex items-center gap-3 py-3.5">
                                        <Icon className="size-5 shrink-0 text-primary" />
                                        <Et id={`about.content.feature.${i}.text`} def={f.text} className="text-sm sm:text-base" />
                                    </li>
                                    </Hide>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Right: Our Story — modern quote treatment */}
                    <div className="relative pl-4 sm:pl-10">
                        <Quote className="absolute -top-2 left-0 h-10 w-10 sm:h-12 sm:w-12 text-primary/20" />
                        <blockquote className="pl-4 sm:pl-8">
                            <Et
                                as="p"
                                ref={headingRef}
                                id="about.content.quote"
                                reload
                                def={"\"Our journey began with a simple observation. While working closely with businesses across industries, our founder saw organizations struggling with paperwork, disconnected systems, and software that was often too complicated for everyday users.\""}
                                className="text-lg sm:text-2xl md:text-xl lg:text-3xl font-semibold leading-snug sm:leading-relaxed"
                            />
                            <Et as="footer" id="about.content.quoteFooter" def="Rather than asking businesses to adapt to technology, we chose to build technology that adapts to them." className="mt-6 text-muted-foreground text-sm sm:text-base leading-relaxed" />
                        </blockquote>
                    </div>

                </div>
            </div>
        </section>
    )
}

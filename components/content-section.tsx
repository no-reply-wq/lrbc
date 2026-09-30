"use client"
import { ArrowRight, Cpu, HomeIcon, Lock, Sparkles, Users, Zap } from 'lucide-react'
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { TextEffect } from './ui/text-effect';
import { AnimatedGroup } from './ui/animated-group';
import Dashboard from './dashboar-view/dashboar-view';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import SectionBadge from './section-badge';


gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function ContentSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const transitionVariants = {
        item: {
            hidden: {
                opacity: 0,
                filter: 'blur(12px)',
                y: 12,
            },
            visible: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: {
                    type: 'spring',
                    bounce: 0.3,
                    duration: 1.5,
                },
            },
        },
    }
    useGSAP(
        () => {
            if (!imageRef.current || !featuresRef.current) return;

            const cards = gsap.utils.toArray(
                featuresRef.current?.children || []
            );

            gsap.set(cards, {
                y: 80,
                opacity: 0,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top 70%",
                    end: "bottom 55%",
                    scrub: 1,
                },
            });

            tl.to(imageRef.current, {
                scale: 0.9,
                y: -60,
                filter: "brightness(0.8)",
                ease: "none",
            })

                .to(
                    cards,
                    {
                        y: 0,
                        delay: 0.5,
                        opacity: 1,
                        stagger: 0.15,
                        ease: "power2.out",
                    },
                    0.15
                );

            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        },
        { scope: sectionRef }
    );
    return (
        <section ref={sectionRef} className="mt-0 py-0 md:pb-12 md:pt-0">



            <div className="relative pt-0">
                {/* "One ERP | Every Process | Zero Bottleneck" intro removed — replaced by the Products & Services tablet showcase (components/products-showcase) */}
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    delayChildren: 1,
                                },
                            },
                        },
                        item: {
                            hidden: {
                                opacity: 0,
                                y: 20,
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    type: 'spring',
                                    bounce: 0.3,
                                    duration: 2,
                                },
                            },
                        },
                    }}
                    className="mask-y-from-35% mask-y-to-65% absolute inset-0 top-56 lg:top-12">
                    
                     <video
                                className="block h-full w-full object-cover"
                                src="/videos/hero-vid.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-hidden="true"
                            />
                </AnimatedGroup>

                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                />



                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.75,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}>
                    <div className="relative mt-0 px-2 sm:mt-2 md:mt-0 md:mb-0">
                        <div className="relative mx-auto w-full md:max-w-6xl">
                            <Dashboard />
                        </div>
                    </div>
                </AnimatedGroup>
            </div>

        </section>
    )
}

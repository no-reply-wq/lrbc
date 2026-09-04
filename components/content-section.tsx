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
    const headingRef = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLDivElement>(null);
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
            if (!headingRef.current) return;

            const split = SplitText.create(headingRef.current, {
                type: "words",
            });
            const split2 = SplitText.create(paragraphRef.current, {
                type: "words",
            });


            gsap.set(split.words, {
                opacity: 0.4,
            });
            gsap.set(split2.words, {
                opacity: 0.4,
            });

            gsap.to(split.words, {
                opacity: 1,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "+=500",
                    scrub: true,
                },
            });

            gsap.to(split2.words, {
                opacity: 1,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "30% bottom",
                    end: "+=500",
                    scrub: true,
                },
            });
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
                split.revert();
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        },
        { scope: sectionRef }
    );
    return (
        <section ref={sectionRef} className="mt-24">



            <div className="relative pt-24 md:pt-12">
                <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12 ">
                    
                    <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-12">
                        <h2 className="cta-title text-balance text-4xl font-semibold lg:text-5xl overflow-hidden">
                            About Our ERP

                        </h2>
                    </div>

                    <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-12">
                        <p
                            ref={headingRef}
                            className=" text-2xl font-semibold"
                        >
                            <span className=" text-3xl font-bold ">One ERP. Every Process. Zero Bottlenecks .</span>  One platform for everything your business needs. Our Google Workspace-powered ERP solutions keep your operations connected, simple, and efficient.
                        </p>
                        <p
                            ref={paragraphRef}>

                            One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's.

                        </p>
                    </div>


                </div>
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
                    className="mask-y-from-35% mask-y-to-90% absolute inset-0 top-56 lg:top-12">
                    
                     <video
                                className="hidden h-full w-full object-cover dark:block"
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
                    <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 mb-20">
                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1">
                            <Dashboard />

                        </div>
                    </div>
                </AnimatedGroup>
            </div>

        </section>
    )
}
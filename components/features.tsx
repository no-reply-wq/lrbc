"use client";
import { Activity, CircleHelp, DraftingCompass, Mail, Zap } from 'lucide-react'
import Image from 'next/image'


import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AccountsReceivableCard from './dashboar-view/components/accounts-receivable-card';
import AccountsCard from './ui-2/acounts-card';
import { AnimatedGroup } from './ui/animated-group';
import Dashboard from './dashboar-view/dashboar-view'
import SectionBadge from './section-badge';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    useGSAP(
        () => {
            const features = gsap.utils.toArray("li");

            gsap.set(features, {
                opacity: 0,
                y: 35,
            });

            gsap.set(imageRef.current, {
                opacity: 0,
                scale: 0.9,
                rotate: 2,
            });

            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "+=500",
                    toggleActions: "play none none reverse",
                    scrub: true,
                },
            });

            tl.from(".text-caption", {
                opacity: 0,
                y: 25,
                duration: 0.5,
            })

                .from(
                    "h2",
                    {
                        opacity: 0,
                        y: 40,
                        duration: 0.7,
                    },
                    "-=0.2"
                )

                .from(
                    "p",
                    {
                        opacity: 0,
                        y: 25,
                        duration: 0.6,
                    },
                    "-=0.4"
                )

                .to(
                    features,
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.12,
                        duration: 0.45,
                    },
                    "-=0.3"
                )

                .to(
                    imageRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 0.8,
                    },
                    "-=0.8"
                );

            gsap.to(imageRef.current, {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top bottom",
                    end: "top 80%",
                    scrub: true,
                   
                },
            });
        },
        { scope: sectionRef }
    );
 

    return (
        <section
            ref={sectionRef}
            className="py-8 md:py-8 mt-8"

        >
            <div className="mx-auto max-w-6xl px-6 pt-10 flex flex-col items-center justify-center">
               
 
                <div
                    ref={contentRef}
                    className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24"
                >
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl">Why Businesses Choose Our ERP
                            </h2>
                            <p className="mt-6">One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's</p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <Mail className="size-5" />
                                Built around your unique workflows
                            </li>
                            <li>
                                <Zap className="size-5" />
                                Easy for every team to learn and use
                            </li>
                            <li>
                                <Activity className="size-5" />
                                Real-time dashboards for complete operational visibility
                            </li>
                            <li>
                                <DraftingCompass className="size-5" />
                                Scales as your business grows
                            </li>
                        </ul>
                    </div>
                    <div
                        ref={imageRef}
                        className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3"
                    >
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            {/*<Image src="/images/payments.png" 
                            className="hidden rounded-[15px]
                             dark:block" alt="payments illustration dark" width={1207} height={929} />*/}
                            <div
                                className="relative  h-full w-full rounded-[15px]"
                            >
                                <AccountsCard />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
           
        </section>
    )
}
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function PricingSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    useGSAP(
    () => {
        const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");
        const items = gsap.utils.toArray<HTMLElement>(".feature-item");
        const popular = document.querySelector(".pricing-popular");

        gsap.set(cards, {
            opacity: 0,
            y: 100,
        });

        gsap.set(items, {
            opacity: 0,
            x: -20,
        });

        gsap.set(popular, {
            scale: 0.9,
        });

        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out",
            },
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
        });

        tl.from(".text-caption", {
            opacity: 0,
            y: 30,
            duration: 0.5,
        })

        .from(
            headingRef.current,
            {
                opacity: 0,
                y: 50,
                duration: 0.8,
            },
            "-=0.2"
        )

        .from(
            "p",
            {
                opacity: 0,
                
                duration: 0.6,
            },
            "-=0.4"
        )

        .to(
            cards,
            {
                opacity: 1,
                y: 0,
                stagger: 0.18,
                duration: 0.8,
            },
            "-=0.2"
        )

        .to(
            popular,
            {
                scale: 1.04,
                duration: 0.5,
                ease: "back.out(1.8)",
            },
            "<"
        )

        .to(
            items,
            {
                opacity: 1,
                x: 0,
                stagger: 0.03,
                duration: 0.35,
            },
            "-=0.4"
        );

        gsap.to(cards, {
           
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
                trigger: cardsRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    },
    { scope: sectionRef }
);
    return (
        <section
            ref={sectionRef}
            className="py-16 md:py-32"
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1
                        ref={headingRef}
                        className="text-center text-4xl font-semibold lg:text-5xl"
                    >Pricing that Scales with You</h1>
                    <p className="text-lg text-muted-foreground">
                        Choose the perfect plan for your needs. All plans include a 14-day free trial.
                    </p>
                </div>

                <div  ref={cardsRef} className="mt-15 grid gap-6 [--color-card:var(--color-muted)] *:border-none *:shadow-none md:mt-20 md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
                    <Card className="pricing-card bg-muted flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">Free</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
                            <CardDescription className="text-sm">Per editor</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Basic Analytics Dashboard', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="feature-item flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="pricing-card pricing-popular bg-muted relative">
                        <span className="z-20 bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 
                        to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">Popular</span>

                        <div className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-medium">Pro</CardTitle>
                                <span className="my-3 block text-2xl font-semibold">$19 / mo</span>
                                <CardDescription className="text-sm">Per editor</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <hr className="border-dashed" />
                                <ul className="list-outside space-y-3 text-sm">
                                    {['Everything in Free Plan', '5GB Cloud Storage', 'Email and Chat Support', 'Access to Community Forum', 'Single User Access', 'Access to Basic Templates', 'Mobile App Access', '1 Custom Report Per Month', 'Monthly Product Updates', 'Standard Security Features'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="feature-item flex items-center gap-2">
                                            <Check className="size-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full">
                                    <Link href="">Get Started</Link>
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>

                    <Card className="pricing-card bg-muted flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">Startup</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">$29 / mo</span>
                            <CardDescription className="text-sm">Per editor</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Everything in Pro Plan', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="feature-item flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
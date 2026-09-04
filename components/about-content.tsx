"use client"
import { ArrowRight, Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { TextEffect } from './ui/text-effect';
import { AnimatedGroup } from './ui/animated-group';
import SectionBadge from './section-badge';


gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function AboutUsContent() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
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
            if (!headingRef.current) return;

            const split = SplitText.create(headingRef.current, {
                type: "words",
            });

            gsap.set(split.words, {
                opacity: 0.4,
            });

            gsap.to(split.words, {
                opacity: 1,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 70%",
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
        <section ref={sectionRef} className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <SectionBadge text='Our Story' />
                <img
                    ref={imageRef}
                    className="rounded-(--radius)"
                    src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="team image"
                    loading="lazy"
                />
                {/* 1. Add the gradient, padding, rounding, and hover classes to this wrapper div */}
<div className="relative mx-auto max-w-5xl space-y-6 text-center md:space-y-12 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent rounded-[2rem] px-6 py-12 transition-all duration-700 ease-out hover:from-white/[0.06]">
    <p
        ref={headingRef}
        className="text-4xl font-semibold lg:text-5xl leading-wide"
    >
        Our journey began with a simple observation. While working closely with businesses across industries, our founder saw organizations struggling with paperwork, disconnected systems, and software that was often too complicated for everyday users
    </p>
    
    {/* 2. Add the text-muted-foreground and text-lg classes to this paragraph */}
    <p className="text-muted-foreground text-lg">
        Rather than asking businesses to adapt to technology,<br/> we chose to build technology that adapts to them.
    </p>
</div>
                

            </div>
        </section>
    )
}
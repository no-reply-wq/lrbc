"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/ui/animated-group'






export default function AboutUsHero() {

    const sectionRef = useRef<HTMLDivElement>(null);

    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
     const quoteRef = useRef<HTMLDivElement>(null);
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

      gsap.set(
        [
          
          quoteRef.current,
          
        ],
        {
          opacity: 0,
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
          
        },
      });

      tl.from(
        heading.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.03,
        }
      )

        .from(
          subtitle.lines,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.4"
        )

        

        .fromTo(
          quoteRef.current,
          {
            y: 25,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )

       

       

    },
    {
      scope: sectionRef,
    }
  );



    return (
        <>

            <section className="overflow-hidden" ref={sectionRef}>
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <div>
                    <div className="relative pt-24 md:pt-36">
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
                            <Image
                                src="https://images.unsplash.com/photo-1662285064441-bedb11ca7e47?q=80&w=1344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="background"
                                className="hidden size-full mix-blend-overlay dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">

                                <div
                                    
                                    className="hover:bg-background overflow-hidden dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                    <span ref={quoteRef} className="text-foreground text-sm">About Us
                                    </span>
                                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                    
                                </div>

                                <div className="overflow-hidden">
                                    <h1 ref={headingRef} className="mx-auto mt-8 max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl lg:mt-16 xl:text-[5.25rem]">
                                        <span className="overflow-hidden">Building Technology</span>
                                        <span className="overflow-hidden">Around People,</span>
                                        <span>Not Processes.</span>
                                    </h1>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="mx-auto mt-8 max-w-2xl text-center text-lg" ref={subtitleRef}>
                                        Every growing business deserves software that's simple, reliable, and built around the way it works.

                                    </p>
                                </div>



                            </div>
                        </div>


                    </div>
                </div>

            </section >
        </>
    )
}
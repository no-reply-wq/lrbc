"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
import Link from 'next/link'
import Image from 'next/image'
import SectionBadge from "./section-badge";

const members = [
    {
        name: 'Lalit Raj',
        role: 'Director & CEO',
        avatar: '/images/lalit.jpeg',
        link: 'https://www.linkedin.com/in/lalit-raj-%F0%9F%9A%80-500b7a124/',
        objectPosition: 'center top',
    },
    {
        name: 'Aniket Patanayak',
        role: 'Principal System Architect',
        avatar: '/images/aniket.jpeg',
        link: 'https://www.linkedin.com/in/aniket-pattanayak/',
        objectPosition: 'center top',
    },
    {
        name: 'Bhavya Muthyala',
        role: 'Creative Head',
        avatar: '/images/bhavya.jpeg',
        link: 'https://www.linkedin.com/in/bhavyamuthyala/',
        objectPosition: 'center 20%',
    },
   
]

export default function TeamSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(".team-card");
            const images = gsap.utils.toArray<HTMLElement>(".team-image");

            gsap.set(cards, {
                y: 80,
                opacity: 0,
            });

            gsap.set(images, {
                scale: 1.15,
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
                y: 25,
                opacity: 0,
                duration: 0.5,
            })

                .from(
                    "h2",
                    {
                        x: -60,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.2"
                )

                .from(
                    "p",
                    {
                        x: 60,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.6"
                )

                .to(
                    cards,
                    {
                        opacity: 1,
                        y: 0,
                        stagger: {
                            each: 0.15,
                            from: "start",
                        },
                        duration: 0.6,
                    },
                    "-=0.3"
                )

                .to(
                    images,
                    {
                        scale: 1,
                        stagger: 0.15,
                        duration: 0.8,
                    },
                    "<"
                );

            gsap.to(gridRef.current, {
                yPercent: -6,
                ease: "none",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top top",
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
            className="bg-gray-50 py-12 dark:bg-transparent md:py-16"
        >
            <div className="mx-auto max-w-5xl  px-15">
                <span className="-ml-6 -mt-4 block w-max"><SectionBadge text="Team" /></span>
                <div
                    ref={headerRef}
                    className="mt-8 gap-4 sm:grid sm:grid-cols-2 md:mt-12"
                >
                    <div className="sm:w-2/5">
                        <h2 className="text-3xl font-bold sm:text-4xl">Meet the team</h2>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <p>During the working process, we perform regular fitting with the client because he is the only person who can feel whether a new suit fits or not.</p>
                    </div>
                </div>
                <div className="mt-8 md:mt-12">
                    <div
                        ref={gridRef}
                        className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {members.map((member, index) => (
    <div
        key={index}
        className="team-card group overflow-hidden">
        <Image
            className="team-image h-96 w-full rounded-md object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.03] origin-center hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
            style={{ objectPosition: member.objectPosition }}
            src={member.avatar}
            alt="team member"
            width="826"
            height="1239"
            sizes="(max-width: 768px) 100vw, 280px"
        />
        <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
            <div className="flex justify-between">
                <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
            </div>
            <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                <Link
                    href={member.link}
                    className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 no-underline hover:no-underline group-hover:translate-y-0 group-hover:opacity-100">
                    {' '}
                    LinkedIn
                </Link>
            </div>
        </div>
    </div>
))}
                    </div>
                </div>
            </div>
        </section>
    )
}
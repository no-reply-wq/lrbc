"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
import { useScrollFadeLines } from "@/components/ui/use-scroll-fade";
import Image from 'next/image'
import { Et, Hide, Lnk, useAttrs, useVal } from "@/components/cms/editable";

function MemberImage({ index, member }: { index: number; member: { name: string; avatar: string; objectPosition: string } }) {
    const src = useVal(`team.member.${index}.photo`, member.avatar);
    const alt = useVal(`team.member.${index}.name`, member.name);
    const attrs = useAttrs("img", `team.member.${index}.photo`, member.avatar);
    return (
        <Image
            fill
            {...attrs}
            className={[
                "team-image object-cover origin-center",
                "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                "group-hover:scale-[1.03]",
                /* Desktop: start grey, colour on hover */
                "sm:grayscale sm:group-hover:grayscale-0",
                /* Mobile (<sm): always colour — no grayscale applied */
            ].join(" ")}
            style={{ objectPosition: member.objectPosition }}
            src={src}
            alt={alt}
            sizes="(max-width: 768px) 100vw, 280px"
        />
    );
}

const members = [
    {
        name: 'Lalit Raj',
        role: 'Founder',
        avatar: '/images/lalit.jpeg',
        link: 'https://www.linkedin.com/in/lalit-raj-%F0%9F%9A%80-500b7a124/',
        objectPosition: 'center top',
    },
    {
        name: 'Aniket Pattanayak',
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
        objectPosition: 'center top',
    },
]

export default function TeamSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useScrollFadeLines<HTMLParagraphElement>();
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(".team-card");
            const images = gsap.utils.toArray<HTMLElement>(".team-image");

            gsap.set(cards, { y: 80, opacity: 0 });
            gsap.set(images, { scale: 1.15 });

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                },
            });

            tl.from("h2", { y: 30, opacity: 0, duration: 0.8 })
              .to(cards, {
                  opacity: 1, y: 0,
                  stagger: { each: 0.15, from: "start" },
                  duration: 0.6,
              }, "-=0.3")
              .to(images, { scale: 1, stagger: 0.15, duration: 0.8 }, "<");

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
        <Hide id="team.sec">
        <section ref={sectionRef} className="bg-gray-50 py-8 dark:bg-transparent md:py-12">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-15">
                <span className="block w-max sm:-ml-6 sm:-mt-4">
                    <Et as="div" id="team.badge" def="Team" className="lrbc-eyebrow mx-auto" />
                </span>
                <div ref={headerRef} className="mt-8 gap-4 sm:grid sm:grid-cols-2 md:mt-12">
                    <div className="sm:w-2/5">
                        <Et as="h2" id="team.heading" def="Meet the team" className="text-3xl font-bold sm:text-4xl lrbc-clip-safe" />
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <Et
                            as="p"
                            ref={quoteRef}
                            reload
                            id="team.intro"
                            def="During the work process, we perform regular fittings with the client because only the client can know whether a new suite fits or not."
                        />
                    </div>
                </div>

                <div className="mt-8 md:mt-12">
                    <div ref={gridRef} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, index) => (
                            <Hide key={index} id={`team.member.${index}`}>
                            <div className="team-card group overflow-hidden">

                                {/* Image — original desktop behaviour preserved exactly */}
                                {/* Mobile: full colour. Desktop: grayscale → colour on hover */}
                                <div className="relative h-96 w-full overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:h-[22.5rem] group-hover:rounded-xl">
                                    <MemberImage index={index} member={member} />
                                </div>

                                {/* Text info */}
                                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                    <div className="flex justify-between">
                                        <Et as="h3" id={`team.member.${index}.name`} def={member.name} className="text-base font-medium transition-all duration-500 group-hover:tracking-wider" />
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">

                                        {/* Role:
                                            Mobile  — always visible (opacity-100, no translate)
                                            Desktop — hidden until hover (original behaviour) */}
                                        <Et id={`team.member.${index}.role`} def={member.role} className={[
                                            "text-muted-foreground text-sm",
                                            "transition duration-300",
                                            /* Mobile: always shown */
                                            "opacity-100 translate-y-0",
                                            /* Desktop override: hidden, slides up on hover */
                                            "sm:opacity-0 sm:translate-y-6 sm:inline-block",
                                            "sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
                                        ].join(" ")} />

                                        {/* LinkedIn:
                                            Mobile  — always visible (original plain text style)
                                            Desktop — hidden until hover (original behaviour) */}
                                        <Lnk
                                            id={`team.member.${index}.link`}
                                            href={member.link}
                                            labelId={`team.member.${index}.linkLabel`}
                                            label=" LinkedIn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={[
                                                "text-sm tracking-wide no-underline hover:no-underline",
                                                "transition-all duration-500",
                                                /* Mobile: always shown */
                                                "opacity-100 translate-y-0",
                                                /* Desktop override: hidden, slides up on hover */
                                                "sm:opacity-0 sm:translate-y-8 sm:inline-block",
                                                "sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
                                                "sm:group-hover:text-primary-600 sm:dark:group-hover:text-primary-400",
                                            ].join(" ")}
                                        />
                                    </div>
                                </div>

                            </div>
                            </Hide>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        </Hide>
    );
}

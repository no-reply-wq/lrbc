"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ProductCard } from "./product-card";
import { ShoppingCart, Users } from "lucide-react";
import SectionBadge from "./section-badge";


gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const products = [
    {
        id: "lekhasetu",
        title: "LekhaSetu",
        href: "/lekhasetu",

        description:
            "Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.",

        image: "/images/payments.png",

        features: [
            "Real-time cloud sync",
            "Multi-company management",
            "Inventory insights",
            "Google Sheets reports",
        ],
    },

    {
        id: "workpilot",
        title: "WorkPilot",
        href: "#",

        description:
            "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. With a quick overview of your team's progress and day-to-day activities, you can spend less time following up and more time helping your business move forward.",

        image: "/images/workpilot.png",

        features: [
            "Attendance",
            "Task assignment",
            "Activity history",
            "Performance tracking",
        ],
    },
];

export default function ProductsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const headingRef = useRef<HTMLHeadingElement>(null);

    const subtitleRef = useRef<HTMLParagraphElement>(null);

    const cardsRef = useRef<HTMLDivElement[]>([]);

    const stageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const heading = SplitText.create(headingRef.current, {
            type: "chars",
            mask: "chars",
        });

        const subtitle = SplitText.create(subtitleRef.current, {
            type: "lines",
            mask: "lines",
        });

        gsap.set(cardsRef.current, {
            y: 120,
            scale: 1,
            autoAlpha: 0,
        });

        gsap.set(cardsRef.current[0], {
            autoAlpha: 1,
            y: 0,
        });

        const textl = gsap.timeline({
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom",

                end: "top 50%",


            },


        })

        textl.from(heading.chars, {
            yPercent: 120,
            stagger: .03,
            duration: .8,
        });

        textl.from(
            subtitle.lines,
            {
                yPercent: 100,
                stagger: .12,
            },
            "-=.4"
        );

        const cards = gsap.utils.toArray<HTMLElement>(".card");

        cards.forEach((card, i) => {
            gsap.to(card, {
                
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top top",
                    endTrigger: ".st-wrapper",
                    end: "bottom bottom",
                    pin: true,                 
                    pinSpacing: false,
                    invalidateOnRefresh: true,
                    scrub: true,
                },
            });
        }); 

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative bg-background py-10"
        >
            <div className="mx-auto max-w-6xl px-6">
                

               

                <div className="mx-auto mt-5 max-w-4xl text-center">

                    <h2
                        ref={headingRef}
                        className="text-5xl font-semibold tracking-tight lg:text-7xl"
                    >
                        Products
                    </h2>


                </div>

                <div

                    className="st-container relative mt-24 "
                    ref={stageRef}
                >
                    <div className="st-wrapper" >
                        {products.map((product, index) => (

                            <div key={product.id} className={index === products.length - 1 ? "card" : "card mb-[75vh]"}>
                                <ProductCard  product={product} />
                            </div>

                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TestimonialCard from "./belief-section/testimonial-card";
import { LogoCloud } from "./logo-cloud-4";
import MoltenMetal from "./new-components/MoltenMetal";
import SectionBadge from "./section-badge";
import { MessageSquareQuote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-[14px] py-[6px] shadow-sm">
      <div className="flex h-[14px] w-[14px] items-center justify-center overflow-hidden">
        {icon}
      </div>

      <span className="text-xs font-medium text-foreground">
        {text}
      </span>
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const testimonials = [
    {
      quote:
        " The unique part about their  offerings is that they spends time in understanding your business and detail and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
      name: "Jamie Marshall",
      company: "Co-founder, Exponent",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2011%2C%202025%2C%2011_35_19%20AM-z4zSRLsbOQDp7MJS1t8EXmGNB6Al9Z.png",
    },
   
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 300)
    }, 12000) // increased from 6000ms to 12000ms for longer testimonial display

    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleNavigationClick = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTestimonial(index)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 300)
  }

  const sectionRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const quoteRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLDivElement>(null);

  const companyRef = useRef<HTMLDivElement>(null);
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

     

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 50%",
          toggleActions: "play none none reverse",
          scrub: true,
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
          imageRef.current,
          {
            scale: 0.9,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.3"
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

        .from(
          nameRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )

        .from(
          companyRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.45"
        );

    },
    {
      scope: sectionRef,
    }
  );

  return (
    <div ref={sectionRef} className="mx-auto w-full flex flex-col justify-center items-center max-w-6xl px-10">
      
      {/* Header Section */}
      <div className="mx-auto max-w-2xl space-y-6 text-center mt-10">
         <SectionBadge
                                                         text="Testimonials"
                                                         icon={MessageSquareQuote }
                                                         className="mt-6 mb-12"
                                                     />
        <div className="overflow-hidden">
          <h1
            ref={headingRef}
            className="text-center text-4xl font-semibold lg:text-5xl"
          >
            What Our Clients Say
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            ref={subtitleRef}
            className="text-lg text-muted-foreground"
          >
            Hear from our satisfied clients...
          </p>
        </div>
      </div>
      {/* Testimonial Content */}
      <div className="relative self-stretch px-2 overflow-hidden flex justify-start items-center bg-background border-none">
        
        <div className="flex-1 py-8 flex flex-col md:flex-row justify-center items-end gap-6 z-10 bg-transparent">
          <div className="self-stretch px-3 md:px-12 justify-center items-start gap-4 flex flex-col md:flex-row bg-transparent">
           <div ref={quoteRef}>
              <TestimonialCard />
            </div>
          </div>

         

        </div>
      </div>
      <div className="mx-auto max-w-2xl text-center mt-8 mb-12">
        <LogoCloud />
      </div>
    </div>
  )
}

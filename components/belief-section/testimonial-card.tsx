"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import MoltenMetal from "../new-components/MoltenMetal";

gsap.registerPlugin(useGSAP);

const testimonials = [
  {
    quote:
      "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    name: "Varun Bathwal",
    company: "ARV",
    designation: "CEO",
    image: "/images/Varun.jpeg",
  },
  {
    quote:
      "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    name: "Kanul Verma",
    company: "Hitco Group",
    designation: "Executive Director",
    image: "/images/Kanul.jpeg",
  },
 // {
 //   quote:
 //     "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
 //   name: "Ekta V Vohra",
 //   company: "Wedding Alliance",
 //   designation: "Founder",
 //   image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  //},
];

// Auto-slide delay: 8 000 ms — long enough to read both testimonials comfortably
const SLIDE_DELAY = 8000;

export default function TestimonialCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  // Fade helper — used by both auto-slide and manual nav
  const goTo = useCallback((index: number) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 350);
  }, []);

  const prev = useCallback(() => {
    goTo((active - 1 + testimonials.length) % testimonials.length);
  }, [active, goTo]);

  const next = useCallback(() => {
    goTo((active + 1) % testimonials.length);
  }, [active, goTo]);

  // Auto-slide — resets whenever user manually navigates
  useEffect(() => {
    const id = setInterval(next, SLIDE_DELAY);
    return () => clearInterval(id);
  }, [next]);

  // Subtle floating animation on the inner card
  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const enter = () => gsap.to(cardRef.current, { scale: 1.02, duration: 0.35 });
    const leave = () => gsap.to(cardRef.current, { scale: 1, duration: 0.35 });
    cardRef.current.addEventListener("mouseenter", enter);
    cardRef.current.addEventListener("mouseleave", leave);
    return () => {
      cardRef.current?.removeEventListener("mouseenter", enter);
      cardRef.current?.removeEventListener("mouseleave", leave);
    };
  });

  const t = testimonials[active];

  return (
    <Card
      className="relative group h-full rounded-none bg-card shadow-none border-none p-0"
      style={{ border: "none" }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
      </div>

      <CardContent className="flex h-full items-center justify-center p-4 sm:p-8 z-10">
        <div
          ref={cardRef}
          className="relative w-full rounded-[28px] border bg-background/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-[28px] bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <Quote className="mb-6 h-10 w-10 text-primary" />

            {/* Testimonial text with fade transition */}
            <div
              className="transition-opacity duration-350"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <p className="text-base sm:text-lg leading-8 text-foreground min-h-[120px]">
                {t.quote}
              </p>

              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold leading-tight">{t.name}</h4>
                    <p className="text-sm text-muted-foreground leading-tight">
                      {t.designation} · {t.company}
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full shrink-0 text-xs w-fit">
                  Trusted Partner
                </Badge>
              </div>
            </div>

            {/* ── Navigation row: prev / dots / next ── */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {/* Prev button */}
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

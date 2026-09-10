"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
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
];

export default function TestimonialCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      <CardContent className="flex h-full items-center justify-center p-8 z-10">
        <div
          ref={cardRef}
          className="relative w-full rounded-[28px] border bg-background/80 p-8 shadow-sm backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-[28px] bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <Quote className="mb-6 h-10 w-10 text-primary" />

            {/* Testimonial text with fade transition */}
            <div
              className="transition-opacity duration-400"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <p className="text-lg leading-8 text-foreground min-h-[120px]">
                {t.quote}
              </p>

              <div className="mt-8 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="rounded-full object-cover w-10 h-10 overflow-hidden relative shrink-0">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.designation} · {t.company}
                  </p>
                </div>

                <Badge variant="secondary" className="ml-auto rounded-full shrink-0">
                  Trusted Partner
                </Badge>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setVisible(false);
                    setTimeout(() => { setActive(i); setVisible(true); }, 400);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRef } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function CallToAction() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = SplitText.create(".cta-title", {
        type: "lines",
        mask: "lines",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".cta-wrapper", { opacity: 0, y: 60, duration: 0.7 })
        .from(heading.lines, { yPercent: 120, duration: 0.8, stagger: 0.08 }, "-=0.35")
        .from(".cta-description", { opacity: 0, y: 24, duration: 0.6 }, "-=0.45")
        .from(".cta-form", { opacity: 0, scale: 0.94, duration: 0.7 }, "-=0.35")
        .from(".cta-mail", { x: -20, opacity: 0, duration: 0.45 }, "-=0.45")
        .from(".cta-input", { scaleX: 0.85, opacity: 0, transformOrigin: "left center", duration: 0.55 }, "-=0.3")
        .from(".cta-button", { x: 24, opacity: 0, duration: 0.5 }, "-=0.45");

      gsap.to(".cta-form", { y: -6, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".cta-glow", {
        boxShadow: "0 0 0px rgba(255,255,255,0), 0 0 35px rgba(99,102,241,.18)",
        duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      return () => heading.revert();
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      className="py-16 md:py-32 bg-card/50 backdrop-blur-sm border-t border-b border-border relative overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="cta-wrapper text-center">
          <h2 className="cta-title text-balance text-4xl font-semibold lg:text-5xl overflow-hidden">
            Ready to Keep Your Business in Sync?
          </h2>

          <p className="cta-description mt-4 overflow-hidden">
            Give your team instant access to accurate business data, reduce time spent managing information, and focus on growing your business.
          </p>

          <div className="cta-form mx-auto mt-10 max-w-sm lg:mt-12">
            <div className="cta-glow bg-background relative flex items-center rounded-[calc(var(--radius)+0.75rem)] border pr-2 shadow shadow-zinc-950/5 gap-2">
              <Mail className="cta-mail text-caption pointer-events-none absolute left-5 size-5 text-muted-foreground" />

              <input
                type="email"
                placeholder="Your mail address"
                className="cta-input h-14 w-full bg-transparent pl-12 focus:outline-none text-sm"
              />

              {/* Simple link button — NOT nested inside a <Button> component */}
              <div className="cta-button shrink-0">
                <Link
                  href="/contact?openForm=true"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 h-10 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Request a demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

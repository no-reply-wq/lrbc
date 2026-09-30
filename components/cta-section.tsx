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
      className="py-10 md:py-20 bg-card/50 backdrop-blur-sm border-t border-b border-border relative overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="cta-wrapper text-center">
          <h2 className="cta-title text-balance text-2xl sm:text-3xl lg:text-5xl font-semibold overflow-hidden">
            Ready to Keep Your Business in Sync?
          </h2>

          <p className="cta-description mt-3 text-sm sm:text-base overflow-hidden text-muted-foreground">
            Give your team instant access to accurate business data, reduce time spent managing information, and focus on growing your business.
          </p>

          <div className="cta-form mx-auto mt-10 max-w-md lg:mt-12 px-2 sm:px-0">
            <div className="cta-glow bg-background rounded-2xl border shadow shadow-zinc-950/5 overflow-hidden">

              {/* Mobile layout — stacked */}
              <div className="flex flex-col sm:hidden p-3 gap-3">
                <div className="flex items-center gap-2 border rounded-xl px-3 h-12 bg-background">
                  <Mail className="cta-mail shrink-0 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Your mail address"
                    className="cta-input flex-1 bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <Link
                  href="/contact?openForm=true"
                  className="cta-button inline-flex items-center justify-center rounded-xl bg-primary h-12 w-full text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                
                >
                  Request a demo
                </Link>
              </div>

              {/* Desktop layout — inline */}
              <div className="hidden sm:flex items-center pr-2 pl-4 py-2 gap-2">
                <Mail className="cta-mail shrink-0 size-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Your mail address"
                  className="cta-input flex-1 h-12 bg-transparent focus:outline-none text-sm"
                />
                <Link
                  href="/contact?openForm=true"
                  className="cta-button shrink-0 inline-flex items-center justify-center rounded-xl bg-primary px-5 h-10 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
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
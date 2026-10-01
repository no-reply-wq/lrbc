"use client";

import { useRef } from "react";
import ContactFormModal from "@/components/ContactFormModal";
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
        .from(".cta-form", { opacity: 0, y: 16, duration: 0.6 }, "-=0.35");


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

          <div className="cta-form mx-auto mt-8 flex justify-center lg:mt-10">
            <ContactFormModal
              buttonText="Get a Free Walkthrough"
              source="Product page — Free walkthrough"
              className="cta-button inline-flex h-12 w-full max-w-xs items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
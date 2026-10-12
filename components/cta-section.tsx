"use client";

import { useRef } from "react";
import ContactFormModal from "@/components/ContactFormModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { padMasks } from "@/lib/split-safe";
import { useGSAP } from "@gsap/react";
import { Et, Hide, useVal } from "@/components/cms/editable";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function CallToAction({ cmsId = "cta" }: { cmsId?: string } = {}) {
  const buttonText = useVal(`${cmsId}.button`, "Get a Free Walkthrough");
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = SplitText.create(".cta-title", {
        type: "lines",
        mask: "lines", onSplit: padMasks,
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
    <Hide id={`${cmsId}.sec`}>
    <section
      ref={section}
      className="py-8 md:py-12 bg-card/50 backdrop-blur-sm border-t border-b border-border relative overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="cta-wrapper text-center">
          <Et as="h2" id={`${cmsId}.title`} def="Ready to Keep Your Business in Sync?" reload className="cta-title text-balance text-2xl sm:text-3xl lg:text-5xl font-semibold overflow-hidden" />

          <Et as="p" id={`${cmsId}.text`} def="Give your team instant access to accurate business data, reduce time spent managing information, and focus on growing your business." className="cta-description mt-3 text-sm sm:text-base overflow-hidden text-muted-foreground" />

          <div className="cta-form lrbc-cta-row">
            <ContactFormModal
              buttonText={buttonText}
              source="Product page — Free walkthrough"
              className="cta-button lrbc-btn lrbc-btn-primary sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
    </Hide>
  );
}
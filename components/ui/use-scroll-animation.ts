"use client";

import { useEffect, useRef } from "react";

/**
 * useFadeUp — attaches an IntersectionObserver to the returned ref.
 * Elements inside with class "lrbc-anim" will fade + slide up as they
 * enter the viewport. Safe on both mobile and desktop.
 *
 * Usage:
 *   const ref = useFadeUp();
 *   <section ref={ref}>
 *     <h2 className="lrbc-anim">Title</h2>
 *     <p className="lrbc-anim lrbc-anim-d1">Body</p>
 *   </section>
 *
 * Delay classes: lrbc-anim-d1 (100ms) lrbc-anim-d2 (200ms) lrbc-anim-d3 (300ms)
 */
export function useFadeUp(threshold = 0.12) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const els = Array.from(
            container.querySelectorAll<HTMLElement>(".lrbc-anim")
        );

        els.forEach((el) => {
            el.style.opacity    = "0";
            el.style.transform  = "translateY(32px)";
            el.style.transition = `opacity 0.65s ease, transform 0.65s ease`;
            el.style.transitionDelay = el.classList.contains("lrbc-anim-d3") ? "0.3s"
                : el.classList.contains("lrbc-anim-d2") ? "0.2s"
                : el.classList.contains("lrbc-anim-d1") ? "0.1s"
                : "0s";
        });

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        el.style.opacity   = "1";
                        el.style.transform = "translateY(0)";
                        obs.unobserve(el);
                    }
                });
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [threshold]);

    return ref;
}

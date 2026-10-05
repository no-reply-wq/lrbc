"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionBadge from "./section-badge";
import { useFadeUp } from "@/components/ui/use-scroll-animation";
import BeforeDashboard from "./before-dashboard";
import Dashboard from "./dashboar-view/dashboar-view";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Tag({ tone, children }: { tone: "before" | "after"; children: React.ReactNode }) {
  return (
    <span
      className={`tf-tag absolute -top-4 left-5 z-40 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold uppercase tracking-widest sm:text-sm text-white shadow-lg sm:left-8 ${
        tone === "before" ? "bg-red-500" : "bg-emerald-500"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-white/90" />
      {children}
    </span>
  );
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep
const K = 0.75; // 1px of page scroll moves a dashboard's content 1/K px — keeps the pinned stretch short

export default function Transformation() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fadeRef = useFadeUp();

  /**
   * One pinned "stage" for desktop AND mobile. Everything is driven by the page scroll, so there is
   * only ONE scroll (the native one) and it always moves at the same speed:
   *   A) the "without ERP" card's own content scrolls (only if it is taller than the card)
   *   B) the "with ERP" card slides up over it
   *   C) the dashboard's own content scrolls
   * then the stage un-pins and the page simply continues to the next section.
   */
  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const c1 = stage.querySelector<HTMLElement>(".tf-c1");
      const c2 = stage.querySelector<HTMLElement>(".tf-c2");
      if (!c1 || !c2) return;

      const dims = { a: 0, b: 1, c: 0, hold: 80, h: 0 };
      let sc1: HTMLElement | null = null;
      let sc2: HTMLElement | null = null;

      const range = (el: HTMLElement | null) => (el ? Math.max(0, el.scrollHeight - el.clientHeight) : 0);

      const pickScrollers = () => {
        sc1 = c1.querySelector<HTMLElement>("[data-tf-scroll]");
        // the dashboard's main content area = the visible scrollable region with the largest range
        const cands = Array.from(c2.querySelectorAll<HTMLElement>(".overflow-y-auto,[data-tf-driven]"));
        cands.sort((x, y) => range(y) - range(x));
        sc2 = cands[0] ?? null;
        [sc1, sc2].forEach((el) => el?.setAttribute("data-tf-driven", ""));
      };

      // thin progress rails (inside each card) replace the native scrollbars
      const mkRail = (host: HTMLElement) => {
        const rail = document.createElement("div");
        rail.className = "tf-rail";
        const thumb = document.createElement("i");
        rail.appendChild(thumb);
        host.appendChild(rail);
        return { rail, thumb };
      };
      const r1 = mkRail(c1);
      const r2 = mkRail(c2);

      const measure = () => {
        pickScrollers();
        dims.h = stage.offsetHeight;
        dims.a = Math.round(range(sc1) * K);
        dims.c = Math.round(range(sc2) * K);
        dims.b = Math.round(dims.h * 0.8);
        return dims.a + dims.b + dims.c + dims.hold;
      };

      const setRail = (r: { rail: HTMLElement; thumb: HTMLElement }, el: HTMLElement | null, v: number, max: number) => {
        if (!el || max <= 0) { r.rail.style.opacity = "0"; return; }
        const frac = clamp(el.clientHeight / el.scrollHeight, 0.15, 1);
        r.thumb.style.height = `${frac * 100}%`;
        r.thumb.style.transform = `translateY(${(v / max) * (1 / frac - 1) * 100}%)`;
        r.rail.style.opacity = "1";
      };

      const render = (px: number) => {
        const { a, b, c, h } = dims;
        const v1 = clamp(px, 0, a);
        const s = ease(clamp((px - a) / b, 0, 1));
        const v2 = clamp(px - a - b, 0, c);
        if (sc1) sc1.scrollTop = v1 / K;
        if (sc2) sc2.scrollTop = v2 / K;
        c2.style.transform = `translate3d(0, ${(1 - s) * (h + 90)}px, 0)`;
        c1.style.transform = `scale(${1 - 0.05 * s})`;
        const tag1 = c1.querySelector<HTMLElement>(".tf-tag");
        if (tag1) tag1.style.opacity = String(1 - clamp(s * 5, 0, 1));
        c1.style.filter = s > 0 ? `brightness(${1 - 0.18 * s})` : "";
        setRail(r1, sc1, v1 / K, a / K);
        // rails only make sense while their card is the one in view
        r1.rail.style.opacity = s > 0.6 ? "0" : r1.rail.style.opacity;
        setRail(r2, sc2, v2 / K, c / K);
        if (s < 0.9) r2.rail.style.opacity = "0";
      };

      let total = measure();
      const st = ScrollTrigger.create({
        trigger: stage,
        start: () => (window.innerWidth >= 768 ? "top 104px" : "top 84px"),
        end: () => "+=" + (total = measure()),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => render(self.progress * total),
        onUpdate: (self) => render(self.progress * total),
      });
      render(st.progress * total);

      // a different dashboard tab has a different height → re-measure
      let t: ReturnType<typeof setTimeout> | undefined;
      const mo = new MutationObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => ScrollTrigger.refresh(), 250);
      });
      mo.observe(c2, { childList: true, subtree: true });
      const late = setTimeout(() => ScrollTrigger.refresh(), 900); // after fonts/charts settle

      return () => {
        clearTimeout(t);
        clearTimeout(late);
        mo.disconnect();
        r1.rail.remove();
        r2.rail.remove();
        [sc1, sc2].forEach((el) => el?.removeAttribute("data-tf-driven"));
        c1.style.transform = c1.style.filter = c2.style.transform = "";
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={(el) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (fadeRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      id="transformation"
      className="relative bg-background py-8 md:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge text="The Transformation" className="lrbc-anim mb-5" />
          <h2 className="lrbc-anim lrbc-anim-d1 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">See the Difference ERP Makes</h2>
          <p className="lrbc-anim lrbc-anim-d2 mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From scattered information to connected, streamlined operations.
          </p>
        </div>

        {/* Pinned stage — both cards share one grid cell; the second slides over the first */}
        <div className="mt-12 md:mt-14">
          <div ref={stageRef} className="tf-stage grid grid-cols-[minmax(0,1fr)]">
            <div className="tf-c1 relative col-start-1 row-start-1 origin-top self-start pt-3 will-change-transform">
              <Tag tone="before">Without ERP</Tag>
              <BeforeDashboard />
            </div>
            <div className="tf-c2 relative z-10 col-start-1 row-start-1 self-start pt-3 will-change-transform">
              <Tag tone="after">With ERP</Tag>
              <Dashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

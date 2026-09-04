"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Image from "next/image";
import { Card } from "../ui/card";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AccountsCard from "../ui-2/acounts-card";


export default function TopLeft() {

     useGSAP(
    () => {

      gsap.to(".invoice-image", {
  yPercent: -8,
  ease: "none",
  scrollTrigger: {
    trigger: ".invoice-image",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

gsap.utils.toArray<HTMLElement>(".invoice-image").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) / 18;
    const y = (e.clientY - rect.top - rect.height / 2) / 18;

    gsap.to(card, {
      rotationY: x,
      rotationX: -y,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.4,
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  });
});

       

       

    },
    
  );

    return (
        <Card className="belief-card rounded-none border-0 border-r bg-background shadow-none">
  <div className="relative flex h-full flex-col overflow-hidden p-10">

    {/* Decorative Glow */}

    <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />

    {/* Image */}

    <div
      className="invoice-image relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border bg-background shadow-xl"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 70%, transparent 100%)",
      }}
    >
      <div
                                      className="relative  h-full w-full rounded-[15px]"
                                  >
                                      <AccountsCard />
                                  </div>

      {/* Floating Paper */}

      <div className="absolute right-6 top-6 w-20 rounded-2xl border bg-background p-3 shadow-sm dark:border-border">

        <div className="space-y-2">

          <div className="h-1.5 w-8 rounded-full bg-muted" />
          <div className="h-1.5 rounded-full bg-muted" />
          <div className="h-1.5 w-10 rounded-full bg-muted" />

        </div>

      </div>

    </div>

    {/* Content */}

    <div className="mx-auto mt-10 max-w-lg text-center">

      <h3 className="text-xl font-semibold">
        We See the People Behind Every Business
      </h3>

      <p className="mt-4 text-muted-foreground">

        Every business starts with someone's dream,
        years of hard work,
        and countless sacrifices.
        We build solutions that make running that
        business with ease, so you can spend less time
        managing operations and more time building
        the future.

      </p>

    </div>

  </div>
</Card>
    )
}
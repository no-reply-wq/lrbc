"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function InvoiceCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;

      /////////////////////////////////////////////
      // Scroll Parallax
      /////////////////////////////////////////////

      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /////////////////////////////////////////////
      // Floating Paper
      /////////////////////////////////////////////

      gsap.to(".invoice-paper", {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /////////////////////////////////////////////
      // Mouse Tilt
      /////////////////////////////////////////////

      const move = (e: MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();

        const x =
          (e.clientX - rect.left - rect.width / 2) / 20;

        const y =
          (e.clientY - rect.top - rect.height / 2) / 20;

        gsap.to(containerRef.current, {
          rotationY: x,
          rotationX: -y,
          transformPerspective: 1200,
          transformOrigin: "center",
          duration: 0.45,
          ease: "power3.out",
        });
      };

      const leave = () => {
        gsap.to(containerRef.current, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      };

      containerRef.current.addEventListener("mousemove", move);
      containerRef.current.addEventListener("mouseleave", leave);

      return () => {
        containerRef.current?.removeEventListener("mousemove", move);
        containerRef.current?.removeEventListener("mouseleave", leave);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col overflow-hidden p-10"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />

      {/* Dashboard */}

      <div
        ref={imageRef}
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border bg-background shadow-2xl"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 68%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 68%, transparent 100%)",
        }}
      >
        <Image
          src="/images/invoice-dashboard.png"
          alt="Invoice Dashboard"
          width={900}
          height={500}
          className="w-full object-cover"
        />

        {/* Floating Invoice */}

        <Card className="invoice-paper absolute right-6 top-6 w-48 rounded-2xl shadow-xl">
          <CardContent className="space-y-3 p-4">
            <Badge className="rounded-full">
              Invoice
            </Badge>

            <div className="space-y-2">

              <div className="h-2 rounded-full bg-muted" />

              <div className="h-2 w-20 rounded-full bg-muted" />

            </div>

            <div className="rounded-xl bg-primary/10 p-3">

              <p className="text-xs text-muted-foreground">
                Amount
              </p>

              <p className="mt-1 font-semibold">
                $2,480.00
              </p>

            </div>

            <div className="flex justify-between text-xs">

              <span className="text-muted-foreground">
                Status
              </span>

              <span className="font-medium text-green-500">
                Paid
              </span>

            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats */}

        <Card className="absolute bottom-6 left-6 rounded-xl shadow-xl">
          <CardContent className="flex items-center gap-4 px-4 py-3">

            <div>

              <p className="text-xs text-muted-foreground">
                Revenue
              </p>

              <p className="font-semibold">
                +24%
              </p>

            </div>

            <div className="h-10 w-px bg-border" />

            <div>

              <p className="text-xs text-muted-foreground">
                Clients
              </p>

              <p className="font-semibold">
                124
              </p>

            </div>

          </CardContent>
        </Card>
      </div>

      {/* Text */}

      <div className="mx-auto mt-10 max-w-lg text-center">

        

        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          Every Decision Begins with Trust

        </h3>

        <p className="mt-5 leading-8 text-muted-foreground">
         Technology can automate processes, but trust is built through people. That's why transparency, integrity,  guide every decision we make.
        </p>
      </div>
    </div>
  );
}
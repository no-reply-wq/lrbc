"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Globe2,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const locations = [
  {
    city: "Nairobi",
    top: "43%",
    left: "56%",
  },
  {
    city: "London",
    top: "28%",
    left: "48%",
  },
  {
    city: "New York",
    top: "35%",
    left: "24%",
  },
  {
    city: "Dubai",
    top: "39%",
    left: "63%",
  },
];

export default function MapCard() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    //////////////////////////////////////////
    // Floating Pins
    //////////////////////////////////////////

    gsap.to(".map-pin", {
      y: -8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
      ease: "sine.inOut",
    });

    //////////////////////////////////////////
    // Glow Pulse
    //////////////////////////////////////////

    gsap.to(".pin-glow", {
      scale: 1.6,
      opacity: 0,
      duration: 2,
      repeat: -1,
      stagger: 0.25,
      ease: "power2.out",
    });

    //////////////////////////////////////////
    // Mouse Tilt
    //////////////////////////////////////////

    if (!container.current) return;

    const move = (e: MouseEvent) => {
      const rect = container.current!.getBoundingClientRect();

      const x =
        (e.clientX - rect.left - rect.width / 2) / 20;

      const y =
        (e.clientY - rect.top - rect.height / 2) / 20;

      gsap.to(container.current, {
        rotationY: x,
        rotationX: -y,
        transformPerspective: 1200,
        duration: .45,
      });
    };

    const leave = () => {
      gsap.to(container.current, {
        rotationX: 0,
        rotationY: 0,
        duration: .5,
      });
    };

    container.current.addEventListener("mousemove", move);
    container.current.addEventListener("mouseleave", leave);

    return () => {
      container.current?.removeEventListener(
        "mousemove",
        move
      );

      container.current?.removeEventListener(
        "mouseleave",
        leave
      );
    };
  });

  return (
    <div
      ref={container}
      className="relative flex h-full flex-col overflow-hidden p-10"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Background Glow */}

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      {/* Header */}

      <div className="mb-10 max-w-md">

        <Badge
          variant="secondary"
          className="rounded-full"
        >
          Global Reach
        </Badge>

        <h3 className="mt-5 text-2xl font-semibold">
          Because Growth Should Never Feel Out of Reach
        </h3>

        <p className="mt-5 leading-8 text-muted-foreground">
          Whether you're managing ten employees
          or a thousand orders, we're here to build
          solutions that help your business grow
          with confidence.
        </p>

      </div>

      {/* Map */}

      <div className="relative mx-auto w-full max-w-3xl">

        <Image
          src="/images/world-map.png"
          alt=""
          width={1200}
          height={700}
          className="opacity-70 dark:opacity-50"
        />

        {locations.map((location) => (
          <div
            key={location.city}
            style={{
              top: location.top,
              left: location.left,
            }}
            className="absolute"
          >
            <div className="pin-glow absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-50 blur-sm" />

            <div className="map-pin relative flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-lg">

              <div className="h-2 w-2 rounded-full bg-background" />

            </div>
          </div>
        ))}

        {/* Floating Card */}

        <Card className="absolute right-8 top-8 w-56 shadow-xl">

          <CardContent className="space-y-3 p-5">

            <div className="flex items-center gap-3">

              <Globe2 className="h-5 w-5 text-primary" />

              <p className="font-medium">
                Worldwide Support
              </p>

            </div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">

                <span>Countries</span>

                <span className="font-medium">
                  18+
                </span>

              </div>

              <div className="flex justify-between">

                <span>Businesses</span>

                <span className="font-medium">
                  600+
                </span>

              </div>

              <div className="flex justify-between">

                <span>Availability</span>

                <span className="text-green-500">
                  24/7
                </span>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* Bottom Card */}

        <Card className="absolute bottom-8 left-8 shadow-xl">

          <CardContent className="flex items-center gap-3 px-5 py-4">

            <ArrowUpRight className="h-5 w-5 text-primary" />

            <div>

              <p className="text-xs text-muted-foreground">
                Active Connections
              </p>

              <p className="font-semibold">
                +132 this month
              </p>

            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  );
}
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  value: number;
  suffix?: string;
  title: string;
  description: string;
  color?: string;
};

export default function StatsCard({
  value,
  suffix = "%",
  title,
  description,
  color = "hsl(var(--primary))",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      if (!valueRef.current || !ringRef.current) return;

      const radius = 44;
      const circumference = 2 * Math.PI * radius;

      gsap.set(ringRef.current, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });

      const obj = { value: 0 };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",

        onEnter: () => {
          gsap.to(obj, {
            value,
            duration: 1.6,
            ease: "power3.out",

            onUpdate: () => {
              valueRef.current!.textContent = Math.round(
                obj.value
              ).toString();

              const progress =
                circumference -
                (obj.value / 100) * circumference;

              gsap.set(ringRef.current, {
                strokeDashoffset: progress,
              });
            },
          });
        },
      });

      gsap.to(containerRef.current, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <Card className="group h-full rounded-none border-0 bg-transparent shadow-none">
      <CardContent className="flex h-full flex-col items-center justify-center gap-8 p-10">

        {/* Ring */}

        <div
          ref={containerRef}
          className="relative"
        >
          <svg
            width="110"
            height="110"
            className="-rotate-90"
          >
            <circle
              cx="55"
              cy="55"
              r="44"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="7"
            />

            <circle
              ref={ringRef}
              cx="55"
              cy="55"
              r="44"
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="7"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span
                ref={valueRef}
                className="text-4xl font-bold tracking-tight"
              >
                0
              </span>

              <span className="text-2xl font-semibold">
                {suffix}
              </span>
            </div>
          </div>
        </div>

        {/* Text */}

        <div className="space-y-2 text-center">

          <h4 className="text-lg font-semibold">
            {title}
          </h4>

          <p className="text-sm leading-7 text-muted-foreground">
            {description}
          </p>

        </div>
      </CardContent>
    </Card>
  );
}
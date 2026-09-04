"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";


gsap.registerPlugin(useGSAP);

type DashboardHeaderProps = {
  title: string;
  description: string;
  badge?: ReactNode;
  action?: ReactNode;
};

export default function DashboardHeader({
  title,
  description,
  badge,
  action,
}: DashboardHeaderProps) {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".dashboard-header-title", {
        y: 18,
        opacity: 0,
        duration: 0.45,
      })
        .from(
          ".dashboard-header-badge",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
          },
          "-=0.25"
        )
        .from(
          ".dashboard-header-description",
          {
            y: 12,
            opacity: 0,
            duration: 0.35,
          },
          "-=0.2"
        )
        .from(
          ".dashboard-header-action",
          {
            x: 20,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.3"
        );
    },
    {
      scope: container,
      dependencies: [title],
      revertOnUpdate: true,
    }
  );

  return (
    <header
      ref={container}
      className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="dashboard-header-title text-sm md:text-xl font-bold">
            {title}
          </h1>

          {badge && (
            <div className="dashboard-header-badge">
              {badge}
            </div>
          )}
        </div>

        <p className="dashboard-header-description text-xs md:text-[10px] font-light text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="dashboard-header-action">
        {action ?? (
          <Button className="text-xs">
            Contact Our Team
          </Button>
        )}
      </div>
    </header>
  );
}
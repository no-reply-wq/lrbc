"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Plus,
  Check,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const integrations = [
  {
    name: "Slack",
    logo: "/logos/slack.svg",
  },
  {
    name: "Stripe",
    logo: "/logos/stripe.svg",
  },
  {
    name: "Shopify",
    logo: "/logos/shopify.svg",
  },
  {
    name: "HubSpot",
    logo: "/logos/hubspot.svg",
  },
];

export default function IntegrationsCard() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /////////////////////////////////////////
      // floating animation
      /////////////////////////////////////////

      gsap.to(".floating-panel", {
        y: -12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
        ease: "sine.inOut",
      });

      /////////////////////////////////////////
      // glow pulse
      /////////////////////////////////////////

      gsap.to(".glow", {
        scale: 1.15,
        opacity: 0.9,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /////////////////////////////////////////
      // mouse tilt
      /////////////////////////////////////////

      const el = container.current;

      if (!el) return;

      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();

        const x =
          (e.clientX - rect.left - rect.width / 2) / 18;

        const y =
          (e.clientY - rect.top - rect.height / 2) / 18;

        gsap.to(el, {
          rotationY: x,
          rotationX: -y,
          transformPerspective: 1200,
          transformOrigin: "center",
          duration: 0.45,
          ease: "power3.out",
        });
      };

      const leave = () => {
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
        });
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);

      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="relative flex h-full flex-col items-center justify-center overflow-hidden p-10"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Animated Glow */}

      <div className="glow absolute top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px] dark:bg-violet-500/30" />

      <div className="glow absolute right-12 top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-[80px]" />

      <div className="glow absolute bottom-8 left-8 h-36 w-36 rounded-full bg-pink-500/20 blur-[70px]" />

      {/* Main Window */}

      <Card className="relative z-20 w-full max-w-md rounded-3xl border bg-background/90 shadow-2xl backdrop-blur-xl">
        <CardContent className="space-y-8 p-8">
          <div className="space-y-2">
            <Badge variant="secondary">
              Integrations
            </Badge>

            <h3 className="text-xl font-semibold">
              Every Decision Begins with Trust
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              Technology can automate processes,
              but trust is built through people.
              That's why transparency,
              integrity,
              and accountability guide every
              decision we make.
            </p>
          </div>

          <div className="space-y-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="floating-panel flex items-center justify-between rounded-2xl border bg-background/80 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={24}
                      height={24}
                    />
                  </div>

                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Connected
                    </p>
                  </div>
                </div>

                <Check className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>

          <Button
            className="w-full rounded-xl"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </CardContent>
      </Card>

      {/* Floating Cards */}

      <Card className="floating-panel absolute left-2 top-20 w-44 rotate-[-8deg] rounded-2xl bg-background/80 backdrop-blur-lg shadow-xl">
        <CardContent className="space-y-2 p-4">
          <p className="text-sm font-medium">
            Security
          </p>

          <div className="h-2 rounded-full bg-primary/30" />

          <div className="h-2 w-3/4 rounded-full bg-primary/20" />
        </CardContent>
      </Card>

      <Card className="floating-panel absolute bottom-10 right-4 w-48 rotate-6 rounded-2xl bg-background/80 backdrop-blur-lg shadow-xl">
        <CardContent className="space-y-2 p-4">
          <p className="text-sm font-medium">
            Connected Apps
          </p>

          <div className="flex gap-2">
            {["bg-violet-500", "bg-cyan-500", "bg-pink-500"].map(
              (c) => (
                <div
                  key={c}
                  className={`h-8 w-8 rounded-full ${c}`}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
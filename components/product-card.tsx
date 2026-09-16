"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import ReceivablesAgingChart from "./dashboar-view/components/receivables-aging-chart";
import WorkPilotMini from "./workpilot-mini";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    href: string;
    description: string;
    image: string;
    features: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      className="
        h-full
        overflow-hidden
        rounded-[36px]
        border-white/10
        bg-gradient-to-br
        from-background
        via-background
        to-muted/40
        shadow-sm
        backdrop-blur-xl
      "
    >
      <CardContent className="grid gap-8 p-6 sm:gap-12 sm:p-10 lg:grid-cols-[420px_1fr] lg:p-14">
        {/* Left */}

        <div className="flex flex-col justify-between">
          <div>
           

            <h3 className="mt-4 text-4xl sm:mt-6 sm:text-5xl font-semibold tracking-tight">
              {product.title}
            </h3>

            <p className="text-muted-foreground mt-4 text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    bg-background/70
                    px-4
                    py-2
                    text-sm
                    shadow-sm
                    backdrop-blur
                  "
                >
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="group mt-8 sm:mt-12 w-fit overflow-hidden rounded-full px-8"
          >
            <Link
              href={product.href}
              className="flex items-center gap-2"
            >
              <span className="relative h-6 overflow-hidden">
                <span
                  className="
          flex
          flex-col
          transition-transform
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          group-hover:-translate-y-1/2
        "
                >
                  <span className="h-6 leading-6">
                    Explore {product.title}
                  </span>

                  <span className="h-6 leading-6">
                    View Product
                  </span>
                </span>
              </span>

              <ArrowUpRight
                className="
        h-4
        w-4
        transition-transform
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        group-hover:rotate-45
      "
              />
            </Link>
          </Button>
        </div>

        {/* Right — chart visible on all screen sizes */}
        <div className="relative flex items-center justify-center h-[340px] sm:h-[420px] lg:h-full">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-2xl">
            <div className="relative h-full p-2">
              {product.id === "workpilot" ? <WorkPilotMini /> : <ReceivablesAgingChart />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
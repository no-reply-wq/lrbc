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
import TeamPerformanceCard from "./dashboar-view/components/team-performance-card";

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
      <CardContent className="grid h-full gap-12 p-10 lg:grid-cols-[420px_1fr] lg:p-14">
        {/* Left */}

        <div className="flex flex-col justify-between">
          <div>
           

            <h3 className="mt-6 text-5xl font-semibold tracking-tight">
              {product.title}
            </h3>

            <p className="text-muted-foreground mt-6 text-lg leading-8">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
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
            className="group mt-12 w-fit overflow-hidden rounded-full px-8"
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

        {/* Right */}

        <div className="relative flex items-center justify-center">
          {/* Background glow */}

          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />

          {/* Window */}

          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#171717]
              shadow-2xl
            "
          >
            

            {/* Image */}

            <div className="relative h-full">
              <TeamPerformanceCard />
           
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
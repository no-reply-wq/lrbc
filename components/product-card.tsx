"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="overflow-hidden rounded-2xl md:rounded-[36px] border border-border/60 bg-gradient-to-br from-background via-background to-muted/40 shadow-sm">
      <CardContent className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[400px_1fr] lg:gap-12 lg:p-14">

        {/* ── LEFT: text content ─────────────────────────── */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {product.title}
            </h3>

            <p className="text-muted-foreground mt-3 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7">
              {product.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs sm:text-sm shadow-sm"
                >
                  <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group w-full sm:w-fit overflow-hidden rounded-full px-8 transition-all duration-200"
          >
            <Link href={product.href} className="flex items-center gap-2">
              <span className="relative h-6 overflow-hidden">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1/2">
                  <span className="h-6 leading-6">Explore {product.title}</span>
                  <span className="h-6 leading-6">View Product</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45" />
            </Link>
          </Button>
        </div>

        {/* ── RIGHT: live chart component ────────────────── */}
        {/*
            Mobile: fixed height so chart is fully visible (not cut off)
            Desktop: fills the remaining grid column height
        */}
        <div className="relative">
          {/* Glow behind chart */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl pointer-events-none" />

          {/* Chart container — macOS window chrome */}
          <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[28px] border border-border/60 bg-background shadow-xl">
            {/* Window title bar */}
            <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-4 py-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[10px] text-muted-foreground font-medium">
                {product.title}
              </span>
            </div>

            {/* Chart — explicit height on mobile so it's never cut off */}
            <div className="h-[300px] sm:h-[360px] lg:h-[420px] p-2">
              {product.id === "workpilot"
                ? <WorkPilotMini />
                : <ReceivablesAgingChart />
              }
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

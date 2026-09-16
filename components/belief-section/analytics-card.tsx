"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";
import RevenueMixCard from "../dashboar-view/components/revenue-mix-card";

export default function AnalyticsCard() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden p-10">

      {/* Background Glow */}

      <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />

      {/* Header */}

      <div className="relative z-10 mb-10 flex items-start justify-between">

        <div>

          <Badge
            variant="secondary"
            className="rounded-full"
          >
            Business Analytics
          </Badge>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            Turn Data Into Better Decisions
          </h3>

          <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
            Monitor revenue, customer activity,
            orders and performance from one
            beautifully designed dashboard.
          </p>

        </div>

        <div className="rounded-2xl border bg-background px-4 py-2 shadow-sm">

          <p className="text-xs text-muted-foreground">
            This Month
          </p>

          <p className="text-xs font-semibold">
            July 2026
          </p>

        </div>

      </div>

      {/* Dashboard */}

      

        <RevenueMixCard />


    </div>
  );
}
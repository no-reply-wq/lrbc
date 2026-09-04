"use client";

import {
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Metric = {
  label: string;
  current: string;
  target: string;
};

const metrics: Metric[] = [
  {
    label: "Leads",
    current: "100",
    target: "120",
  },
  {
    label: "Conversion Ratio (C)",
    current: "10%",
    target: "12%",
  },
  {
    label: "No. of Clients",
    current: "10",
    target: "14.4",
  },
  {
    label: "Avg Rs Sale (A)",
    current: "₹2,00,000",
    target: "₹2,40,000",
  },
];

export default function MagicOfNumbersCard() {
  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />

          <CardTitle className="text-lg">
            The Magic of Numbers
          </CardTitle>

          <Badge variant="secondary">
            Double Profits Engine
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">

          {/* Current Month */}

          <section className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline">
                Current Month
              </Badge>
            </div>

            <div className="rounded-lg border overflow-hidden">
              {metrics.map((metric, index) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>

                    <span className="font-semibold">
                      {metric.current}
                    </span>
                  </div>

                  {index !== metrics.length - 1 && <Separator />}
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between bg-muted/50 px-4 py-4">
                <span className="font-semibold text-primary">
                  Revenue
                </span>

                <span className="font-bold text-lg">
                  ₹20,00,000
                </span>
              </div>
            </div>
          </section>

          {/* Middle */}

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">

              <Badge className="rounded-full px-3 py-1">
                +20%
              </Badge>

              <ArrowRight className="h-6 w-6 text-muted-foreground" />

            </div>
          </div>

          {/* Target */}

          <section className="space-y-4">
            <div className="flex justify-center">
              <Badge>
                Target State (+20%)
              </Badge>
            </div>

            <div className="rounded-lg border overflow-hidden">
              {metrics.map((metric, index) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>

                    <span className="font-semibold text-primary">
                      {metric.target}
                    </span>
                  </div>

                  {index !== metrics.length - 1 && <Separator />}
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between rounded-b-lg bg-primary/10 px-4 py-4">
                <span className="font-semibold text-primary">
                  Revenue (100% Increase)
                </span>

                <span className="text-lg font-bold text-primary">
                  ₹34,56,000
                </span>
              </div>
            </div>
          </section>

        </div>
      </CardContent>
    </Card>
  );
}
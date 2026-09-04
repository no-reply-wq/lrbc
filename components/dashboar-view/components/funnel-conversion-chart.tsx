"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    stage: "Leads",
    value: 100,
  },
  {
    stage: "Meet",
    value: 48,
  },
  {
    stage: "Proposal",
    value: 28,
  },
  {
    stage: "Negotiation",
    value: 16,
  },
  {
    stage: "Closed",
    value: 10,
  },
];

export default function FunnelConversionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Funnel Conversion Drop-off
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 12,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="conversionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
              />

              <XAxis
                dataKey="stage"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "hsl(var(--primary))",
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#conversionGradient)"
                activeDot={{
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
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
    month: "Apr",
    actual: 38.5,
    plan: 32.5,
  },
  {
    month: "May",
    actual: 41.8,
    plan: 36.0,
  },
  {
    month: "Jun",
    actual: 45.5,
    plan: 40.0,
  },
];

export default function ReceivablesTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Receivables Trend (Q1)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="actualGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--destructive))"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="hsl(var(--destructive))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.15}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `₹${v}L`}
              />

              <Tooltip
                formatter={(value) => [`₹${value}L`, ""]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Legend />

              {/* Actual */}

              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="hsl(var(--destructive))"
                strokeWidth={2.5}
                fill="url(#actualGradient)"
                activeDot={{
                  r: 5,
                }}
              />

              {/* Plan */}

              <Line
                type="monotone"
                dataKey="plan"
                name="Plan"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
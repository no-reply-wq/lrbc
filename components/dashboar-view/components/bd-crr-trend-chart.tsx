"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
    crr: 27.2,
    nbd: 4.8,
  },
  {
    month: "May",
    crr: 29.2,
    nbd: 7.3,
  },
  {
    month: "Jun",
    crr: 31.9,
    nbd: 10.6,
  },
];

export default function NbdCrrTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          NBD & CRR Revenue Trend (Q1)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap={50}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
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
                tickFormatter={(value) => `${value}L`}
              />

              <Tooltip
                formatter={(value) => [`₹${value}L`, "Revenue"]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Legend />

              {/* Existing Clients */}

              <Bar
                dataKey="crr"
                name="CRR"
                stackId="revenue"
                radius={[0, 0, 8, 8]}
                fill="hsl(var(--primary))"
              />

              {/* New Business */}

              <Bar
                dataKey="nbd"
                name="NBD"
                stackId="revenue"
                radius={[8, 8, 0, 0]}
                fill="hsl(var(--chart-2, var(--primary)))"
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
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
    week: "W1",
    onTime: 15,
    late: 8,
  },
  {
    week: "W2",
    onTime: 12,
    late: 10,
  },
  {
    week: "W3",
    onTime: 18,
    late: 12,
  },
  {
    week: "W4",
    onTime: 15,
    late: 10,
  },
];

export default function WeeklyDeliveryChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Weekly Delivery Adherence
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap={40}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
              />

              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{
                  fill: "hsl(var(--muted))",
                  opacity: 0.15,
                }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
                formatter={(value, name) => [
                  value,
                  name === "onTime" ? "On Time" : "Late",
                ]}
              />

              <Legend
                formatter={(value) =>
                  value === "onTime" ? "On Time" : "Late"
                }
              />

              <Bar
                dataKey="onTime"
                stackId="delivery"
                name="onTime"
                fill="hsl(var(--chart-2))"
                radius={[0, 0, 8, 8]}
              />

              <Bar
                dataKey="late"
                stackId="delivery"
                name="late"
                fill="hsl(var(--destructive))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
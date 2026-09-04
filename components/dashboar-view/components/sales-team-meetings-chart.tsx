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
    name: "Amit",
    actual: 38,
    target: 40,
  },
  {
    name: "Priya",
    actual: 28,
    target: 28,
  },
  {
    name: "Rahul",
    actual: 18,
    target: 20,
  },
  {
    name: "Neha",
    actual: 12,
    target: 14,
  },
];

export default function SalesTeamMeetingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Sales Team Meetings (Me)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barGap={8}
              barCategoryGap={24}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.25}
              />

              <XAxis
                dataKey="name"
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
                  fill: "hsl(var(--muted))",
                  opacity: 0.15,
                }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Legend />

              <Bar
                dataKey="actual"
                name="Actual"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--primary))"
              />

              <Bar
                dataKey="target"
                name="Target"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--muted-foreground))"
                opacity={0.35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
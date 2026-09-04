"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
    bucket: "<30",
    value: 25,
    color: "hsl(var(--chart-2))",
  },
  {
    bucket: "30-60",
    value: 12,
    color: "hsl(var(--chart-3))",
  },
  {
    bucket: "60-90",
    value: 6,
    color: "hsl(var(--destructive))",
  },
  {
    bucket: ">90",
    value: 2,
    color: "hsl(var(--chart-5))",
  },
  {
    bucket: "Disp",
    value: 1,
    color: "hsl(var(--muted-foreground))",
  },
];

export default function ReceivablesAgingChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Accounts Receivable Aging
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap={30}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
              />

              <XAxis
                dataKey="bucket"
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
                formatter={(value) => [
                  `₹${value}L`,
                  "Receivables",
                ]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.bucket}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}

        <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm">

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
            <span className="text-muted-foreground">
              Healthy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]" />
            <span className="text-muted-foreground">
              Watch
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">
              High Risk
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-5))]" />
            <span className="text-muted-foreground">
              Critical
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">
              Disputed
            </span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
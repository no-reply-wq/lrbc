"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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

// Brand ramp: deep violet (healthy) -> fuchsia (critical), slate for disputed
const data = [
  { bucket: "<30", value: 25, color: "#5227FF" },   // Healthy
  { bucket: "30-60", value: 12, color: "#7c5cf6" }, // Watch
  { bucket: "60-90", value: 6, color: "#a855f7" },  // High Risk
  { bucket: ">90", value: 2, color: "#d946ef" },    // Critical
  { bucket: "Disp", value: 1, color: "#94a3b8" },   // Disputed
];

const LEGEND = [
  { label: "Healthy", color: "#5227FF" },
  { label: "Watch", color: "#7c5cf6" },
  { label: "High Risk", color: "#a855f7" },
  { label: "Critical", color: "#d946ef" },
  { label: "Disputed", color: "#94a3b8" },
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
              barCategoryGap="20%"
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
              />

              <XAxis
                dataKey="bucket"
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />

              <Tooltip
                cursor={{
                  fill: "var(--muted)",
                  opacity: 0.15,
                }}
                formatter={(value) => [
                  `₹${value}L`,
                  "Receivables",
                ]}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}
              />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  offset={6}
                  style={{ fontSize: 11, fontWeight: 600, fill: "var(--foreground)" }}
                />
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
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

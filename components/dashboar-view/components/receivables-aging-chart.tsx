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
  { bucket: "<30", value: 25, color: "#22c55e" },   // Healthy - green
  { bucket: "30-60", value: 12, color: "#eab308" }, // Watch - yellow
  { bucket: "60-90", value: 6, color: "#f97316" },  // High Risk - orange
  { bucket: ">90", value: 2, color: "#ef4444" },    // Critical - red
  { bucket: "Disp", value: 1, color: "#9ca3af" },   // Disputed - gray
];

const LEGEND = [
  { label: "Healthy", color: "bg-green-500" },
  { label: "Watch", color: "bg-yellow-500" },
  { label: "High Risk", color: "bg-orange-500" },
  { label: "Critical", color: "bg-red-500" },
  { label: "Disputed", color: "bg-gray-400" },
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
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${item.color}`} />
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

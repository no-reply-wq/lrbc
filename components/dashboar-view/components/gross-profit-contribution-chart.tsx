"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "Product 1",
    value: 22,
    color: "hsl(var(--chart-1))",
  },
  {
    name: "Product 2",
    value: 46,
    color: "hsl(var(--chart-2))",
  },
  {
    name: "Product 3",
    value: 32,
    color: "hsl(var(--chart-3))",
  },
];

export default function GrossProfitContributionChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Gross Profit Contribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${value}%`, "Contribution"]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
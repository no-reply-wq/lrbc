"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "Achieved",
    value: 25,
  },
  {
    name: "Remaining",
    value: 75,
  },
];

export default function RatioShiftCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Ratio Shift (Goal: 50/50)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative h-[260px]">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={72}
                outerRadius={92}
                paddingAngle={0}
                stroke="none"
              >
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-4xl font-bold tracking-tight">
              25%
            </span>

            <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              NBD Achieved
            </span>

          </div>

        </div>

        {/* Legend */}

        <div className="mt-4 grid grid-cols-2 gap-4">

          <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
            <div className="h-3 w-3 rounded-full bg-primary" />

            <div className="text-center">
              <p className="text-sm font-medium">
                Achieved
              </p>

              <p className="text-xs text-muted-foreground">
                25%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
            <div className="h-3 w-3 rounded-full bg-muted" />

            <div className="text-center">
              <p className="text-sm font-medium">
                Remaining
              </p>

              <p className="text-xs text-muted-foreground">
                75%
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
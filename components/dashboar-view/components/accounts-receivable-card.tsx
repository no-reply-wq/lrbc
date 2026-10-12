"use client";

import { motion } from "motion/react";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const receivableData = [
  { month: "Jan", value: 3.2 },
  { month: "Feb", value: 4.4 },
  { month: "Mar", value: 5.8 },
  { month: "Apr", value: 4.9 },
  { month: "May", value: 6.7 },
  { month: "Jun", value: 7.3 },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-primary/25 bg-popover px-4 py-3 shadow-xl">
      <p className="text-foreground text-sm">
        {payload[0].payload.month}
      </p>

      <p className="mt-1 font-semibold text-primary">
        ₹ {payload[0].value}M
      </p>
    </div>
  );
}

export default function AccountsReceivableCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="h-full rounded-2xl border border-primary/25 bg-[color-mix(in_oklab,var(--primary)_6%,var(--background))] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_45px_rgba(124,58,237,.15)] dark:border-[#3a3399]/70 dark:bg-[#15123a]">

        <CardHeader>

          <CardTitle className="text-foreground">
            Accounts Receivable
          </CardTitle>

          <CardDescription>
            Outstanding balance trend
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-muted-foreground text-sm">
                Outstanding
              </p>

              <h2 className="text-4xl font-bold text-foreground">
                ₹15.2M
              </h2>

            </div>

            <div className="rounded-xl bg-primary/15 px-4 py-2 font-medium text-primary">

              +8.2%

            </div>

          </div>

          <div className="h-[240px]">

            <ResponsiveContainer>

              <AreaChart data={receivableData}>

                <defs>

                  <linearGradient id="receivable">

                    <stop offset="0%" stopColor="#7c5cf6" stopOpacity={0.6} />

                    <stop offset="100%" stopColor="#7c5cf6" stopOpacity={0} />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#5227FF"
                  strokeWidth={3}
                  fill="url(#receivable)"
                  animationDuration={1800}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </CardContent>

      </Card>
    </motion.div>
  );
}
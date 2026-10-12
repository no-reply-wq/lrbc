"use client";

import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const data = [
  { stage: "Leads", value: 420 },
  { stage: "Qualified", value: 320 },
  { stage: "Proposal", value: 210 },
  { stage: "Negotiation", value: 130 },
  { stage: "Won", value: 92 },
];

const colors = [
  "#5227FF",
  "#6d4cf6",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-primary/25 bg-popover px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-foreground">
        {payload[0].payload.stage}
      </p>

      <p className="mt-1 text-primary font-semibold">
        {payload[0].value} opportunities
      </p>
    </div>
  );
}

export default function SalesFunnelCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: .45 }}
    >
      <Card className="h-full rounded-2xl border border-primary/25 bg-[color-mix(in_oklab,var(--primary)_6%,var(--background))] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_45px_rgba(124,58,237,.15)] dark:border-[#3a3399]/70 dark:bg-[#15123a]">

        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">

          <div>

            <CardTitle className="text-lg text-foreground">
              Sales Funnel
            </CardTitle>

            <CardDescription>
              Lead → Order Conversion
            </CardDescription>

          </div>

          <div className="text-right">

            <p className="text-3xl font-bold text-foreground">
              22%
            </p>

            <p className="text-xs font-medium text-primary">
              +4.1% this month
            </p>

          </div>

        </CardHeader>

        <CardContent>

          <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">

            <div className="min-w-0 rounded-xl bg-primary/10 dark:bg-white/5 p-3 sm:p-4">

              <p className="text-xs text-muted-foreground">
                Total Leads
              </p>

              <h3 className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-2xl">
                420
              </h3>

            </div>

            <div className="min-w-0 rounded-xl bg-primary/10 dark:bg-white/5 p-3 sm:p-4">

              <p className="text-xs text-muted-foreground">
                Qualified
              </p>

              <h3 className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-2xl">
                320
              </h3>

            </div>

            <div className="min-w-0 rounded-xl bg-primary/10 dark:bg-white/5 p-3 sm:p-4">

              <p className="text-xs text-muted-foreground">
                Closed
              </p>

              <h3 className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-2xl">
                92
              </h3>

            </div>

          </div>

          <div className="h-[240px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={data}
                margin={{
                  top: 10,
                  left: -10,
                  right: 0,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dataKey="stage"
                  interval={0}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ fill: "var(--primary)", opacity: 0.06 }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={colors[index]}
                    />
                  ))}
                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </CardContent>

      </Card>
    </motion.div>
  );
}
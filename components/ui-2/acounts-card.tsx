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
    <div className="rounded-xl border border-zinc-700 bg-[#151821] px-4 py-3 shadow-xl">
      <p className="text-white text-sm">
        {payload[0].payload.month}
      </p>

      <p className="mt-1 font-semibold text-violet-400">
        ₹ {payload[0].value}M
      </p>
    </div>
  );
}

export default function AccountsCard() {
  return (
    <motion.div
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="h-full w-full"
>
      <Card className="h-full w-full rounded-[15px] border-0 bg-transparent shadow-none">

        <CardHeader>

          <CardTitle className="text-white">
            Accounts Receivable
          </CardTitle>

          <CardDescription>
            Outstanding balance trend
          </CardDescription>

        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-zinc-400 text-sm">
                Outstanding
              </p>

              <h2 className="text-4xl font-bold text-white">
                ₹15.2M
              </h2>

            </div>

            <div className="rounded-xl bg-emerald-500/15 px-4 py-2 text-emerald-400">

              +8.2%

            </div>

          </div>

          <div className="flex-1 min-h-0">

            <ResponsiveContainer>

              <AreaChart data={receivableData}>

                <defs>

                  <linearGradient id="receivable">

                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />

                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#2d3342"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af" }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
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
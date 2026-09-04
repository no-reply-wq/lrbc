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
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-zinc-700 bg-[#151821] px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-white">
        {payload[0].payload.stage}
      </p>

      <p className="mt-1 text-violet-400 font-semibold">
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
      <Card className="h-full rounded-2xl border border-[#293041] bg-[#191c24] transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_45px_rgba(124,58,237,.15)]">

        <CardHeader className="flex-row items-center justify-between space-y-0">

          <div>

            <CardTitle className="text-lg text-white">
              Sales Funnel
            </CardTitle>

            <CardDescription>
              Lead → Order Conversion
            </CardDescription>

          </div>

          <div className="text-right">

            <p className="text-3xl font-bold text-white">
              22%
            </p>

            <p className="text-xs text-emerald-400">
              +4.1% this month
            </p>

          </div>

        </CardHeader>

        <CardContent>

          <div className="mb-8 grid grid-cols-3 gap-4">

            <div className="rounded-xl bg-[#202430] p-4">

              <p className="text-xs text-zinc-400">
                Total Leads
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                420
              </h3>

            </div>

            <div className="rounded-xl bg-[#202430] p-4">

              <p className="text-xs text-zinc-400">
                Qualified
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                320
              </h3>

            </div>

            <div className="rounded-xl bg-[#202430] p-4">

              <p className="text-xs text-zinc-400">
                Closed
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
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
                  stroke="#2d3342"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8f96a3", fontSize: 12 }}
                  dataKey="stage"
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8f96a3", fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,.02)" }}
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
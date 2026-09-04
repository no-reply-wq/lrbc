"use client";

import { motion } from "motion/react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
    rep: "Alex",
    target: 85,
    achieved: 92,
  },
  {
    rep: "Brian",
    target: 90,
    achieved: 81,
  },
  {
    rep: "Jane",
    target: 80,
    achieved: 87,
  },
  {
    rep: "Mary",
    target: 88,
    achieved: 95,
  },
  {
    rep: "David",
    target: 84,
    achieved: 79,
  },
];

export default function TeamPerformanceCard() {
  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="flex h-full w-full flex-col rounded-2xl border border-[#293041] bg-[#191c24] transition-all duration-300 hover:border-violet-500/40">
        <CardHeader className="shrink-0">
          <CardTitle className="text-white">
            Sales Team Performance
          </CardTitle>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col">
          {/* Stats */}
          <div className="mb-6 grid shrink-0 grid-cols-3 gap-4 bg-[#202430]">
            <div className="rounded-xl bg-[#202430] p-4">
              <p className="text-xs text-zinc-400">
                Avg Target
              </p>

              <h3 className="text-2xl font-bold text-white">
                85%
              </h3>
            </div>

            <div className="rounded-xl bg-[#202430] p-4">
              <p className="text-xs text-zinc-400">
                Avg Achieved
              </p>

              <h3 className="text-2xl font-bold text-white">
                87%
              </h3>
            </div>

            <div className="rounded-xl bg-[#202430] p-4">
              <p className="text-xs text-zinc-400">
                Top Performer
              </p>

              <h3 className="text-xl font-bold text-white">
                Mary
              </h3>
            </div>
          </div>

          {/* Chart */}
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#2d3342"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="rep"
                  tick={{ fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Legend content={<CustomLegend />} />

                <Bar
                  dataKey="target"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1200}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill="#475569"
                    />
                  ))}
                </Bar>

                <Bar
                  dataKey="achieved"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1800}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill="#8b5cf6"
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

const legendItems = [
  {
    value: "Target",
    color: "#475569",
  },
  {
    value: "Achieved",
    color: "#8b5cf6",
  },
];

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-4">
      {legendItems.map((item) => (
        <div
          key={item.value}
          className="flex items-center gap-2"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />

          <span className="text-sm text-zinc-400">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
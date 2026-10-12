"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "motion/react";

const data = [
  {
    name: "NBD",
    value: 80,
    color: "#7c3aed",
  },
  {
    name: "CRR",
    value: 20,
    color: "#d946ef",
  },
];

export default function RevenueMixCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="h-full rounded-xl border border-border
       bg-card hover:border-violet-500/40 transition-all duration-300
        hover:shadow-[0_0_40px_rgba(124,58,237,.15)]">

        <CardHeader className="pb-0">
          <CardTitle className="text-foreground text-lg font-semibold">
            Revenue Mix: NBD vs CRR
          </CardTitle>
        </CardHeader>

        <CardContent className="relative h-[330px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <defs>

                <linearGradient id="purpleGradient">

                  <stop offset="0%" stopColor="#8b5cf6" />

                  <stop offset="100%" stopColor="#5b21b6" />

                </linearGradient>

                <linearGradient id="blueGradient">

                  <stop offset="0%" stopColor="#e879f9" />

                  <stop offset="100%" stopColor="#c026d3" />

                </linearGradient>

              </defs>

              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--popover-foreground)",
                }}
              />

              <Pie
                data={data}
                innerRadius={85}
                outerRadius={115}
                dataKey="value"
                stroke="none"
                paddingAngle={0}
                animationDuration={1800}
              >
                <Cell fill="url(#purpleGradient)" />
                <Cell fill="url(#blueGradient)" />
              </Pie>

            </PieChart>

          </ResponsiveContainer>

          {/* Center Content */}

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

            <h2 className="text-5xl font-bold text-foreground">
              80%
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              New Business
            </p>

          </div>

        </CardContent>

      </Card>
    </motion.div>
  );
}
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";
import CountUp from "react-countup";
import clsx from "clsx";

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  title,
  value,
  suffix,
  prefix,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      <Card className="group h-full rounded-xl border border-border bg-card
       transition-all duration-300 hover:border-violet-500/40
        hover:shadow-[0_0_35px_rgba(124,58,237,0.15)]">
        <CardContent className="p-5">

          <div className="mb-3 flex items-start justify-between">

            <div>
              <p className="text-xs text-zinc-400">
                {title}
              </p>
            </div>

            <div
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-lg",
                iconBg
              )}
            >
              <Icon
                className={clsx("h-4 w-4", iconColor)}
              />
            </div>

          </div>

          <div className="mb-3">

            <h3 className="text-xl font-bold tracking-tight text-foreground">

              {typeof value === "number" ? (
                <>
                  {prefix}

                  <CountUp
                    end={value}
                    duration={1.8}
                  />

                  {suffix}
                </>
              ) : (
                value
              )}

            </h3>

          </div>

          <div className="flex items-center gap-2 text-xs">

            <TrendingUp className="h-4 w-4 text-emerald-400" />

            <span className="text-emerald-400">
              {description}
            </span>

          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
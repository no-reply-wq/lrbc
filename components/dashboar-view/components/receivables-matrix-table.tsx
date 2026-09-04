"use client";

import { CircleAlert, TableProperties } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = {
  bucket: string;
  indicator: "healthy" | "watch" | "risk" | "critical" | "disputed";
  aprilPlan: number;
  aprilAct: number;
  mayPlan: number;
  mayAct: number;
  junePlan: number;
  juneAct: number;
  q1Plan: number;
  q1Act: number;
};

const rows: Row[] = [
  {
    bucket: "Less than 30 Days",
    indicator: "healthy",
    aprilPlan: 20.0,
    aprilAct: 22.5,
    mayPlan: 22.0,
    mayAct: 24.0,
    junePlan: 25.0,
    juneAct: 25.0,
    q1Plan: 22.3,
    q1Act: 23.8,
  },
  {
    bucket: "30–60 Days",
    indicator: "watch",
    aprilPlan: 8.0,
    aprilAct: 9.5,
    mayPlan: 9.0,
    mayAct: 10.2,
    junePlan: 10.0,
    juneAct: 12.0,
    q1Plan: 9.0,
    q1Act: 10.5,
  },
  {
    bucket: "60–90 Days",
    indicator: "risk",
    aprilPlan: 3.0,
    aprilAct: 4.2,
    mayPlan: 3.5,
    mayAct: 4.8,
    junePlan: 3.0,
    juneAct: 5.5,
    q1Plan: 3.1,
    q1Act: 4.8,
  },
  {
    bucket: "More than 90 Days",
    indicator: "critical",
    aprilPlan: 1.0,
    aprilAct: 1.5,
    mayPlan: 1.0,
    mayAct: 1.8,
    junePlan: 1.0,
    juneAct: 2.0,
    q1Plan: 1.0,
    q1Act: 1.7,
  },
  {
    bucket: "Disputed Accounts",
    indicator: "disputed",
    aprilPlan: 0.5,
    aprilAct: 0.8,
    mayPlan: 0.5,
    mayAct: 1.0,
    junePlan: 1.0,
    juneAct: 1.0,
    q1Plan: 0.6,
    q1Act: 0.9,
  },
];

const iconColor = {
  healthy: "text-emerald-500",
  watch: "text-amber-500",
  risk: "text-red-500",
  critical: "text-destructive",
  disputed: "text-muted-foreground",
};

export default function ReceivablesMatrixTable() {
  return (
    <Card>
      <CardHeader>

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <CardTitle className="flex items-center gap-2">

              <TableProperties className="h-5 w-5 text-primary" />

              Receivables MIS (Aging Matrix)

            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Reference: FORMAT IND / AR ANALYSIS / 28-B / FY24-25
            </p>

          </div>

          <Badge variant="destructive">
            <CircleAlert className="mr-1 h-3 w-3" />
            Critical
          </Badge>

        </div>

      </CardHeader>

      <CardContent className="p-0">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead
                  rowSpan={2}
                  className="min-w-[260px] border-r align-middle"
                >
                  Receivables Bucket
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="border-r text-center"
                >
                  April
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="border-r text-center"
                >
                  May
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="border-r text-center"
                >
                  June (Current)
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="text-center"
                >
                  Q1 Totals
                </TableHead>

              </TableRow>

              <TableRow>

                <TableHead className="text-center">
                  Plan (₹ L)
                </TableHead>

                <TableHead className="border-r text-center">
                  Act (₹ L)
                </TableHead>

                <TableHead className="text-center">
                  Plan (₹ L)
                </TableHead>

                <TableHead className="border-r text-center">
                  Act (₹ L)
                </TableHead>

                <TableHead className="text-center">
                  Plan (₹ L)
                </TableHead>

                <TableHead className="border-r text-center">
                  Act (₹ L)
                </TableHead>

                <TableHead className="text-center">
                  Plan Avg
                </TableHead>

                <TableHead className="text-center">
                  Act Avg
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {rows.map((row) => (
                <TableRow key={row.bucket}>

                  <TableCell>

                    <div className="flex items-center gap-2">

                      <CircleAlert
                        className={`h-3.5 w-3.5 ${iconColor[row.indicator]}`}
                        fill="currentColor"
                      />

                      <span className="font-medium">
                        {row.bucket}
                      </span>

                    </div>

                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.aprilPlan.toFixed(1)}
                  </TableCell>

                  <TableCell className="border-r text-right font-semibold">
                    {row.aprilAct.toFixed(1)}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.mayPlan.toFixed(1)}
                  </TableCell>

                  <TableCell className="border-r text-right font-semibold">
                    {row.mayAct.toFixed(1)}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.junePlan.toFixed(1)}
                  </TableCell>

                  <TableCell className="border-r text-right font-semibold">
                    {row.juneAct.toFixed(1)}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.q1Plan.toFixed(1)}
                  </TableCell>

                  <TableCell className="text-right font-bold text-primary">
                    {row.q1Act.toFixed(1)}
                  </TableCell>

                </TableRow>
              ))}

              <TableRow className="bg-muted/40 font-bold">

                <TableCell>
                  TOTAL RECEIVABLES
                </TableCell>

                <TableCell className="text-right">
                  32.5
                </TableCell>

                <TableCell className="border-r text-right">
                  38.5
                </TableCell>

                <TableCell className="text-right">
                  36.0
                </TableCell>

                <TableCell className="border-r text-right">
                  41.8
                </TableCell>

                <TableCell className="text-right">
                  40.0
                </TableCell>

                <TableCell className="border-r text-right">
                  45.5
                </TableCell>

                <TableCell className="text-right">
                  36.1
                </TableCell>

                <TableCell className="text-right text-primary">
                  41.9
                </TableCell>

              </TableRow>

            </TableBody>

          </Table>

        </div>

      </CardContent>
    </Card>
  );
}
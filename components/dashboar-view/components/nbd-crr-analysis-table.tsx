"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet } from "lucide-react";

const rows = [
  {
    period: "Month 1 (Apr)",
    totalPI: "₹30.0L",
    totalAct: "₹32.0L",
    crrPI: "₹24.0L",
    crrAct: "₹27.2L",
    crrPercent: "85%",
    nbdPI: "₹6.0L",
    nbdAct: "₹4.8L",
    nbdPercent: "15%",
  },
  {
    period: "Month 2 (May)",
    totalPI: "₹35.0L",
    totalAct: "₹36.5L",
    crrPI: "₹26.2L",
    crrAct: "₹29.2L",
    crrPercent: "80%",
    nbdPI: "₹8.8L",
    nbdAct: "₹7.3L",
    nbdPercent: "20%",
  },
  {
    period: "Month 3 (Jun)",
    totalPI: "₹40.0L",
    totalAct: "₹42.5L",
    crrPI: "₹28.0L",
    crrAct: "₹31.9L",
    crrPercent: "75%",
    nbdPI: "₹12.0L",
    nbdAct: "₹10.6L",
    nbdPercent: "25%",
  },
];

export default function NbdCrrAnalysisTable() {
  return (
    <Card>
      <CardHeader>

        <div className="flex items-start justify-between">

          <div>
            <CardTitle className="flex items-center gap-2">

              <FileSpreadsheet className="h-4 w-4 text-primary" />

              NBD CRR Analysis Sheet

            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Reference: FORMAT NBD / GEN / 23-25
            </p>
          </div>

          <Badge variant="secondary">
            Q1 Report
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
                  className="min-w-[180px] border-r text-center align-middle font-semibold"
                >
                  Period
                </TableHead>

                <TableHead
                  colSpan={2}
                  className="border-r text-center font-semibold"
                >
                  Total Revenue
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="border-r text-center font-semibold"
                >
                  Existing Clients (CRR)
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="text-center font-semibold"
                >
                  New Clients (NBD)
                </TableHead>

              </TableRow>

              <TableRow>

                <TableHead className="text-center">
                  PI (Plan)
                </TableHead>

                <TableHead className="border-r text-center">
                  Act (Actual)
                </TableHead>

                <TableHead className="text-center">
                  PI Rev
                </TableHead>

                <TableHead className="text-center">
                  Act Rev
                </TableHead>

                <TableHead className="border-r text-center">
                  % of Total
                </TableHead>

                <TableHead className="text-center">
                  PI Rev
                </TableHead>

                <TableHead className="text-center">
                  Act Rev
                </TableHead>

                <TableHead className="text-center">
                  % of Total
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {rows.map((row) => (
                <TableRow key={row.period}>

                  <TableCell className="font-medium">
                    {row.period}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.totalPI}
                  </TableCell>

                  <TableCell className="border-r text-right font-semibold">
                    {row.totalAct}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.crrPI}
                  </TableCell>

                  <TableCell className="text-right font-medium text-primary">
                    {row.crrAct}
                  </TableCell>

                  <TableCell className="border-r text-center">
                    {row.crrPercent}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {row.nbdPI}
                  </TableCell>

                  <TableCell className="text-right font-medium text-primary">
                    {row.nbdAct}
                  </TableCell>

                  <TableCell className="text-center">
                    {row.nbdPercent}
                  </TableCell>

                </TableRow>
              ))}

              <TableRow className="bg-muted/40 font-semibold">

                <TableCell>Q1 TOTAL</TableCell>

                <TableCell className="text-right">
                  ₹105.0L
                </TableCell>

                <TableCell className="border-r text-right">
                  ₹111.0L
                </TableCell>

                <TableCell className="text-right">
                  ₹78.2L
                </TableCell>

                <TableCell className="text-right text-primary">
                  ₹88.3L
                </TableCell>

                <TableCell className="border-r text-center">
                  79.5%
                </TableCell>

                <TableCell className="text-right">
                  ₹26.8L
                </TableCell>

                <TableCell className="text-right text-primary">
                  ₹22.7L
                </TableCell>

                <TableCell className="text-center">
                  20.5%
                </TableCell>

              </TableRow>

            </TableBody>

          </Table>

        </div>

      </CardContent>
    </Card>
  );
}
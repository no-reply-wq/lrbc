"use client";

import { TrendingUp } from "lucide-react";

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

const rows = [
  {
    product: "PRODUCT 1",
    revenue: "20.0",
    revenuePercent: "20%",
    cost: "10.0",
    costPercent: "50%",
    gp: "10.0",
    margin: "50%",
    gpPercent: "22%",
  },
  {
    product: "PRODUCT 2",
    revenue: "30.0",
    revenuePercent: "30%",
    cost: "10.0",
    costPercent: "33%",
    gp: "20.0",
    margin: "67%",
    gpPercent: "44%",
  },
  {
    product: "PRODUCT 3",
    revenue: "50.0",
    revenuePercent: "50%",
    cost: "35.0",
    costPercent: "70%",
    gp: "15.0",
    margin: "30%",
    gpPercent: "33%",
  },
];

export default function GrossProfitSheetTable() {
  return (
    <Card>
      <CardHeader>

        <div>
          <CardTitle className="flex items-center gap-2">

            <TrendingUp className="h-5 w-5 text-primary" />

            Gross Profit Sheet (Margin Analysis)

          </CardTitle>

          <p className="mt-1 text-xs text-muted-foreground">
            Reference: FORMAT IND / SALES / 14-25
          </p>
        </div>

      </CardHeader>

      <CardContent className="p-0">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead className="min-w-[180px]">
                  Product Line
                </TableHead>

                <TableHead className="text-right">
                  Actual Rev (₹ L)
                </TableHead>

                <TableHead className="text-center">
                  % of Total Rev
                </TableHead>

                <TableHead className="text-right">
                  Actual VC ₹ (L)
                </TableHead>

                <TableHead className="text-center">
                  % VC
                </TableHead>

                <TableHead className="text-right">
                  Total GP (₹ L)
                </TableHead>

                <TableHead className="text-center">
                  % GP (Margin)
                </TableHead>

                <TableHead className="text-center">
                  % of Total GP
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {rows.map((row) => (
                <TableRow key={row.product}>

                  <TableCell className="font-semibold">
                    {row.product}
                  </TableCell>

                  <TableCell className="text-right">
                    {row.revenue}
                  </TableCell>

                  <TableCell className="text-center">
                    {row.revenuePercent}
                  </TableCell>

                  <TableCell className="text-right text-destructive font-medium">
                    {row.cost}
                  </TableCell>

                  <TableCell className="text-center text-destructive font-medium">
                    {row.costPercent}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-primary">
                    {row.gp}
                  </TableCell>

                  <TableCell className="text-center font-semibold text-primary">
                    {row.margin}
                  </TableCell>

                  <TableCell className="text-center text-primary">
                    {row.gpPercent}
                  </TableCell>

                </TableRow>
              ))}

              <TableRow className="bg-muted/40 font-bold">

                <TableCell>TOTAL</TableCell>

                <TableCell className="text-right">
                  100.0
                </TableCell>

                <TableCell className="text-center">
                  100%
                </TableCell>

                <TableCell className="text-right text-destructive">
                  55.0
                </TableCell>

                <TableCell className="text-center text-destructive">
                  55%
                </TableCell>

                <TableCell className="text-right text-primary">
                  45.0
                </TableCell>

                <TableCell className="text-center text-primary">
                  45%
                </TableCell>

                <TableCell className="text-center text-primary">
                  100%
                </TableCell>

              </TableRow>

            </TableBody>

          </Table>

        </div>

      </CardContent>
    </Card>
  );
}
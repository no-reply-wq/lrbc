"use client";

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

import { Filter } from "lucide-react";

const executives = [
  {
    id: "S1",
    name: "Amit Sharma",
    targetRevenue: "₹9,00,000",
    conversion: "10%",
    avgSale: "₹2,00,000",
    targetMeetings: 40,
    actualMeetings: 38,
    diff: "-5%",
  },
  {
    id: "S2",
    name: "Priya Singh",
    targetRevenue: "₹10,80,000",
    conversion: "15%",
    avgSale: "₹2,50,000",
    targetMeetings: 27,
    actualMeetings: 27,
    diff: "0%",
  },
  {
    id: "S3",
    name: "Rahul Verma",
    targetRevenue: "₹6,00,000",
    conversion: "12%",
    avgSale: "₹2,50,000",
    targetMeetings: 20,
    actualMeetings: 17,
    diff: "-15%",
  },
  {
    id: "S4",
    name: "Neha Gupta",
    targetRevenue: "₹3,00,000",
    conversion: "14%",
    avgSale: "₹1,50,000",
    targetMeetings: 14,
    actualMeetings: 12,
    diff: "-14%",
  },
];

export default function SalesExecutiveTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            Sales Executive MIS (Level 1)
          </CardTitle>

          <p className="text-xs text-muted-foreground mt-1">
            Reference: FORMAT IND / SALES / 21-25
          </p>
        </div>

        <Badge variant="secondary">
          <Filter className="mr-1 h-3 w-3" />
          Filter
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Sales Person</TableHead>
              <TableHead className="text-right">
                Revenue Target
              </TableHead>
              <TableHead className="text-center">
                Conv. Ratio
              </TableHead>
              <TableHead className="text-right">
                Avg Sale
              </TableHead>
              <TableHead className="text-center">
                Target Meetings
              </TableHead>
              <TableHead className="text-center">
                Actual Meetings
              </TableHead>
              <TableHead className="text-right">
                % Diff
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {executives.map((person) => (
              <TableRow key={person.id}>
                <TableCell>

                  <div className="flex items-center gap-3">

                    <Badge variant="outline">
                      {person.id}
                    </Badge>

                    <span className="font-medium">
                      {person.name}
                    </span>

                  </div>

                </TableCell>

                <TableCell className="text-right">
                  {person.targetRevenue}
                </TableCell>

                <TableCell className="text-center text-primary font-medium">
                  {person.conversion}
                </TableCell>

                <TableCell className="text-right">
                  {person.avgSale}
                </TableCell>

                <TableCell className="text-center">
                  {person.targetMeetings}
                </TableCell>

                <TableCell className="text-center font-semibold">
                  {person.actualMeetings}
                </TableCell>

                <TableCell
                  className={`text-right font-semibold ${
                    person.diff.startsWith("-")
                      ? "text-destructive"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {person.diff}
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="bg-muted/40 font-semibold">

              <TableCell>TOTALS</TableCell>

              <TableCell className="text-right">
                ₹27,00,000
              </TableCell>

              <TableCell className="text-center text-primary">
                12.75%
              </TableCell>

              <TableCell className="text-right text-primary">
                ₹2,12,500
              </TableCell>

              <TableCell className="text-center">
                101
              </TableCell>

              <TableCell className="text-center">
                94
              </TableCell>

              <TableCell className="text-right text-destructive">
                -6.9%
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>
      </CardContent>
    </Card>
  );
}
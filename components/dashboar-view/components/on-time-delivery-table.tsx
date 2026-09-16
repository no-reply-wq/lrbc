"use client";

import { Truck } from "lucide-react";

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

type Delivery = {
  billNo: string;
  client: string;
  contact: string;
  promisedDate: string;
  actualDate: string;
  daysDelayed: number;
  status: "On Time" | "Late";
};

const deliveries: Delivery[] = [
  {
    billNo: "INV-1042",
    client: "ABC Pvt Ltd",
    contact: "Gopal J. (+91 98...)",
    promisedDate: "12 Jun",
    actualDate: "15 Jun",
    daysDelayed: 3,
    status: "Late",
  },
  {
    billNo: "INV-1043",
    client: "TechNova Solutions",
    contact: "R. Sharma (+91 99...)",
    promisedDate: "14 Jun",
    actualDate: "14 Jun",
    daysDelayed: 0,
    status: "On Time",
  },
  {
    billNo: "INV-1044",
    client: "Global Corp",
    contact: "S. Verma (+91 88...)",
    promisedDate: "15 Jun",
    actualDate: "20 Jun",
    daysDelayed: 5,
    status: "Late",
  },
  {
    billNo: "INV-1045",
    client: "Prime Industries",
    contact: "Amit (+91 77...)",
    promisedDate: "18 Jun",
    actualDate: "17 Jun",
    daysDelayed: 0,
    status: "On Time",
  },
  {
    billNo: "INV-1046",
    client: "Sunrise Ltd",
    contact: "K. Patel (+91 91...)",
    promisedDate: "19 Jun",
    actualDate: "19 Jun",
    daysDelayed: 0,
    status: "On Time",
  },
];

export default function OnTimeDeliveryTable() {
  const lateCount = deliveries.filter(
    (item) => item.status === "Late"
  ).length;

  const lateRate = Math.round((lateCount / deliveries.length) * 100);

  return (
    <Card>
      <CardHeader>

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>
            <CardTitle className="flex items-center gap-2">

              <Truck className="h-5 w-5 text-primary" />

              On-Time Delivery Log

            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Reference: FORMAT IND-OPS / SCM / 23-25
            </p>
          </div>

          <Badge variant="destructive">
            Late Rate {lateRate}%
          </Badge>

        </div>

      </CardHeader>

      <CardContent className="p-0">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead className="min-w-[110px]">
                  Bill No.
                </TableHead>

                <TableHead className="min-w-[180px]">
                  Client Name
                </TableHead>

                <TableHead className="min-w-[200px]">
                  Contact Person
                </TableHead>

                <TableHead>
                  Promised Date
                </TableHead>

                <TableHead>
                  Actual Date
                </TableHead>

                <TableHead className="text-center">
                  Days Delayed
                </TableHead>

                <TableHead className="text-center">
                  Status
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {deliveries.map((delivery) => (
                <TableRow key={delivery.billNo}>

                  <TableCell className="font-semibold">
                    {delivery.billNo}
                  </TableCell>

                  <TableCell className="font-medium">
                    {delivery.client}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {delivery.contact}
                  </TableCell>

                  <TableCell>
                    {delivery.promisedDate}
                  </TableCell>

                  <TableCell
                    className={
                      delivery.status === "Late"
                        ? "font-medium text-destructive"
                        : "font-medium text-primary"
                    }
                  >
                    {delivery.actualDate}
                  </TableCell>

                  <TableCell className="text-center font-semibold">
                    {delivery.daysDelayed === 0
                      ? "-"
                      : delivery.daysDelayed}
                  </TableCell>

                  <TableCell className="text-center">

                    {delivery.status === "Late" ? (
                      <Badge variant="destructive">
                        Late
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        On Time
                      </Badge>
                    )}

                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </div>

      </CardContent>
    </Card>
  );
}
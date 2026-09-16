"use client";

import {
  Clock3,
  BadgePercent,
  TriangleAlert,
  Package,
} from "lucide-react";
import GrossProfitSheetTable from "../components/gross-profit-sheet-table";
import OnTimeDeliveryTable from "../components/on-time-delivery-table";
import StatCard from "../components/stat-card";
import WeeklyDeliveryChart from "../components/weekly-delivery-chart";
import GrossProfitContributionChart from "../components/gross-profit-contribution-chart";
import DashboardHeader from "../header";



export default function OperationsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="On-Time Delivery %"
          value="60%"
          description="40% of Orders are Late"
          icon={Clock3}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />

        <StatCard
          title="Avg Gross Profit %"
          value="45%"
          description="Target GP: 50%"
          icon={BadgePercent}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />

        <StatCard
          title="Total Delays"
          value={28}
          suffix=" days"
          description="+5 days vs Last Week"
          icon={TriangleAlert}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />

        <StatCard
          title="Inventory Turns"
          value={4.2}
          description="Healthy Velocity"
          icon={Package}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <WeeklyDeliveryChart />

        <GrossProfitContributionChart />

      </div>

      {/* Table */}

      <OnTimeDeliveryTable />
      <GrossProfitSheetTable />

    </div>
  );
}
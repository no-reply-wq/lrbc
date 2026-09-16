"use client";

import {
  Scale,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import NbdCrrTrendChart from "../components/bd-crr-trend-chart";
import NbdCrrAnalysisTable from "../components/nbd-crr-analysis-table";
import RatioShiftCard from "../components/ratio-shift-card";
import StatCard from "../components/stat-card";
import Dashboard from "../dashboar-view";
import DashboardHeader from "../header";



export default function MatrixPage() {
  return (
    <div className="space-y-6">

      {/* Heading */}
      

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Current NBD:CRR Ratio"
          value="25:75"
          description="Progressing to 50:50"
          icon={Scale}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />

        <StatCard
          title="New Business (NBD)"
          value="₹10.6L"
          description="+12 New Clients"
          icon={UserPlus}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />

        <StatCard
          title="Client Retention (CRR)"
          value="₹31.9L"
          description="94% Retention Rate"
          icon={Users}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />

        <StatCard
          title="Total MTD Revenue"
          value="₹42.5L"
          description="Target ₹50L"
          icon={Wallet}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-3">

        <div>
          <RatioShiftCard />
        </div>

        <div className="lg:col-span-2">
          <NbdCrrTrendChart />
        </div>

      </div>

      {/* Table */}

      <NbdCrrAnalysisTable />

    </div>
  );
}
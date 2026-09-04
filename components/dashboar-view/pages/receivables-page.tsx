"use client";

import {
  Wallet,
  ShieldCheck,
  TriangleAlert,
  Scale,
} from "lucide-react";
import ReceivablesAgingChart from "../components/receivables-aging-chart";
import ReceivablesMatrixTable from "../components/receivables-matrix-table";
import ReceivablesTrendChart from "../components/receivables-trend-chart";
import StatCard from "../components/stat-card";
import DashboardHeader from "../header";


export default function ReceivablesPage() {
  return (
    <div className="space-y-6">

      {/* Header */}


      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Receivables"
          value="₹45.5L"
          description="Target ₹40L (+13%)"
          icon={Wallet}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />

        <StatCard
          title="Healthy AR (<30 Days)"
          value="₹25.0L"
          description="55% of Total Receivables"
          icon={ShieldCheck}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />

        <StatCard
          title="High Risk (>60 Days)"
          value="₹7.5L"
          description="+₹1.2L vs Last Month"
          icon={TriangleAlert}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />

        <StatCard
          title="Disputed Accounts"
          value="₹1.0L"
          description="3 Client Accounts"
          icon={Scale}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <ReceivablesAgingChart />

        <ReceivablesTrendChart />

      </div>

      {/* Table */}

      <ReceivablesMatrixTable />

    </div>
  );
}
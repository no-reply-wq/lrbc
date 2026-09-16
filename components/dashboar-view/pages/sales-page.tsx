"use client";

import {
  Target,
  IndianRupee,
  Percent,
  Wallet,
} from "lucide-react";
import FunnelConversionChart from "../components/funnel-conversion-chart";
import MagicOfNumbersCard from "../components/magic-of-numbers-card";
import SalesExecutiveTable from "../components/sales-executive-table   ";
import SalesTeamMeetingsChart from "../components/sales-team-meetings-chart";
import StatCard from "../components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import DashboardHeader from "../header";

export default function SalesPage() {
  return (
    <div className="space-y-6">

      {/* Page Heading */}


      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Meetings (Me)"
          value={142}
          description="-8 vs Target (150)"
          icon={Target}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />

        <StatCard
          title="Conversion Ratio (C)"
          value={12.7}
          suffix="%"
          description="+0.7% vs Last Month"
          icon={Percent}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />

        <StatCard
          title="Average Sale (A)"
          value="₹2.12L"
          description="+12% LHF Strategy"
          icon={IndianRupee}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />

        <StatCard
          title="Total Revenue"
          value="₹30.2L"
          description="Calculated: Me × C × A"
          icon={Wallet}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />

      </div>

      {/* Main Card */}

      <MagicOfNumbersCard />

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesTeamMeetingsChart />
        <FunnelConversionChart />
      </div>

      <SalesExecutiveTable />


    </div>
  );
}
"use client";

import {
  Download,
  FileText,
  Filter,
  IndianRupee,
  Percent,
} from "lucide-react";

import DashboardHeader from "../header";

import AccountsReceivableCard from "../components/accounts-receivable-card";
import RevenueMixCard from "../components/revenue-mix-card";
import SalesFunnelCard from "../components/sales-funnel-card";
import StatCard from "../components/stat-card";
import TeamPerformanceCard from "../components/team-performance-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OverviewPage() {
  return (
    <section className="flex h-full flex-col overflow-hidden">

      {/* Sticky Header */}

     
      {/* Scrollable Content */}

      

        <div className="space-y-6 p-6">

          {/* KPI Cards */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Active Leads (Funnel)"
              value={120}
              description="+20% vs Last Month"
              icon={Filter}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            />

            <StatCard
              title="Lead to Client C.R. %"
              value={12}
              suffix="%"
              description="+2% Target Achieved"
              icon={Percent}
              iconColor="text-violet-500"
              iconBg="bg-violet-500/10"
            />

            <StatCard
              title="Avg Order Size (A)"
              value="₹2.4L"
              description="Scaled by LHF Strategy"
              icon={IndianRupee}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />

            <StatCard
              title="Total Receivables"
              value="₹15.2L"
              description="3 Accounts > 60 Days"
              icon={FileText}
              iconColor="text-red-500"
              iconBg="bg-red-500/10"
            />

          </div>

          {/* Revenue + Funnel */}

          <div className="grid gap-6 lg:grid-cols-12">

            <div className="lg:col-span-4">
              <RevenueMixCard />
            </div>

            <div className="lg:col-span-8">
              <SalesFunnelCard />
            </div>

          </div>

          {/* Bottom Cards */}

          <div className="grid gap-6 lg:grid-cols-2">

            <AccountsReceivableCard />

            <TeamPerformanceCard />

          </div>

        </div>

   

    </section>
  );
}
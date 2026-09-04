"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import DashboardSidebar from "./sidebar";
import DashboardHeader from "./header";

import OverviewPage from "./pages/overview-page";
import SalesPage from "./pages/sales-page";
import MatrixPage from "./pages/matrix-page";
import OperationsPage from "./pages/operations-page";
import ReceivablesPage from "./pages/receivables-page";

import { DashboardView } from "./types";

export default function Dashboard() {
  const [activePage, setActivePage] =
    useState<DashboardView>("overview");

  const pageConfig = {
    overview: {
      title: "Business Overview",
      description: "Tracking 5 Critical Parameters to Double Profits (MCAP)",
      badge: <Badge variant="secondary">MCAP</Badge>,
      action: <Button>Contact Our Team</Button>,
    },
    sales: {
      title: "Sales Auto-Pilot",
      description: "Meetings · Conversion · Average Sale · The Numbers Game",
      badge: <Badge variant="secondary">MeCA</Badge>,
      action: (
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export MIS
        </Button>
      ),
    },
    matrix: {
      title: "NBD vs CRR Matrix",
      description: "Balancing New Business Development & Client Retention",
      badge: <Badge variant="secondary">NBD / CRR</Badge>,
      action: <Button>Export Matrix</Button>,
    },
    operations: {
      title: "Operations & Delivery",
      description: "Quality • Quantity • Timeliness",
      badge: <Badge variant="secondary">OPS</Badge>,
      action: <Button>Export Operations</Button>,
    },
    receivables: {
      title: "Accounts & Receivables",
      description: "Cash Flow & Aging Analysis",
      badge: <Badge variant="secondary">AR</Badge>,
      action: <Button>Export Receivables</Button>,
    },
  } as const;

  const currentPage = pageConfig[activePage];

  const renderPage = () => {
    switch (activePage) {
      case "sales":
        return <SalesPage />;
      case "matrix":
        return <MatrixPage />;
      case "operations":
        return <OperationsPage />;
      case "receivables":
        return <ReceivablesPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <section className="mx-auto w-full bg-background">

        {/* ================= MOBILE IMAGE ================= */}
        <div className="block w-full px-4 md:hidden">
          <Image
            src="/images/dash-home.png"
            alt="Dashboard preview"
            width={1200}
            height={800}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        {/* ================= TABLET + DESKTOP DASHBOARD ================= */}
        <div className="mx-auto hidden h-[700px] max-w-[1500px] overflow-hidden rounded-2xl border bg-card shadow-2xl md:flex">

          <DashboardSidebar
            activePage={activePage}
            onChange={setActivePage}
          />

          <main className="flex min-w-0 flex-1 flex-col">

            <DashboardHeader
              title={currentPage.title}
              description={currentPage.description}
              badge={currentPage.badge}
              action={currentPage.action}
            />

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-6 p-6">
                {renderPage()}
              </div>
            </div>

          </main>

        </div>
      </section>
    </SidebarProvider>
  );
}
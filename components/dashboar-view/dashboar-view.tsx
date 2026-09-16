"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Target, Users, Truck, Receipt, Download } from "lucide-react";

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
import { Logo } from "../logo";

const navItems = [
  { title: "Command Overview",  value: "overview"    as DashboardView, icon: LayoutDashboard },
  { title: "Sales (MeCA)",      value: "sales"       as DashboardView, icon: Target },
  { title: "NBD vs CRR Matrix", value: "matrix"      as DashboardView, icon: Users },
  { title: "Operations",        value: "operations"  as DashboardView, icon: Truck },
  { title: "Receivables",       value: "receivables" as DashboardView, icon: Receipt },
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState<DashboardView>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const pageConfig = {
    overview: {
      title: "Business Overview",
      description: "Tracking 5 Critical Parameters to Double Profits (MCAP)",
      badge: <Badge variant="secondary">MCAP</Badge>,
      action: <Button className="text-xs px-3 h-8">Contact Our Team</Button>,
    },
    sales: {
      title: "Sales Auto-Pilot",
      description: "Meetings · Conversion · Average Sale · The Numbers Game",
      badge: <Badge variant="secondary">MeCA</Badge>,
      action: <Button className="text-xs px-3 h-8"><Download className="mr-1 h-3 w-3" />Export MIS</Button>,
    },
    matrix: {
      title: "NBD vs CRR Matrix",
      description: "Balancing New Business Development & Client Retention",
      badge: <Badge variant="secondary">NBD / CRR</Badge>,
      action: <Button className="text-xs px-3 h-8">Export Matrix</Button>,
    },
    operations: {
      title: "Operations & Delivery",
      description: "Quality • Quantity • Timeliness",
      badge: <Badge variant="secondary">OPS</Badge>,
      action: <Button className="text-xs px-3 h-8">Export Operations</Button>,
    },
    receivables: {
      title: "Accounts & Receivables",
      description: "Cash Flow & Aging Analysis",
      badge: <Badge variant="secondary">AR</Badge>,
      action: <Button className="text-xs px-3 h-8">Export Receivables</Button>,
    },
  } as const;

  const currentPage = pageConfig[activePage];

  const renderPage = () => {
    switch (activePage) {
      case "sales":        return <SalesPage />;
      case "matrix":       return <MatrixPage />;
      case "operations":   return <OperationsPage />;
      case "receivables":  return <ReceivablesPage />;
      default:             return <OverviewPage />;
    }
  };

  function handleNav(page: DashboardView) {
    setActivePage(page);
    setMenuOpen(false);
  }

  return (
    <SidebarProvider defaultOpen>
      <section className="mx-auto w-full bg-background">

        {/* ══════════ MOBILE — phone-style app frame ══════════ */}
        <div className="md:hidden px-1">
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border-2 border-border/70 bg-card shadow-2xl">

            {/* App top bar: logo + ☰ */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-sidebar/95 px-4 py-3 backdrop-blur">
              <Logo />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground active:scale-95 transition-transform"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            {/* ☰ slide-down nav — the sidebar options */}
            {menuOpen && (
              <div className="border-b bg-sidebar animate-in slide-in-from-top-2 duration-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleNav(item.value)}
                      className={[
                        "flex w-full items-center gap-3 px-5 py-3.5 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground active:bg-muted/60",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.title}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Page title bar */}
            <div className="flex items-start justify-between gap-2 border-b bg-background/95 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-sm font-bold leading-tight">{currentPage.title}</h1>
                  {currentPage.badge}
                </div>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                  {currentPage.description}
                </p>
              </div>
              <div className="shrink-0">{currentPage.action}</div>
            </div>

            {/* App screen — content scrolls inside like a phone */}
            <div
              className="h-[62vh] min-h-[420px] max-h-[600px] overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="space-y-4 p-3">{renderPage()}</div>
            </div>

          </div>
        </div>

        {/* ══════════ DESKTOP — unchanged ══════════ */}
        <div className="mx-auto hidden h-[700px] max-w-[1500px] overflow-hidden rounded-2xl border bg-card shadow-2xl md:flex">
          <DashboardSidebar activePage={activePage} onChange={setActivePage} />
          <main className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader
              title={currentPage.title}
              description={currentPage.description}
              badge={currentPage.badge}
              action={currentPage.action}
            />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-6 p-6">{renderPage()}</div>
            </div>
          </main>
        </div>

      </section>
    </SidebarProvider>
  );
}

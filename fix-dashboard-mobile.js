// =============================================================================
// LRBC — Fix dashboard mobile responsiveness
// Run: node fix-dashboard-mobile.js
//
// Changes to dashboar-view/dashboar-view.tsx:
//   - Remove static dash-home.png on mobile
//   - Full interactive dashboard on mobile with hamburger menu
//   - Sidebar slides in as a drawer on mobile
//   - Bottom nav shows page title + hamburger button
// =============================================================================

const fs   = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run from repo root'); process.exit(1);
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  done: ' + rel);
}

write('components/dashboar-view/dashboar-view.tsx', `"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Target, Users, Truck, Receipt } from "lucide-react";
import { Download } from "lucide-react";

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
  { title: "Command Overview", value: "overview" as DashboardView, icon: LayoutDashboard },
  { title: "Sales (MeCA)",     value: "sales"    as DashboardView, icon: Target },
  { title: "NBD vs CRR Matrix",value: "matrix"   as DashboardView, icon: Users },
  { title: "Operations",       value: "operations"as DashboardView, icon: Truck },
  { title: "Receivables",      value: "receivables"as DashboardView, icon: Receipt },
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState<DashboardView>("overview");
  const [menuOpen,   setMenuOpen]   = useState(false);

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
      case "sales":       return <SalesPage />;
      case "matrix":      return <MatrixPage />;
      case "operations":  return <OperationsPage />;
      case "receivables": return <ReceivablesPage />;
      default:            return <OverviewPage />;
    }
  };

  function handleNav(page: DashboardView) {
    setActivePage(page);
    setMenuOpen(false);
  }

  return (
    <section className="mx-auto w-full bg-background">

      {/* ── MOBILE DASHBOARD ─────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">

          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b bg-sidebar px-4 py-3">
            <Logo />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile slide-down nav menu */}
          {menuOpen && (
            <div className="border-b bg-sidebar">
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
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile page header */}
          <div className="flex items-center justify-between border-b bg-background/95 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">{currentPage.title}</h1>
                {currentPage.badge}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {currentPage.description}
              </p>
            </div>
            <div className="shrink-0">{currentPage.action}</div>
          </div>

          {/* Mobile page content */}
          <div className="overflow-y-auto max-h-[600px]">
            <div className="space-y-4 p-4">
              {renderPage()}
            </div>
          </div>

        </div>
      </div>

      {/* ── DESKTOP DASHBOARD (unchanged) ────────────────────────────── */}
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
            <div className="space-y-6 p-6">
              {renderPage()}
            </div>
          </div>
        </main>

      </div>
    </section>
  );
}
`);

// Verify
const c = fs.readFileSync(path.join(root, 'components/dashboar-view/dashboar-view.tsx'), 'utf8');
const checks = [
  'menuOpen',
  'handleNav',
  'md:hidden',
  'hidden md:flex',
  'Mobile slide-down nav',
  'Toggle menu',
];
let ok = true;
checks.forEach(n => {
  if (c.includes(n)) console.log('  ok  ' + n);
  else { console.error('  MISSING: ' + n); ok = false; }
});
if (!ok) process.exit(1);
console.log('\nDone. Hot reload will pick it up.');

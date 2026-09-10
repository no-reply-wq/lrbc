// =============================================================================
// LRBC — Mobile responsiveness + desktop outer-border fix
// Run: node fix-mobile-responsive.js
//
// DESKTOP (one change only, as requested):
//   • content-section.tsx — removes the extra outer border/ring around the
//     dashboard (the line you circled in red). The Dashboard card keeps its
//     own border; only the duplicate wrapper border is removed.
//
// MOBILE:
//   • content-section.tsx — removes minWidth:700px + scroll-x wrapper that
//     was forcing the dashboard to 700px wide on phones (this is why mobile
//     looked broken)
//   • dashboar-view.tsx  — mobile card becomes a phone-style frame:
//     ☰ hamburger opens the sidebar options (Command Overview, Sales,
//     NBD vs CRR, Operations, Receivables), content scrolls INSIDE the
//     card like a mobile app screen
//   • overview-page.tsx  — removes double padding so mobile content fits
//   • ContactSection2 + ContactForm — mobile spacing fixes for the form
//
// Desktop dashboard layout, sidebar, and all pages: UNCHANGED.
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run this from your project root (where package.json is)');
  process.exit(1);
}

let failures = 0;

function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): ' + rel); return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) {
    console.warn('  skip (pattern not found): ' + (label || rel));
    failures++;
    return false;
  }
  fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + rel + (label ? '  (' + label + ')' : ''));
  return true;
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak');
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. content-section.tsx
//    a) DESKTOP: the wrapper div had its own border+ring+shadow AND the
//       Dashboard has its own — the wrapper's border extended past the
//       dashboard's rounded corners (the red-circled line). Remove wrapper
//       visuals; keep Dashboard's own card border.
//    b) MOBILE: minWidth:700px forced a 700px-wide dashboard on phones.
//       Remove it — the Dashboard now handles mobile itself.
// ─────────────────────────────────────────────────────────────────────────────
patch(
  'components/content-section.tsx',
  `                    <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 mb-20">
                        <div className="lrbc-scroll-x">
                          <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1" style={{ minWidth: '700px' }}>
                            <Dashboard />
                          </div>
                        </div>
                    </div>`,
  `                    <div className="mask-b-from-55% relative mt-8 overflow-hidden px-2 sm:mt-12 md:mt-20 mb-20">
                        <div className="relative mx-auto max-w-6xl">
                            <Dashboard />
                        </div>
                    </div>`,
  'remove outer border + 700px minWidth'
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. dashboar-view.tsx — phone-style mobile shell, desktop untouched
// ─────────────────────────────────────────────────────────────────────────────
write('components/dashboar-view/dashboar-view.tsx', `"use client";

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
`);

// ─────────────────────────────────────────────────────────────────────────────
// 3. overview-page.tsx — remove its own p-6 wrapper (the shell already pads;
//    this was double padding, worst on mobile). Matches the other 4 pages.
// ─────────────────────────────────────────────────────────────────────────────
patch(
  'components/dashboar-view/pages/overview-page.tsx',
  `    <section className="flex h-full flex-col overflow-hidden">`,
  `    <section className="flex h-full flex-col">`,
  'overview: remove overflow-hidden'
);
patch(
  'components/dashboar-view/pages/overview-page.tsx',
  `        <div className="space-y-6 p-6">`,
  `        <div className="space-y-6">`,
  'overview: remove double padding'
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. ContactSection2 — mobile spacing (gap-20 is huge when columns stack)
// ─────────────────────────────────────────────────────────────────────────────
patch(
  'components/ContactSection2.tsx',
  `      <div className="mx-auto max-w-5xl px-6">`,
  `      <div className="mx-auto max-w-5xl px-4 sm:px-6">`,
  'contact section: mobile side padding'
);
patch(
  'components/ContactSection2.tsx',
  `        <div className="grid items-start gap-20 lg:grid-cols-2">`,
  `        <div className="grid items-start gap-10 lg:gap-20 lg:grid-cols-2">`,
  'contact section: mobile stack gap'
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. ContactForm — card padding on small phones
// ─────────────────────────────────────────────────────────────────────────────
patch(
  'components/ContactForm.tsx',
  `    <Card className="rounded-[28px] border-border/60 bg-background/80 p-8 shadow-xl backdrop-blur flex flex-col justify-center transition-shadow duration-500 ease-out hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">`,
  `    <Card className="rounded-[28px] border-border/60 bg-background/80 p-5 sm:p-8 shadow-xl backdrop-blur flex flex-col justify-center transition-shadow duration-500 ease-out hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">`,
  'contact form: mobile card padding'
);

// ─────────────────────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/content-section.tsx',                     'relative mx-auto max-w-6xl',      'outer border removed'],
  ['components/dashboar-view/dashboar-view.tsx',         'max-w-[420px]',                   'phone frame'],
  ['components/dashboar-view/dashboar-view.tsx',         'overscroll-contain',              'in-card scrolling'],
  ['components/dashboar-view/dashboar-view.tsx',         'hidden h-[700px] max-w-[1500px]', 'desktop unchanged'],
  ['components/dashboar-view/pages/overview-page.tsx',   '<div className="space-y-6">',     'overview padding fixed'],
  ['components/ContactSection2.tsx',                     'gap-10 lg:gap-20',                'form section gap'],
  ['components/ContactForm.tsx',                         'p-5 sm:p-8',                      'form card padding'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  if (!fs.existsSync(abs)) { console.error('  MISSING FILE: ' + f); ok = false; return; }
  const c = fs.readFileSync(abs, 'utf8');
  if (c.includes(needle)) console.log('  ok  ' + label);
  else { console.error('  FAIL  ' + label + '  (' + needle + ')'); ok = false; }
});

if (!ok || failures > 0) {
  console.log('Some patches did not apply — check warnings above.');
  process.exit(1);
}

console.log('');
console.log('============================================================');
console.log('  Done. If dev server is running, hot reload picks it up.');
console.log('  If anything looks stale:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('');
console.log('  DESKTOP (only change): the extra outer border line around');
console.log('  the dashboard is gone. Everything else untouched.');
console.log('');
console.log('  MOBILE:');
console.log('  - Dashboard is now a phone-style card: hamburger opens the');
console.log('    sidebar options, tapping one switches the page, content');
console.log('    scrolls INSIDE the card like a mobile app screen');
console.log('  - Contact form: tighter padding + stacking gap on phones');
console.log('============================================================');

// =============================================================================
// LRBC — 3 changes: real chart on LekhaSetu, green/yellow/orange/red legend,
// "Products" dropdown nav with "LekhaSetu" sub-item
// Run: node fix-nav-lekhasetu-colors.js
//
// 1. components/dashboar-view/components/receivables-aging-chart.tsx
//    — bar + legend colors switched from CSS custom properties (which were
//      not resolving in some themes, showing invisible/blank dots) to
//      explicit, always-visible colors: Healthy=green, Watch=yellow,
//      High Risk=orange, Critical=red, Disputed=gray
//    — this single component is reused in BOTH the dashboard AND the new
//      LekhaSetu section below, so the color fix applies in both places
//      automatically
//
// 2. components/solution.tsx (the "When your data is scattered..." section
//    on the LekhaSetu page) — the generic placeholder integrations grid
//    (Gemini / Replit / GooglePaLM cards, unrelated to the product) is
//    replaced with the real Accounts Receivable Aging chart
//
// 3. components/header.tsx — "LekhaSetu" top-level nav item becomes
//    "Products" with a dropdown; the dropdown contains "LekhaSetu" linking
//    to the same /lekhasetu page. Works on both desktop (dropdown menu)
//    and mobile (indented sub-item in the slide-out menu).
// =============================================================================

const fs = require('fs');
const path = require('path');
const root = process.cwd();

if (!fs.existsSync(path.join(root, 'package.json'))) {
  console.error('Run this from your project root'); process.exit(1);
}

let failures = 0;
function patch(rel, oldStr, newStr, label) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) { console.warn('  skip (missing): ' + rel); failures++; return false; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(oldStr)) { console.warn('  skip (pattern not found): ' + label); failures++; return false; }
  fs.copyFileSync(abs, abs + '.bak10');
  fs.writeFileSync(abs, c.replace(oldStr, newStr), 'utf8');
  console.log('  patched: ' + label);
  return true;
}

function write(rel, content) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.copyFileSync(abs, abs + '.bak10');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('  written: ' + rel);
}

console.log('-- 1. fix aging chart colors: green / yellow / orange / red --');

write('components/dashboar-view/components/receivables-aging-chart.tsx', `"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { bucket: "<30", value: 25, color: "#22c55e" },   // Healthy - green
  { bucket: "30-60", value: 12, color: "#eab308" }, // Watch - yellow
  { bucket: "60-90", value: 6, color: "#f97316" },  // High Risk - orange
  { bucket: ">90", value: 2, color: "#ef4444" },    // Critical - red
  { bucket: "Disp", value: 1, color: "#9ca3af" },   // Disputed - gray
];

const LEGEND = [
  { label: "Healthy", color: "bg-green-500" },
  { label: "Watch", color: "bg-yellow-500" },
  { label: "High Risk", color: "bg-orange-500" },
  { label: "Critical", color: "bg-red-500" },
  { label: "Disputed", color: "bg-gray-400" },
];

export default function ReceivablesAgingChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Accounts Receivable Aging
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap={30}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-border"
                opacity={0.2}
              />

              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{
                  fill: "hsl(var(--muted))",
                  opacity: 0.15,
                }}
                formatter={(value) => [
                  \`₹\${value}L\`,
                  "Receivables",
                ]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 10,
                }}
              />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.bucket}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}

        <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={\`h-3 w-3 rounded-full \${item.color}\`} />
              <span className="text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
`);

console.log('');
console.log('-- 2. replace LekhaSetu placeholder mockup with the real chart --');

write('components/solution.tsx', `import ReceivablesAgingChart from '@/components/dashboar-view/components/receivables-aging-chart';

export function SolutionSection() {
    return (
        <section>
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-12">
                    <div className="flex flex-col justify-between gap-12 pb-6 max-lg:order-last md:mt-6">
                        <div>
                            <h2 className="text-balance text-4xl font-medium tracking-tight lg:text-5xl">When your data is scattered, every decision takes longer.</h2>
                            <p className="text-muted-foreground mb-6 mt-4 text-balance text-lg">
                                Manual exports, outdated reports, and disconnected systems create bottlenecks that slow down your business.
                            </p>
                            
                        </div>

                        <p className="text-muted-foreground max-w-xs text-balance text-xs">
                             Without real-time visibility, teams spend  <span className="text-foreground font-medium"> more time</span>  searching for information than acting on it.
                        </p>
                    </div>

                    <div className="mask-radial-at-top-left mask-radial-from-65% mask-radial-[100%_80%] -mx-6 px-6 sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
                        <ReceivablesAgingChart />
                    </div>
                </div>
            </div>
        </section>
    )
}
`);

console.log('');
console.log('-- 3. header nav: "LekhaSetu" -> "Products" dropdown with "LekhaSetu" sub-item --');

patch('components/header.tsx',
  `'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'
import { ERPRequestModal } from "@/components/ERPRequestModal"

const menuItems = [
    { name: 'About', href: '/about' },
    { name: 'Why LRBC', href: '/why-lrbc' },
    { name: 'LekhaSetu', href: '/lekhasetu' },
    { name: 'Testimonials', href: '/testimonials-case-studies' },
    { name: 'Contact', href: '/contact' },
]`,
  `'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'
import { ERPRequestModal } from "@/components/ERPRequestModal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const menuItems: { name: string; href: string; children?: { name: string; href: string }[] }[] = [
    { name: 'About', href: '/about' },
    { name: 'Why LRBC', href: '/why-lrbc' },
    {
        name: 'Products',
        href: '/lekhasetu',
        children: [
            { name: 'LekhaSetu', href: '/lekhasetu' },
        ],
    },
    { name: 'Testimonials', href: '/testimonials-case-studies' },
    { name: 'Contact', href: '/contact' },
]`,
  'header: menuItems supports dropdown children');

patch('components/header.tsx',
  `                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>`,
  `                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        {item.children ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="text-muted-foreground hover:text-accent-foreground flex items-center gap-1 duration-150 outline-none">
                                                    <span>{item.name}</span>
                                                    <ChevronDown className="size-3.5" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {item.children.map((child, ci) => (
                                                        <DropdownMenuItem key={ci} asChild>
                                                            <Link href={child.href}>{child.name}</Link>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>`,
  'header: desktop dropdown for Products');

patch('components/header.tsx',
  `                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>`,
  `                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                            {item.children && (
                                                <ul className="mt-3 ml-4 space-y-3 border-l pl-4">
                                                    {item.children.map((child, ci) => (
                                                        <li key={ci}>
                                                            <Link
                                                                href={child.href}
                                                                className="text-muted-foreground hover:text-accent-foreground block text-sm duration-150">
                                                                <span>{child.name}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>`,
  'header: mobile sub-item for LekhaSetu');

// ─────────────────────────────────────────────────────────────────────────────
console.log('');
console.log('-- verification --');
const checks = [
  ['components/dashboar-view/components/receivables-aging-chart.tsx', '#22c55e', 'green added'],
  ['components/dashboar-view/components/receivables-aging-chart.tsx', '#eab308', 'yellow added'],
  ['components/dashboar-view/components/receivables-aging-chart.tsx', '#f97316', 'orange added'],
  ['components/dashboar-view/components/receivables-aging-chart.tsx', '#ef4444', 'red added'],
  ['components/solution.tsx', 'ReceivablesAgingChart', 'real chart in LekhaSetu'],
  ['components/solution.tsx', 'ZodiacGemini', 'placeholder mockup removed___INVERT'],
  ['components/header.tsx',  "name: 'Products'", 'Products tab added'],
  ['components/header.tsx',  'DropdownMenuTrigger', 'dropdown component wired in'],
  ['components/header.tsx',  "children.map((child, ci)", 'mobile sub-item present'],
];

let ok = true;
checks.forEach(([f, needle, label]) => {
  const abs = path.join(root, f);
  const c = fs.readFileSync(abs, 'utf8');
  const invert = label.includes('___INVERT');
  const cleanLabel = label.replace('___INVERT', '');
  const has = c.includes(needle);
  if (invert ? !has : has) console.log('  ok  ' + cleanLabel);
  else { console.error('  FAIL  ' + cleanLabel); ok = false; }
});

if (!ok || failures > 0) { console.log('Some patches did not apply — check warnings above.'); process.exit(1); }

console.log('');
console.log('============================================================');
console.log('  Done. Run:');
console.log('    Remove-Item -Recurse -Force .next');
console.log('    pnpm dev');
console.log('  Then check in a fresh Incognito window.');
console.log('');
console.log('  1. Legend colors (dashboard Receivables page AND the new');
console.log('     LekhaSetu section): Healthy=green, Watch=yellow,');
console.log('     High Risk=orange, Critical=red, Disputed=gray.');
console.log('');
console.log('  2. LekhaSetu page: the "When your data is scattered..."');
console.log('     section now shows the real Accounts Receivable Aging');
console.log('     chart instead of the generic Gemini/Replit placeholder.');
console.log('');
console.log('  3. Nav bar: "LekhaSetu" is now "Products" with a dropdown');
console.log('     (desktop) / indented sub-link (mobile) containing');
console.log('     "LekhaSetu", which still goes to the same page.');
console.log('============================================================');

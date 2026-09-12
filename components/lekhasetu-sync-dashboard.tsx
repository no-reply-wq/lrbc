"use client";
import { useState, useEffect } from "react";
import { Cloud, CheckCircle2, RefreshCw } from "lucide-react";

const ENTRIES = [
  { label: "Sales Voucher #1042",  ledger: "Debtors A/c",    amount: "₹84,200",  status: "synced",  time: "2s ago" },
  { label: "Purchase #PO-2291",    ledger: "Creditors A/c",  amount: "₹31,500",  status: "synced",  time: "18s ago" },
  { label: "Stock Update — GRNSF", ledger: "Inventory A/c",  amount: "1,200 pcs",status: "syncing", time: "now" },
  { label: "Payment Receipt #882", ledger: "Bank A/c",        amount: "₹1,20,000",status: "synced", time: "1m ago" },
  { label: "Credit Note #CN-041",  ledger: "Sales Returns",  amount: "₹6,400",   status: "synced",  time: "3m ago" },
];

export default function LekhaSetuSyncDashboard() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl overflow-hidden text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Live Sync — LekhaSetu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full bg-green-500 ${pulse ? "opacity-100" : "opacity-40"} transition-opacity duration-700`} />
          <span className="text-[10px] text-green-500 font-medium">Connected</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border/50">
        {[
          { val: "312",   label: "Synced today" },
          { val: "< 3s", label: "Avg sync time" },
          { val: "99.9%",label: "Uptime" },
        ].map(s => (
          <div key={s.label} className="text-center rounded-xl bg-primary/5 py-2">
            <p className="text-sm font-bold text-primary">{s.val}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sync feed */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {ENTRIES.map((e, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
            {e.status === "syncing"
              ? <RefreshCw className="h-3 w-3 text-blue-400 animate-spin shrink-0" />
              : <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate">{e.label}</p>
              <p className="text-[9px] text-muted-foreground">{e.ledger}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-semibold text-primary">{e.amount}</p>
              <p className="text-[9px] text-muted-foreground">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

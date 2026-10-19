import type { Metadata } from "next";

const TITLE = "WorkPilot: Checklist, Delegation & FMS Software | LRBC";
const DESC = "Daily checklists, delegated tasks and process flows in one place, with automatic reminders, live attendance and staff scores. Free 15-day trial.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "https://lrbc.ai/workpilot" },
  openGraph: { title: "Know what got done today, without a single follow-up call", description: DESC, url: "https://lrbc.ai/workpilot", type: "website" },
  twitter: { card: "summary_large_image", title: "Know what got done today, without a single follow-up call", description: DESC },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

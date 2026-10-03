import type { Metadata } from "next";

export const metadata: Metadata = { title: "WorkPilot" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

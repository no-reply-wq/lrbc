import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Book a demo of LRBC — see WorkPilot, LekhaSetu, Mini ERP or a Custom ERP working around your business.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

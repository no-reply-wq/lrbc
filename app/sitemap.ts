import type { MetadataRoute } from "next";

const SITE = "https://lrbc.ai";

/** Public pages only (served at /sitemap.xml). Add a line here when a new public page is created. */
const PAGES: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, freq: "weekly" },
  { path: "/workpilot", priority: 0.9, freq: "monthly" },
  { path: "/lekhasetu", priority: 0.9, freq: "monthly" },
  { path: "/mini-erp", priority: 0.8, freq: "monthly" },
  { path: "/custom-erp", priority: 0.8, freq: "monthly" },
  { path: "/demo", priority: 0.8, freq: "monthly" },
  { path: "/testimonials-case-studies", priority: 0.8, freq: "weekly" },
  { path: "/why-lrbc", priority: 0.7, freq: "monthly" },
  { path: "/about", priority: 0.7, freq: "monthly" },
  { path: "/contact", priority: 0.7, freq: "monthly" },
  { path: "/privacy-policy", priority: 0.3, freq: "yearly" },
  { path: "/terms-of-use", priority: 0.3, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((p) => ({
    url: `${SITE}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}

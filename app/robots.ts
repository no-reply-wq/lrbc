import type { MetadataRoute } from "next";

/** Served at /robots.txt. The admin area is kept out of search with a noindex tag, not listed here, so its address isn't advertised. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://lrbc.ai/sitemap.xml",
    host: "https://lrbc.ai",
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" REMOVED — caused build crash on dynamic API routes.
  // Vercel supports server-side rendering natively; no static export needed.

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // WorkPilot now lives on its own website. Anything that still points at the old /workpilot pages
  // (old links, Google results, saved CMS links) is sent there. The page code stays in app/workpilot, unused.
  async redirects() {
    return [
      { source: "/workpilot", destination: "https://lrbcloud.ai/", permanent: false },
      { source: "/workpilot/:path*", destination: "https://lrbcloud.ai/", permanent: false },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;

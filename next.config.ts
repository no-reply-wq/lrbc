import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static output mode removed — enables API routes for MongoDB
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;

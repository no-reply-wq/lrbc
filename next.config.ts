import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  // static output mode removed — enables API routes for MongoDB
=======
  output: "export",
>>>>>>> c2bf295100d83babf1492c641e7aa26b02f9582f
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;

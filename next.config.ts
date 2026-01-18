import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow placeholder images from external sources during development
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "wyvegindcbfyrycyigfy.supabase.co",
      },
    ],
    // Disable image optimization for unoptimized images
    unoptimized: false,
  },
};

export default nextConfig;

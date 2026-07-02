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
        hostname: "ixdaxtzxavxhesqhkuyi.supabase.co",
      },
    ],
    // Disable image optimization for unoptimized images (fixes local 500 errors)
    unoptimized: true,
  },
};

export default nextConfig;

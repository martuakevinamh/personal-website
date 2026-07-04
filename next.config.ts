import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent site from being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unused browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Force HTTPS for 1 year (only active after deploy to HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "ixdaxtzxavxhesqhkuyi.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";

/**
 * Automatically generates /robots.txt
 * Tells search engine crawlers what they can and cannot access.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block admin area and API routes from being indexed
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://martuakevin.vercel.app/sitemap.xml",
    host: "https://martuakevin.vercel.app",
  };
}

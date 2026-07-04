import type { MetadataRoute } from "next";

/**
 * Automatically generates /sitemap.xml
 * Next.js serves this at https://martuakevin.vercel.app/sitemap.xml
 * Google uses this to discover and index all pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://martuakevin.vercel.app";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Hash sections — these don't have their own URLs but signal importance
    {
      url: `${base}/#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/#projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/#experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/#skills`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/#contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

/**
 * Only the four real routes are listed. Case studies are NOT included: each one
 * links out to an external live site (lib/content/work.ts `href`), so there is no
 * internal /work/<slug> page - listing them would point the sitemap at 404s.
 */
const lastModified = new Date("2026-06-21");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}

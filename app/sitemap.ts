import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

/**
 * Only the four real routes are listed. Case studies are NOT included: each one
 * links out to an external live site (lib/content/work.ts `href`), so there is no
 * internal /work/<slug> page - listing them would point the sitemap at 404s.
 */
const lastModified = new Date("2026-06-21");

// Each entry self-references its own URL as the ru-RU alternate plus x-default, mirroring
// the in-<head> hreflang (lib/seo/metadata.ts) so the two declarations agree. Standalone
// property: never points at the separate lumako.net build. URLs are already absolute
// (built from SITE_URL), which sitemap hreflang requires.
function route(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const url = `${SITE_URL}${path}`;
  return {
    url,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: { languages: { "ru-RU": url, "x-default": url } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [route("", 1), route("/work", 0.9), route("/about", 0.8), route("/contact", 0.8)];
}

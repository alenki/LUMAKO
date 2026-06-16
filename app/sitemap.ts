import type { MetadataRoute } from "next";
import { work } from "@/lib/content/work";

const base = "https://lumako.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/services", "/studio", "/contact"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const cases = work.map((c) => ({
    url: `${base}/work/${c.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...routes, ...cases];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow everything crawlable; keep the contact API route out of the index - it
    // is a POST handler with no indexable content. The Yandex `Host:` directive is
    // intentionally omitted: Yandex discontinued it in 2018 (301/canonical replaced
    // it) and removed it from its docs, so the canonical host is set via the
    // self-referencing canonical tags instead.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

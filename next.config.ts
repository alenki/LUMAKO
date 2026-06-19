import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities; we keep a small set.
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
  },
};

// Lets `next dev` read the Cloudflare context (bindings/env) via
// getCloudflareContext(). No-op in production builds.
initOpenNextCloudflareForDev();

export default nextConfig;

import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities; we keep a small set.
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      // public/bloomroastery is a prebuilt Vite SPA (HashRouter, base
      // /bloomroastery/) served as plain static assets - it never touches the
      // Next render path. In production Workers Assets resolves the directory
      // index itself, but `next dev` does not, so map the bare path onto the
      // file. Deep paths need no rule: the router lives in the hash.
      { source: "/bloomroastery", destination: "/bloomroastery/index.html" },
    ];
  },
};

// Lets `next dev` read the Cloudflare context (bindings/env) via
// getCloudflareContext(). No-op in production builds.
initOpenNextCloudflareForDev();

export default nextConfig;

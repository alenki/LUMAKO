import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities; we keep a small set.
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
  },
  // three.js ships untranspiled ESM that needs to be bundled for the server graph.
  transpilePackages: ["three"],
};

export default nextConfig;

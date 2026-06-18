import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities; we keep a small set.
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

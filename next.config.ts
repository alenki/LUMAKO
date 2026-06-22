import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site to `out/` for upload
  // to reg.ru shared hosting (there is no Node/Workers runtime there).
  output: "export",
  // Each route exports as `route/index.html`, which Apache serves via its
  // default DirectoryIndex with no rewrites needed.
  trailingSlash: true,
  images: {
    // No Image Optimization server on a static host - serve the originals as-is.
    unoptimized: true,
  },
};

export default nextConfig;

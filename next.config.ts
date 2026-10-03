import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the catalog assets directly; no image-transform binding is required.
  images: { unoptimized: true },
};

export default nextConfig;

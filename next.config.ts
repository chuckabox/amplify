import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = isProd ? "/amplify" : "";

const nextConfig: NextConfig = {
  output: "export",
  // Keep Turbopack inside this project when a parent-directory lockfile exists.
  turbopack: {
    root: process.cwd(),
  },
  // Deployed to https://chuckabox.github.io/amplify/
  // Only apply basePath in production so dev server works at localhost:3000/
  basePath: BASE_PATH,
  images: {
    unoptimized: true,
  },
  // Expose basePath so raw <img>/<video> src can be prefixed (Next only
  // auto-prefixes next/link and next/image, not plain tags).
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;

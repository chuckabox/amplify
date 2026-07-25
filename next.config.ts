import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // Deployed to https://chuckabox.github.io/amplify/
  // Only apply basePath in production so dev server works at localhost:3000/
  basePath: isProd ? "/amplify" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

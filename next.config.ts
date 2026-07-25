import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Deployed to https://chuckabox.github.io/amplify/
  basePath: "/amplify",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

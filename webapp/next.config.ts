import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: isProduction && !isCI,
};

export default nextConfig;

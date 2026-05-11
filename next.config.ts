import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins:process.env.ALLOWED_DEV_ORIGINS ? [process.env.ALLOWED_DEV_ORIGINS] : undefined,
  devIndicators:false
};

export default nextConfig;

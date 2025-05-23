import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker containers
  output: 'standalone',
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Disable ESLint during builds for simplified Docker demo
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure for Docker environment
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

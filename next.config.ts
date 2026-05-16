import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Wagmi experimental connectors may try to load dynamic module 'accounts'
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias['accounts'] = false;
    
    return config;
  },
};

export default nextConfig;

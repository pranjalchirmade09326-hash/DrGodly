const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.drgodly.com",
      },
    ],
  },
  serverExternalPackages: ["dicom.ts"],
  output: "standalone",
  experimental: {
    // Required for app/global-not-found.tsx.
    globalNotFound: true,
    serverComponentsHmrCache: false,
  },
  deploymentId: process.env.NEXT_DEPLOYMENT_ID,
  webpack: (config, { dev }) => {
    // Only disable source maps in development
    if (dev) {
      config.devtool = false;
    }
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["next-intl/config"] = path.resolve(__dirname, "src/i18n/request.ts");
    return config;
  },
};

module.exports = nextConfig;

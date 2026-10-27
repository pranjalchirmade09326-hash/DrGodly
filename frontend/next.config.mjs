import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["dicom.ts"],
  output: "standalone",
  experimental: {
    // Required for app/global-not-found.tsx. This app's root layout lives at
    // [locale]/layout.tsx (a dynamic top-level segment, not a plain
    // app/layout.tsx), which Next.js can't compose a single 404 route
    // through on its own — see app/global-not-found.tsx for the full
    // explanation.
    globalNotFound: true,
    serverComponentsHmrCache: false,
  },
  deploymentId: process.env.NEXT_DEPLOYMENT_ID,
  webpack: (config, { dev }) => {
    // Only disable source maps in development
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

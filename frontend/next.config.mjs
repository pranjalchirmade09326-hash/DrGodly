import createNextIntlPlugin from "next-intl/plugin";

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

// The plugin resolves `next-intl/config` to src/i18n/request.ts for BOTH
// bundlers. Doing it with a manual webpack alias instead (as an earlier
// revision of this file did) only covers webpack, so `pnpm dev:turbo` and
// `next build` under Turbopack would fail to find the i18n request config.
// next-intl requires a *relative* path here — an absolute one is rejected.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);

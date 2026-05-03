import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.9",
    "localhost",
    "127.0.0.1",
  ],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  disableLogger: true,
  // Source map upload disabled — enable later by adding SENTRY_AUTH_TOKEN to Vercel
  sourcemaps: { disable: true },
  autoInstrumentServerFunctions: true,
  autoInstrumentAppDirectory: true,
});

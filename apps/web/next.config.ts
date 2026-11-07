import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  transpilePackages: ["@fstck/db"],
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  async headers() {
    // Enable SharedArrayBuffer for WASM threading (faster bg removal) without
    // breaking cross-origin assets by using "credentialless" COEP.
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default config;

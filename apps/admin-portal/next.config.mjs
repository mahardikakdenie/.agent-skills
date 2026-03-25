/** @type {import("next").NextConfig} */

const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  turbopack: {
    resolveAlias: {
      "@repo/ui": "../../packages/ui/src/index.ts",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: process.env.NODE_ENV !== "development",
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};

export default nextConfig;

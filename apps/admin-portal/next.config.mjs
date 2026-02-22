/** @type {import("next").NextConfig} */

const nextConfig = {
  output: "standalone",
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

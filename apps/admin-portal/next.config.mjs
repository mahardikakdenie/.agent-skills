/** @type {import("next").NextConfig} */

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@repo/ui'],
  turbopack: {
    resolveAlias: {
      '@repo/ui': '../../packages/ui/src/index.ts',
      '@repo/config': '../../packages/config/src/index.ts',
      '@repo/eslint-config': '../../packages/eslint-config/src/index.ts',
      '@repo/typescript-config': '../../packages/typescript-config/src/index.ts',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: process.env.NODE_ENV !== 'development',
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
};

export default nextConfig;

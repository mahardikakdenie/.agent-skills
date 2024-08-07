/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN,
    AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    TRANSACTION_SERVICE_URL: process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL,
  }
};

export default nextConfig;

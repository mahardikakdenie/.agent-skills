/** @type {import("next").NextConfig} */
import JavaScriptObfuscator from "webpack-obfuscator";
const nextConfig = {
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
    reactStrictMode: process.env.NODE_ENV !== 'development',
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development'
    },
    webpack: (config, { isServer, dev }) => {
        if (!isServer && !dev) {
            config.plugins.push(
                new JavaScriptObfuscator(
                    {
                        rotateStringArray: true,
                        disableConsoleOutput: true,
                        selfDefending: true
                    },
                    []
                )
            );
        }
        return config;
    },
};

export default nextConfig;

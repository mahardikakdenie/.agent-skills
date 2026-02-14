/** @type {import("next").NextConfig} */
import JavaScriptObfuscator from "webpack-obfuscator";
const enableObfuscator = process.env.NEXT_ENABLE_OBFUSCATOR === "true";
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
        if (!isServer && !dev && enableObfuscator) {
            config.plugins.push(
                new JavaScriptObfuscator(
                    {
                        rotateStringArray: true,
                        disableConsoleOutput: true,
                        selfDefending: false
                    },
                    []
                )
            );
        }
        return config;
    },
};

export default nextConfig;

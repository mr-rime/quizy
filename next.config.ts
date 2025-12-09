import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable aggressive caching for fetch requests
    experimental: {
        staleTimes: {
            dynamic: 30,
            static: 180
        },
    },

    // Logging for cache debugging
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pixabay.com",
                pathname: "/**",
            },

            {
                protocol: "https",
                hostname: "utfs.io",
                pathname: "/**",
            }
        ],
    },

};

export default nextConfig;

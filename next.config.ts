import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      ...(isDevelopment
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "5006",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;

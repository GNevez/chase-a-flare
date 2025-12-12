import type { NextConfig } from "next";

const devConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:5006",
    NEXT_PUBLIC_API_TIMEOUT: "10000",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      "REMOVED_STRIPE_PUBLISHABLE_KEY",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // Allow API images served from local backend in development
      {
        protocol: "http",
        hostname: "localhost",
        port: "5006",
        pathname: "/**",
      },
    ],
  },
};

const prodConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://chaseaflare.com.br",
    NEXT_PUBLIC_API_TIMEOUT: "10000",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      "REMOVED_STRIPE_PUBLISHABLE_KEY",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

function returnConfig(): NextConfig {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log("🔧 Using development config");
    return devConfig;
  }

  if (process.env.NODE_ENV === "production") {
    console.log("🚀 Using production config");
    return prodConfig;
  }

  return devConfig;
}

const nextConfig = returnConfig();

export default nextConfig;

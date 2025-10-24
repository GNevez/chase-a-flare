/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;

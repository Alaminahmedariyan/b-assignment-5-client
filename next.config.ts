import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  allowedDevOrigins: [
    "localhost",
    "172.20.128.1",
    "http://192.168.1.62:3000",
    "http://localhost:3000",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
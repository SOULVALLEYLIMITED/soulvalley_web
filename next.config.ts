import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === "production" && {
    compiler: {
      removeConsole: true,
    },
  }),
};

export default nextConfig;
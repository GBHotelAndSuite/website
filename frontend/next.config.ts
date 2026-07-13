import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

module.exports = {
  allowedDevOrigins: ['192.168.1.156'],
}

export default nextConfig;

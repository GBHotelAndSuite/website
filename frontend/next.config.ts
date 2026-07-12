import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

module.exports = {
  allowedDevOrigins: ['192.168.1.155'],
}

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export so we can host on Firebase Hosting as static files.
  output: "export",
};

export default nextConfig;

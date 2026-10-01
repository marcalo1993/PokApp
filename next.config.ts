import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora errores estrictos de tipos durante el build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora advertencias del linter durante el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

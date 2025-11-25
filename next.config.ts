import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Desactivar para evitar renders dobles en dev
  
  // Configuración vacía de Turbopack para silenciar el warning
  turbopack: {},
  
  webpack: (config) => {
    // Suprimir warnings de React DevTools
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/
    ];
    return config;
  },
};

export default nextConfig;

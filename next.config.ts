import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    // Remplacement du blog existant (cahier des charges §2).
    // Compléter avec la correspondance ancienne adresse → nouvel article
    // dès que la liste des URL du blog est disponible.
    return [
      { source: "/blog", destination: "/mag", permanent: true },
      { source: "/blog/:path*", destination: "/mag", permanent: true },
    ];
  },
};

export default nextConfig;

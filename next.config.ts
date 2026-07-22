import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict, production-friendly defaults.
  reactStrictMode: true,

  // Image handling: local placeholders now, remote clinic photography later.
  // Add production image CDN / DAM hostnames here when real photography lands.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // TODO(content): add real image host(s) when clinic photography is delivered.
      // { protocol: "https", hostname: "images.regenerateskinhairclinic.com.au" },
    ],
  },

  // Foundation hook: keeps the door open for future MDX-driven articles (phase two).
  // pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict, production-friendly defaults.
  reactStrictMode: true,

  // Image handling: local placeholders now, remote clinic photography later.
  // Add production image CDN / DAM hostnames here when real photography lands.
  images: {
    formats: ["image/avif", "image/webp"],
    /* Next 16 only allows quality 75 unless listed here — any other `quality`
       prop is silently coerced back to 75. Real clinic photography uses 90:
       at 75, AVIF smoothed away wood grain, fabric and wall texture and the
       room shots read as blurry on desktop (a 1080px derivative was 27KB).
       75 stays available for anything non-photographic. */
    qualities: [75, 90],
    remotePatterns: [
      // TODO(content): add real image host(s) when clinic photography is delivered.
      // { protocol: "https", hostname: "images.regenerateskinhairclinic.com.au" },
    ],
  },

  // Foundation hook: keeps the door open for future MDX-driven articles (phase two).
  // pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;

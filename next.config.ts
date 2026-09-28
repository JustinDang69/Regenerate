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

  /* The treatments index was repositioned as the Concerns page (28 Sep 2026).
     Only the INDEX moved: `source` matches /treatments exactly, so
     /treatments/[slug] and /treatments/technologies/[slug] are untouched.
     A #fragment on an old link survives the redirect (the browser re-applies
     it), and every anchor id is preserved on /concerns.

     Temporary (307) for now so a rollback is clean — browsers cache 308s
     indefinitely, which would strand visitors on /concerns if this were ever
     reverted. Switch to `permanent: true` once the client signs off. */
  async redirects() {
    return [{ source: "/treatments", destination: "/concerns", permanent: false }];
  },

  // Foundation hook: keeps the door open for future MDX-driven articles (phase two).
  // pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;

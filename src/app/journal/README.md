# Journal / Articles — PHASE TWO (optional, not wired up)

This directory is a **placeholder for future editorial content** (articles, skin/hair
education, clinic news). It is intentionally **not** part of phase-one navigation and
has **no route file**, so nothing is published or indexed yet.

## When you're ready to build it (phase two)

Recommended approach:

1. Content source — choose one:
   - **MDX files** in `src/content/journal/*.mdx` (enable `mdx` in `next.config.ts`
     `pageExtensions`, already stubbed as a comment), or
   - a **headless CMS** (e.g. Sanity, Contentful, Payload) fetched in a Server Component.
2. Add routes:
   - `src/app/journal/page.tsx` — index/listing (reuse `PageHero`, `Section`, cards).
   - `src/app/journal/[slug]/page.tsx` — article view (reuse `Prose`, `ImageFrame`).
3. Add to `primaryNav`/`footerNav` in `src/lib/site.ts` and to `sitemap.ts`.
4. Reuse existing components — the design system already covers everything needed.

Keep articles **compliance-safe**: same guardrails as the rest of the site
(no guaranteed outcomes, no before/after without legal review, supportive framing).

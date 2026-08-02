/* =============================================================================
   BRAND ASSET CONFIG
   -----------------------------------------------------------------------------
   The client's ORIGINAL logo PNG is the single source of truth for the logo.
   It must NOT be recreated, traced or reinterpreted in code.

   ▸ TO UPDATE THE LOGO (if the client supplies new artwork):
     1. Replace: public/brand/source/regenerate-logo-original.png
     2. Run:     node scripts/generate-logo-assets.mjs
        (re-derives header/footer/favicon/apple-touch/192/512/WebP/OG variants)
     3. Update LOGO_ASPECT below if the script reports a new trimmed size.
   ========================================================================== */

/** Derived, web-optimised logo assets (produced by generate-logo-assets.mjs). */
export const logoAssets = {
  /** Untouched client original — the source of truth. */
  source: "/brand/source/regenerate-logo-original.png",
  /** Optimised horizontal-friendly asset for the site header. */
  header: "/brand/logo-header.png",
  /** Optimised asset for the footer. */
  footer: "/brand/logo-footer.png",
  /** Full-resolution transparent master, for any larger placement. */
  full: "/brand/logo-full.png",
} as const;

/** Intrinsic dimensions of the trimmed client logo (R + dandelion + wordmark).
    Matches public/brand/logo-full.png — keep in sync if the client supplies a
    new original (the generator prints the trimmed size when it runs). */
export const LOGO_ASPECT = { width: 1704, height: 1472 };

/* =============================================================================
   BRAND ASSET CONFIG
   -----------------------------------------------------------------------------
   The client's ORIGINAL logo PNG is the single source of truth for the logo.
   It must NOT be recreated, traced or reinterpreted in code.

   ▸ TO ACTIVATE THE REAL LOGO:
     1. Save the client's original PNG to:
          public/brand/source/regenerate-logo-original.png
     2. Run:  node scripts/generate-logo-assets.mjs
        (derives header/footer/favicon/apple-touch/192/512/WebP variants from it)
     3. Flip LOGO_READY below to `true`.

   Until then the site renders the previous vector lockup so nothing appears
   broken — but that lockup is NOT the client's logo and must not ship.
   ========================================================================== */

/** Flip to true once the client's original PNG is in place (see steps above). */
export const LOGO_READY = false;

/** Derived, web-optimised logo assets (produced by generate-logo-assets.mjs). */
export const logoAssets = {
  /** Untouched client original — the source of truth. */
  source: "/brand/source/regenerate-logo-original.png",
  /** Optimised horizontal-friendly asset for the site header. */
  header: "/brand/logo-header.png",
  /** Optimised asset for the footer. */
  footer: "/brand/logo-footer.png",
  /** Light/reversed treatment for dark surfaces, if supplied. */
  reversed: "/brand/logo-reversed.png",
} as const;

/** Intrinsic aspect ratio of the client logo (square lockup: R + wordmark). */
export const LOGO_ASPECT = { width: 1000, height: 1000 };

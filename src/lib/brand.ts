/* =============================================================================
   BRAND ASSET CONFIG
   -----------------------------------------------------------------------------
   The client's ORIGINAL logo files are the single source of truth. They are
   never recreated, traced or reinterpreted in code.

   ROUND-3 BRAND RULES (client-approved):
     · The CIRCULAR logo is the main brand identity — used in the header.
     · The decorative mark is the FULL EMBLEM: R + curved stems + dandelions
       together. A dandelion on its own is never used anywhere on the site.
     · The emblem appears as background artwork only BEHIND TEXT, never beneath
       an image or image placeholder, where it would be covered and pointless.
     · The footer uses an emblem + brand-name lockup as the clinic identity.

   ▸ TO UPDATE (if the client supplies new artwork):
     1. Replace the file(s) in public/brand/source/
     2. Run:  node scripts/generate-logo-assets.mjs
     3. Update the intrinsic sizes below if the script reports new dimensions.
   ========================================================================== */

export const logoAssets = {
  /** Untouched client originals — the source of truth. */
  sourceCircle: "/brand/source/regenerate-circle-original.jpg",
  sourceLockup: "/brand/source/regenerate-lockup-original.jpg",

  /** MAIN IDENTITY — circular logo, header-optimised. */
  header: "/brand/logo-header.png",
  /** Full-resolution circular logo for larger placements. */
  primaryCircle: "/brand/logo-primary-circle.png",

  /** FOOTER IDENTITY — emblem + regenerate + SKIN & HAIR CLINIC. */
  footer: "/brand/logo-footer.png",

  /** DECORATIVE MARK — the full emblem. Background artwork behind text only. */
  emblem: "/brand/logo-emblem.png",
} as const;

/** Intrinsic dimensions, so the browser reserves correct space and nothing
    shifts on load. Keep in sync with what generate-logo-assets.mjs reports. */
export const LOGO_SIZES = {
  /** Circular logo — square. */
  circle: { width: 2555, height: 2546 },
  /** Footer lockup — emblem above the wordmark. */
  footer: { width: 975, height: 759 },
  /** Emblem alone. */
  emblem: { width: 562, height: 417 },
} as const;

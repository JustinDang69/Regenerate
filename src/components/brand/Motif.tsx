/* =============================================================================
   Motif — the decorative dandelion, taken from the CLIENT'S OWN logo artwork.
   -----------------------------------------------------------------------------
   Used as a subtle ornament: dividers, section accents, background flourishes,
   image placeholders. This replaces the earlier hand-drawn glyph so every
   dandelion on the site matches the real logo exactly.

   The artwork is rendered as a CSS mask filled with `currentColor` rather than a
   plain <img>. The silhouette comes straight from public/brand/motif-dandelion.png
   (generated from the client original), while colour and opacity stay controllable
   from the parent — which the light-on-olive CTA band needs. The motif is a single
   flat ink colour, so masking loses nothing.

   Purely decorative: always aria-hidden, never announced to screen readers.
   ========================================================================== */

const MOTIF_URL = "url('/brand/motif-dandelion.png')";

export default function Motif({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className ?? ""}`}
      style={{
        WebkitMaskImage: MOTIF_URL,
        maskImage: MOTIF_URL,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

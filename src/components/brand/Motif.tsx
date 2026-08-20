/* =============================================================================
   Motif — the FULL brand emblem (R + curved stems + dandelions), used as
   background artwork.
   -----------------------------------------------------------------------------
   ROUND-3 BRAND RULES — read before changing anything here:

     · This renders the COMPLETE emblem. The dandelion is never used on its own;
       the client explicitly rejected standalone dandelion decoration.
     · It belongs BEHIND TEXT — statements, editorial copy, the footer identity.
       Never place it under an image or image placeholder: real photography will
       cover it, which makes it pointless.
     · Keep it extremely subtle. Low opacity, plenty of white space around it,
       never repeated across a page, never competing with reading.

   The artwork is rendered as a CSS mask filled with `currentColor` rather than a
   plain <img>, so the silhouette comes straight from the client's file while
   colour and opacity stay controllable from the parent. The emblem is a single
   flat ink, so masking loses nothing.

   Purely decorative: always aria-hidden, never announced to screen readers.

   ⚠️ Do NOT pass display utilities (`hidden`, `lg:block`, …) via className. The
   base `inline-block` below competes with them in the same CSS layer and wins,
   so the motif would render at every breakpoint. Wrap Motif in a container and
   control visibility there instead — see MotifLayer.
   ========================================================================== */

import { logoAssets } from "@/lib/brand";

const MASK = `url('${logoAssets.emblem}')`;

export default function Motif({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      /* Carries the emblem's own 562:417 ratio, so callers set ONE dimension
         (usually height) and the other follows — no squashing, no letterboxing. */
      className={`inline-block shrink-0 aspect-[562/417] bg-current ${className ?? ""}`}
      style={{
        WebkitMaskImage: MASK,
        maskImage: MASK,
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

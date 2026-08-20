/* =============================================================================
   MotifLayer — decorative, non-interactive background layer.
   -----------------------------------------------------------------------------
   ROUND 3: the emblem is positioned to sit BEHIND TEXT, not behind imagery. In
   the hero the text column is on the left, so the emblem is placed there rather
   than under the media on the right — under the media it would be covered by the
   real clinic film and be pointless.

   Ambient warm glows were removed with Palette C: the page is white-grounded now,
   and a gold wash across the background is exactly the beige-heavy feel the
   client asked to move away from. What remains is an almost-invisible texture and
   a single, very faint emblem.

   Purely presentational (aria-hidden). Keep opacity low — restraint is the brand.
   ========================================================================== */
import Motif from "./Motif";

type Props = {
  /** Placement preset. */
  variant?: "hero" | "corner" | "quiet";
  className?: string;
};

export default function MotifLayer({ variant = "quiet", className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`.trim()}
    >
      {/* Almost-invisible texture for depth */}
      <div className="texture-noise absolute inset-0" />

      {/* NOTE: responsive visibility lives on these wrappers, never on <Motif>.
          Motif's own `inline-block` would override a `hidden` passed through
          className, so the emblem would show at every breakpoint. */}

      {variant === "hero" && (
        /* Left side — behind the hero's text column, never under the media.
           Hidden below lg, where the single column leaves no room for it to sit
           behind text without crowding the copy. */
        <span className="hidden lg:block">
          <Motif className="absolute -left-16 top-[22%] h-[26rem] text-accent/[0.05]" />
        </span>
      )}

      {variant === "corner" && (
        <Motif className="absolute -bottom-10 -left-8 h-56 text-accent/[0.05]" />
      )}

      {variant === "quiet" && (
        /* Interior page heroes: behind the heading block, offset right. */
        <span className="hidden md:block">
          <Motif className="absolute right-[4%] top-[18%] h-64 text-accent/[0.045]" />
        </span>
      )}
    </div>
  );
}

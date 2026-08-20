/* =============================================================================
   Divider — a fine hairline between sections.
   -----------------------------------------------------------------------------
   ROUND 3: the small centred glyph was removed. The emblem is unreadable at
   24px, and a lone dandelion is no longer permitted anywhere on the site. A
   clean rule suits the clinical direction better — structure from line, not
   ornament. The `accent` variant marks a more significant break.
   ========================================================================== */

type Props = {
  /** Tints the rule olive-gold for a more deliberate section break. */
  accent?: boolean;
  className?: string;
};

export default function Divider({ accent = false, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${
        accent
          ? "bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          : "bg-gradient-to-r from-transparent via-border-strong to-transparent"
      } ${className ?? ""}`.trim()}
    />
  );
}

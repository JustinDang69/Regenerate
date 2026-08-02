/* =============================================================================
   Divider — elegant hairline section divider with an optional centred motif.
   Uses the dandelion glyph sparingly (per brief: subtle, not overused).
   ========================================================================== */
import Motif from "./Motif";

type Props = {
  motif?: boolean;
  className?: string;
};

export default function Divider({ motif = true, className }: Props) {
  if (!motif) {
    return <div className={`rule ${className ?? ""}`.trim()} aria-hidden="true" />;
  }
  return (
    <div
      className={`flex items-center gap-5 ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-strong" />
      <Motif className="h-6 w-6 text-accent/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-strong" />
    </div>
  );
}

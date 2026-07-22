/* =============================================================================
   MotifLayer — decorative, non-interactive background ornament.
   Combines an ambient gold glow with very faint dandelion line-art. Purely
   presentational (aria-hidden). Keep opacity low — restraint is the brand.
   ========================================================================== */
import DandelionMark from "./DandelionMark";

type Props = {
  /** Placement preset for the ambient glow + motif. */
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

      {variant === "hero" && (
        <>
          <div className="glow absolute -right-[10%] -top-[20%] h-[70vh] w-[70vh]" />
          <div className="glow absolute -bottom-[30%] left-[5%] h-[50vh] w-[50vh] opacity-70" />
          <DandelionMark
            className="absolute right-[6%] top-[14%] hidden h-64 w-64 text-accent/10 md:block"
            strokeWidth={0.7}
          />
        </>
      )}

      {variant === "corner" && (
        <DandelionMark
          className="absolute -bottom-8 -left-6 h-48 w-48 text-accent/[0.07]"
          strokeWidth={0.8}
        />
      )}

      {variant === "quiet" && (
        <div className="glow absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 opacity-50" />
      )}
    </div>
  );
}

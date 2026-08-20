/* =============================================================================
   ImageFrame — premium image block.
   -----------------------------------------------------------------------------
   Renders real photography via next/image when `src` is provided; otherwise
   shows an elegant, on-brand PLACEHOLDER (soft tint + dandelion motif + label).
   Supports curved masks for editorial composition.

   TODO(content): supply real clinic photography (treatment rooms, practitioners,
   space, close-up skin/hair). Replace placeholders by passing `src` + `alt`.
   ========================================================================== */
import Image from "next/image";

type Ratio = "portrait" | "landscape" | "square" | "wide" | "tall";
type Mask = "none" | "arch" | "soft";

type Props = {
  src?: string;
  alt?: string;
  ratio?: Ratio;
  mask?: Mask;
  /** Short label describing the intended photo, shown on the placeholder. */
  placeholderLabel?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

const ratios: Record<Ratio, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
  tall: "aspect-[3/4]",
};

const masks: Record<Mask, string> = {
  none: "rounded-[var(--radius-lg)]",
  // Elegant arched top — used for portraits / feature imagery.
  arch: "rounded-[var(--radius-lg)] [border-top-left-radius:999px] [border-top-right-radius:999px]",
  soft: "rounded-[var(--radius-xl)]",
};

export default function ImageFrame({
  src,
  alt = "",
  ratio = "portrait",
  mask = "none",
  placeholderLabel = "Clinic photography",
  priority,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-elevated shadow-[var(--shadow-md)] ${ratios[ratio]} ${masks[mask]} ${className ?? ""}`.trim()}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        /* ROUND 3: placeholders are deliberately plain. The client confirmed these
           blocks are all being replaced with real clinic photography/video, so no
           brand artwork is invested here — and specifically NO emblem behind them,
           since real media would simply cover it. Near-white fill, hairline border,
           quiet label. */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-elevated text-center">
          <span className="eyebrow text-muted">{placeholderLabel}</span>
          <span className="text-[0.7rem] text-muted/80">Image placeholder</span>
        </div>
      )}
      {/* Subtle inner border for refinement */}
      <div
        className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--border)] ${masks[mask]}`}
      />
    </div>
  );
}

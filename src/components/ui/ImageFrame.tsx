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
  /** Must describe the image's real rendered width so the browser picks a
   *  large-enough derivative. Callers whose layout is narrower than 50vw
   *  should pass a tighter value. */
  sizes?: string;
  /** Quality for OPTIMISED images only. Ignored for the approved clinic
   *  photography, which is served unoptimised (see below). */
  quality?: 75 | 90;
  /** Serve the original file as-is, bypassing Next/Vercel recompression.
   *  Defaults to true for the approved clinic photography under
   *  /media/clinic/ — the client confirmed the raw JPEGs are sharp and the
   *  AVIF/WebP derivatives visibly softer, so fidelity wins over bytes for
   *  those seven files. Everything else (logos, icons, future media) keeps
   *  normal optimisation unless a caller opts in explicitly. */
  unoptimized?: boolean;
};

/** The client-approved clinic photography lives here and is always served raw. */
const CLINIC_PHOTO_PREFIX = "/media/clinic/";

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
  quality = 90,
  unoptimized,
}: Props) {
  /* Raw delivery for the approved clinic set unless a caller says otherwise.
     With `unoptimized`, Next emits the original URL with no srcset, so the
     browser receives the untouched JPEG (≈240–340KB each). `sizes`/`quality`
     are then inert but kept so optimisation can be re-enabled per image. */
  const raw = unoptimized ?? (!!src && src.startsWith(CLINIC_PHOTO_PREFIX));
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
          quality={quality}
          unoptimized={raw}
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

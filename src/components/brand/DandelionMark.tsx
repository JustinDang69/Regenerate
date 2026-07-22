/* =============================================================================
   DandelionMark — the clinic's dandelion seed-head glyph.
   -----------------------------------------------------------------------------
   IMPORTANT (brand): This is a faithful, restrained PLACEHOLDER interpretation
   of the dandelion motif described in the brief. NO original logo image was
   supplied in the project, so this must be REPLACED with the client's exact
   traced logo before launch. See /public/brand/README.md and the logo asset
   plan. Do not restyle the brand — swap in the real vector.

   Rendered as fine line-work (stroke = currentColor) so it inherits tone and
   works as icon, favicon source, and decorative motif alike.
   ========================================================================== */

type Props = {
  className?: string;
  title?: string;
  strokeWidth?: number;
};

// Round to 2 decimals so server- and client-rendered SVG attributes serialise
// identically (avoids React hydration mismatch on raw Math.cos/sin floats) and
// matches the geometry in scripts/generate-logo-assets.mjs.
const r2 = (n: number) => Math.round(n * 100) / 100;

// Twelve radiating seed filaments, evenly distributed around the head.
const SEEDS = Array.from({ length: 12 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
  const rInner = 3.2; // inner start radius
  const rLen = 15; // filament length
  const cx = 32;
  const cy = 26;
  return {
    x1: r2(cx + Math.cos(angle) * rInner),
    y1: r2(cy + Math.sin(angle) * rInner),
    x2: r2(cx + Math.cos(angle) * rLen),
    y2: r2(cy + Math.sin(angle) * rLen),
    // pappus tuft coordinates (small circle at filament tip)
    px: r2(cx + Math.cos(angle) * (rLen + 1.4)),
    py: r2(cy + Math.sin(angle) * (rLen + 1.4)),
  };
});

export default function DandelionMark({
  className,
  title = "Regenerate dandelion motif",
  strokeWidth = 1.1,
}: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      {/* Seed head — radiating filaments + soft tufts */}
      {SEEDS.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} opacity={0.9} />
          <circle cx={s.px} cy={s.py} r={1.15} opacity={0.85} />
        </g>
      ))}
      {/* Receptacle */}
      <circle cx={32} cy={26} r={2.1} fill="currentColor" stroke="none" />

      {/* Elegant curved stem */}
      <path d="M32 28 C 32 40, 30.5 48, 33 58" opacity={0.9} />
      {/* A single leaf detail on the stem */}
      <path
        d="M32.4 41 C 27 40, 24.5 43.5, 24 47 C 28.5 47, 31.4 45, 32.4 41 Z"
        opacity={0.75}
      />

      {/* Two detached seeds drifting — the 'regeneration' idea */}
      <g opacity={0.7}>
        <line x1={50} y1={16} x2={54} y2={12} />
        <circle cx={55.2} cy={10.6} r={1} />
        <line x1={50} y1={16} x2={49} y2={11} />
        <circle cx={48.6} cy={9.6} r={1} />
      </g>
      <g opacity={0.55}>
        <line x1={12} y1={12} x2={9} y2={8} />
        <circle cx={7.9} cy={6.7} r={0.9} />
      </g>
    </svg>
  );
}

/* =============================================================================
   HeroMedia — the hero's film slot.
   -----------------------------------------------------------------------------
   ▸ WHEN THE CLINIC FILM ARRIVES:
       1. Put the file at  public/media/clinic-hero.mp4  (plus .webm if available)
          and a first-frame still at  public/media/clinic-hero-poster.jpg
       2. Set HERO_VIDEO below to `true`.
     Nothing else changes — the layout, aspect ratio and reveal all stay as-is.

   Spec agreed with the client: ~10 seconds, seamless loop, gimbal, 4K source,
   compressed hard for fast loading. It must not be long or heavy.

   Until then a temporary placeholder stands in. It is deliberately NOT stock
   photography — it is a slow architectural light study that demonstrates the
   behaviour the real footage will inherit, and it is labelled so it can never be
   mistaken for final media.

   `poster` is set so the first frame paints immediately, and the intrinsic
   aspect ratio is fixed by CSS so nothing shifts as the video loads.
   ========================================================================== */

/** Flip to true once the clinic film is in public/media/. */
const HERO_VIDEO = false;

export default function HeroMedia() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-sunken lg:aspect-[3/4]">
      {HERO_VIDEO ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/clinic-hero-poster.jpg"
          aria-label="Regenerate clinic film"
        >
          <source src="/media/clinic-hero.webm" type="video/webm" />
          <source src="/media/clinic-hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <>
          {/* Temporary architectural stand-in. Soft light forms drifting slowly —
              the same unhurried movement the gimbal footage will have. */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <span className="absolute -left-[14%] top-[4%] block aspect-square w-[78%] animate-[drift-a_18s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_40%_40%,#efe6d2,#ffffff_70%)] blur-[42px]" />
            <span className="absolute -right-[16%] top-[26%] block aspect-square w-[66%] animate-[drift-b_22s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_50%_50%,#e6dcc4,#ffffff_72%)] opacity-90 blur-[42px]" />
            <span className="absolute -bottom-[26%] left-[6%] block aspect-square w-[88%] rounded-full bg-[radial-gradient(circle_at_50%_30%,#f5efe2,#ffffff_76%)] blur-[42px]" />
            {/* A lit aperture — architectural, not cosmetic. */}
            <span className="absolute inset-x-[18%] -bottom-[4%] top-[12%] block animate-[drift-c_20s_ease-in-out_infinite] rounded-t-full bg-gradient-to-b from-white/95 to-white/35 shadow-[0_40px_90px_-50px_rgba(64,54,28,0.4)]" />
            <span className="texture-noise absolute inset-0" />
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 to-transparent px-5 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
              Clinic film — placeholder
            </p>
            <p className="mt-1 text-[0.74rem] text-muted">
              Final: ~10s seamless loop, gimbal, 4K source · compressed for fast load
            </p>
          </div>
        </>
      )}
    </div>
  );
}

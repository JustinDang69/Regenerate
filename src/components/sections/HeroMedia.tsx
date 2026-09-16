/* =============================================================================
   HeroMedia — the hero's media slot.
   -----------------------------------------------------------------------------
   CURRENT: the client's clinic photograph (reception with the Regenerate wall
   logo). The client chose this as the primary homepage visual for now.

   ▸ WHEN THE CLINIC FILM ARRIVES:
       1. Put the file at  public/media/clinic-hero.mp4  (plus .webm if available)
          and a first-frame still at  public/media/clinic-hero-poster.jpg
       2. Set HERO_VIDEO below to `true`.
     Nothing else changes — the layout, aspect ratio and reveal all stay as-is.
     The photograph is simply superseded by the film.

   Spec agreed with the client: ~10 seconds, seamless loop, gimbal, 4K source,
   compressed hard for fast loading. It must not be long or heavy.

   The intrinsic aspect ratio is fixed by CSS so nothing shifts as media loads.
   Source manifest: public/media/clinic/SOURCES.md
   ========================================================================== */
import Image from "next/image";

/** Flip to true once the clinic film is in public/media/. */
const HERO_VIDEO = false;

/** The client's chosen primary visual until the film arrives (3:4, matches the
 *  lg aspect exactly). Source: reclinicphotoss/original-16FED9D4-…jpeg */
const HERO_IMAGE = {
  src: "/media/clinic/reception-logo-wall.jpg",
  alt: "Regenerate Skin & Hair Clinic reception, with the clinic's wall logo, armchair seating and a floral display",
};

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
        /* sizes: the media column is ~537px at the 1248px container cap (49% of
           the usable width minus the grid gap), so "540px" rather than "50vw"
           — 50vw over-described the slot at wide viewports. quality 90: at
           the default 75, AVIF smoothed the room texture. */
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          quality={90}
          sizes="(max-width: 1023px) 100vw, 540px"
          className="object-cover"
        />
      )}
    </div>
  );
}

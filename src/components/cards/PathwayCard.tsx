/* =============================================================================
   PathwayCard — the homepage's top-level entry points (Skin · Hair · Packages).
   -----------------------------------------------------------------------------
   All three cards share identical height, spacing, typography, border, hover
   animation and responsive behaviour. Cards may carry EITHER an image (Skin,
   Hair) or a short list of highlights (Packages) — the CTA is pinned to the
   bottom with `mt-auto` so every card's button aligns on the same baseline
   regardless of which variant is used.
   ========================================================================== */
import Button from "@/components/ui/Button";
import ImageFrame from "@/components/ui/ImageFrame";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  /** Photographic variant (Skin / Hair). Omit for a text-led card. */
  image?: { label: string };
  /** Text-led variant (Packages) — shown when no image is supplied. */
  highlights?: string[];
};

export default function PathwayCard({
  eyebrow,
  title,
  description,
  cta,
  image,
  highlights,
}: Props) {
  return (
    // ROUND 3: hover warms the border to olive and lifts gently — restrained
    // elevation and border motion rather than scaling, per the client's note that
    // cards should not scale. The arrow movement lives on the CTA.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-8 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-md)] md:p-10">
      <span className="eyebrow text-muted">{eyebrow}</span>
      <h3 className="mt-3 text-h3 text-[1.7rem]">{title}</h3>
      <p className="mt-3 max-w-md text-secondary">{description}</p>

      {image ? (
        <div className="mt-8">
          <ImageFrame ratio="landscape" mask="soft" placeholderLabel={image.label} />
        </div>
      ) : (
        highlights && (
          <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[0.95rem] text-secondary"
              >
                <span
                  aria-hidden
                  className="inline-block h-px w-5 shrink-0 bg-accent/60"
                />
                {item}
              </li>
            ))}
          </ul>
        )
      )}

      {/* mt-auto pins every card's CTA to the same baseline, so the image-led and
          text-led variants stay height-matched across the row. */}
      <div className="mt-auto pt-8">
        <Button href={cta.href} variant="secondary">
          {cta.label}
        </Button>
      </div>
    </article>
  );
}

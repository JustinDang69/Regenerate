/* =============================================================================
   ConcernSection — the concern-led narrative block for Skin & Hair pages.
   Order per brief: PROBLEM → TECHNOLOGIES/APPROACH → BENEFITS → CTA.
   Alternates side of the accompanying imagery for editorial rhythm.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import ImageFrame from "@/components/ui/ImageFrame";
import Button from "@/components/ui/Button";
import DandelionMark from "@/components/brand/DandelionMark";
import type { Concern } from "@/content/concerns";
import { technologies } from "@/content/technologies";
import { allPackages, formatPrice } from "@/content/packages";
import { cta } from "@/lib/site";

function techBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
function pkgBySlug(slug: string) {
  return allPackages.find((p) => p.slug === slug);
}

export default function ConcernSection({
  concern,
  index,
}: {
  concern: Concern;
  index: number;
}) {
  const reverse = index % 2 === 1;
  const techs = concern.technologies.map(techBySlug).filter(Boolean);
  const pkgs = concern.relatedPackages.map(pkgBySlug).filter(Boolean);

  return (
    <section
      id={concern.slug}
      className="scroll-mt-28 border-t border-border py-[clamp(3.5rem,7vw,6rem)] first:border-t-0"
      aria-labelledby={`${concern.slug}-title`}
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
        {/* Imagery */}
        <Reveal className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}>
          <ImageFrame
            ratio="portrait"
            mask="arch"
            placeholderLabel={`${concern.title} imagery`}
          />
        </Reveal>

        {/* Narrative */}
        <div className={`flex flex-col gap-6 md:col-span-7 ${reverse ? "md:order-1" : ""}`}>
          <Reveal className="flex items-center gap-3">
            <span className="eyebrow text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <DandelionMark className="h-5 w-5 text-accent/50" strokeWidth={1} />
          </Reveal>

          <Reveal as="h2" delay={40} id={`${concern.slug}-title`} className="text-h2">
            {concern.title}
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-5">
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                The concern
              </h3>
              <p className="mt-1.5 text-secondary text-pretty">{concern.problem}</p>
            </div>
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                Our approach
              </h3>
              <p className="mt-1.5 text-secondary text-pretty">{concern.approach}</p>
            </div>
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                What it supports
              </h3>
              <p className="mt-1.5 text-secondary text-pretty">{concern.benefits}</p>
            </div>
          </Reveal>

          {/* Technology chips */}
          {techs.length > 0 && (
            <Reveal delay={120} className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <span
                  key={t!.slug}
                  title={t!.what}
                  className="rounded-[var(--radius-pill)] border border-border bg-fill px-3 py-1 text-[0.75rem] font-medium text-accent-contrast"
                >
                  {t!.abbr} · {t!.name}
                </span>
              ))}
            </Reveal>
          )}

          {/* Related programs + CTA */}
          <Reveal delay={160} className="mt-1 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {pkgs.length > 0 && (
              <p className="text-[0.85rem] text-muted">
                Related program:{" "}
                {pkgs.map((p, i) => (
                  <span key={p!.slug} className="text-accent-contrast">
                    {p!.name} ({formatPrice(p!.price)})
                    {i < pkgs.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            <Button href={cta.bookHref} variant="secondary" size="sm">
              {cta.book}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

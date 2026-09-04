/* =============================================================================
   ConcernSection — the concern-led narrative block for Skin & Hair pages.
   Order per brief: PROBLEM → TECHNOLOGIES/APPROACH → BENEFITS → CTA.
   Alternates side of the accompanying imagery for editorial rhythm.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import ImageFrame from "@/components/ui/ImageFrame";
import Button from "@/components/ui/Button";
import Link from "next/link";
import type { Concern } from "@/content/concerns";
import { skinTechnologies } from "@/content/treatments";
import { allPackages, formatPrice } from "@/content/packages";
import { cta } from "@/lib/site";

function techBySlug(slug: string) {
  return skinTechnologies.find((t) => t.slug === slug);
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
      className="scroll-mt-28 border-t border-border py-[clamp(4.5rem,8vw,7.5rem)] first:border-t-0"
      aria-labelledby={`${concern.slug}-title`}
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-16 lg:gap-20">
        {/* Imagery */}
        <Reveal className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}>
          <ImageFrame
            ratio="portrait"
            mask="arch"
            placeholderLabel={`${concern.title} imagery`}
          />
        </Reveal>

        {/* Narrative */}
        <div className={`flex flex-col gap-7 md:col-span-7 ${reverse ? "md:order-1" : ""}`}>
          <Reveal className="flex items-center gap-3">
            <span className="eyebrow text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* ROUND 3: small emblem removed — unreadable at this size. */}
            <span aria-hidden className="h-px w-8 bg-accent/50" />
          </Reveal>

          <Reveal as="h2" delay={40} id={`${concern.slug}-title`} className="text-h2">
            {concern.title}
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-7">
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                The concern
              </h3>
              <p className="mt-2.5 max-w-prose text-secondary text-pretty">{concern.problem}</p>
            </div>
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                Our approach
              </h3>
              <p className="mt-2.5 max-w-prose text-secondary text-pretty">{concern.approach}</p>
            </div>
            <div>
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent-contrast">
                What it supports
              </h3>
              <p className="mt-2.5 max-w-prose text-secondary text-pretty">{concern.benefits}</p>
            </div>
          </Reveal>

          {/* Inline technology chips — contextual tags within the concern
              narrative, deliberately NOT the main technology showcase (that is
              the TechnologyCard grid further down the page). They now read from
              the approved technology set and link through to the detail page.
              Wording stays capability-led: these MAY be used, selected by
              suitability, not applied to every treatment by default. */}
          {techs.length > 0 && (
            <Reveal delay={120} className="mt-1 flex flex-wrap items-center gap-2.5">
              <span className="text-[0.75rem] text-muted">May involve:</span>
              {techs.map((t) => (
                <Link
                  key={t!.slug}
                  href={`/treatments/technologies/${t!.slug}`}
                  title={t!.tagline}
                  className="rounded-[var(--radius-pill)] border border-border bg-fill px-3 py-1 text-[0.75rem] font-medium text-accent-contrast transition-colors hover:border-accent hover:bg-surface"
                >
                  {t!.name}
                </Link>
              ))}
            </Reveal>
          )}

          {/* Related programs + CTA */}
          <Reveal delay={160} className="mt-3 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
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

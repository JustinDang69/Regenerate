/* TreatmentIndexCard — Skin / Hair & Scalp treatment card on /treatments.
   Bookable: shows both the booking CTA and Learn More. Distinct from
   TechnologyCard, which never carries a booking CTA. */
import Link from "next/link";
import Button from "@/components/ui/Button";
import { cta } from "@/lib/site";
import type { Treatment } from "@/content/treatments";

export default function TreatmentIndexCard({ treatment }: { treatment: Treatment }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-9 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-md)]">
      {/* A signature treatment keeps its normal group label and card size —
          the designation is an added quiet line, not a promotional badge. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="eyebrow text-muted">
          {treatment.group === "skin" ? "Skin" : "Hair & Scalp"}
        </span>
        {treatment.signature && (
          <>
            <span aria-hidden className="h-3 w-px bg-border-strong" />
            {/* "Signature" rather than the full "Signature Treatment" used on
                the detail page: the card's inner width is ~246px and the full
                pair needs ~275px, so spelling it out wraps to a second line and
                makes a signature card visibly taller than its siblings. The
                word reads unambiguously inside a Treatments section. */}
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent-contrast">
              Signature
            </span>
          </>
        )}
      </div>
      <h3 className="mt-4 text-h3 text-[1.5rem]">{treatment.name}</h3>
      <p className="mt-2.5 font-serif text-[1.02rem] italic text-accent-contrast">{treatment.tagline}</p>
      <p className="mt-5 text-[0.94rem] leading-relaxed text-secondary text-pretty">{treatment.summary}</p>

      <div className="mt-auto flex items-center gap-5 pt-9">
        <Button href={cta.bookHref} size="sm">
          {cta.book}
        </Button>
        <Link
          href={`/treatments/${treatment.slug}`}
          className="inline-flex items-center gap-1 text-[0.85rem] font-semibold text-accent-contrast hover:text-accent-hover"
        >
          Learn more
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}

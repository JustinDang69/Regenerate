/* TreatmentCard — compact single-treatment price card.
   Shows the client's concise menu name and price. Where a Treatment Guide page
   exists it links there instead of duplicating clinical copy; a duration is
   shown only when the client has confirmed one (no "approx." placeholders). */
import { type SingleTreatment, formatPrice } from "@/content/packages";
import { treatmentBySlug } from "@/content/treatments";
import { bookHrefFor, cta } from "@/lib/site";
import Link from "next/link";

export default function TreatmentCard({ treatment }: { treatment: SingleTreatment }) {
  const detail = treatment.detailSlug ? treatmentBySlug(treatment.detailSlug) : undefined;
  return (
    <article className="group flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-h3 text-[1.2rem]">{treatment.name}</h3>
        <span className="shrink-0 font-serif text-[1.5rem] leading-none text-accent-contrast">
          {formatPrice(treatment.price)}
        </span>
      </div>

      {/* Clinical summary comes from the Treatment Guide (single source), or
          nothing at all — never a filler line. */}
      {detail?.summary && (
        <p className="text-[0.9rem] text-secondary">{detail.summary}</p>
      )}

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4">
        <span className="text-[0.78rem] uppercase tracking-[0.12em] text-muted">
          {treatment.duration ??
            (detail ? (
              <Link
                href={`/treatments/${detail.slug}`}
                className="normal-case tracking-normal underline underline-offset-2 hover:text-accent-contrast"
              >
                View treatment details
              </Link>
            ) : null)}
        </span>
        <Link
          href={bookHrefFor(treatment.detailSlug)}
          className="inline-flex items-center gap-1 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-accent-contrast hover:text-accent-hover"
        >
          {cta.book}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
      {treatment.duration && detail && (
        <Link
          href={`/treatments/${detail.slug}`}
          className="text-[0.8rem] text-muted underline underline-offset-2 hover:text-accent-contrast"
        >
          View treatment details
        </Link>
      )}
    </article>
  );
}

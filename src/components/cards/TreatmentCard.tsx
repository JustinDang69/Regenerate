/* TreatmentCard — compact single-treatment card: name, price, description, duration, CTA. */
import { type SingleTreatment, formatPrice } from "@/content/packages";
import { cta } from "@/lib/site";
import Link from "next/link";

export default function TreatmentCard({ treatment }: { treatment: SingleTreatment }) {
  return (
    <article className="group flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-h3 text-[1.2rem]">{treatment.name}</h3>
        <span className="font-serif text-[1.5rem] leading-none text-accent-contrast">
          {formatPrice(treatment.price)}
        </span>
      </div>
      <p className="text-[0.9rem] text-secondary">{treatment.description}</p>
      <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
        <span className="text-[0.78rem] uppercase tracking-[0.12em] text-muted">
          {treatment.duration}
        </span>
        <Link
          href={cta.bookHref}
          className="inline-flex items-center gap-1 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-accent-contrast hover:text-accent-hover"
        >
          {cta.book}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}

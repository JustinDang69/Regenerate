/* TreatmentIndexCard — Skin / Hair & Scalp treatment card on /treatments.
   Bookable: shows both Book Now and Learn More. Distinct from TechnologyCard,
   which never carries a Book Now CTA. */
import Link from "next/link";
import Button from "@/components/ui/Button";
import { cta } from "@/lib/site";
import type { Treatment } from "@/content/treatments";

export default function TreatmentIndexCard({ treatment }: { treatment: Treatment }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-8 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-md)]">
      <span className="eyebrow text-muted">{treatment.group === "skin" ? "Skin" : "Hair & Scalp"}</span>
      <h3 className="mt-3 text-h3 text-[1.5rem]">{treatment.name}</h3>
      <p className="mt-2 font-serif text-[1.02rem] italic text-accent-contrast">{treatment.tagline}</p>
      <p className="mt-4 text-[0.94rem] text-secondary">{treatment.summary}</p>

      <div className="mt-auto flex items-center gap-5 pt-8">
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

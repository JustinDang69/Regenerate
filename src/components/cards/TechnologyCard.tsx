/* TechnologyCard — showcase card for /treatments "Skin and Scalp Technologies".
   Comparable visual prominence to TreatmentIndexCard so technologies read as a
   strength of the clinic, not an afterthought — but NEVER carries a Book Now
   CTA. Technologies are applied within treatments, not booked directly. */
import Link from "next/link";
import type { SkinTechnology } from "@/content/treatments";

export default function TechnologyCard({ tech }: { tech: SkinTechnology }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface-elevated p-8 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-md)]">
      <span className="eyebrow text-muted">
        {tech.slug === "led" ? "Skin & Scalp Technology" : "Technology"}
      </span>
      <h3 className="mt-3 text-h3 text-[1.4rem]">{tech.name}</h3>
      <p className="mt-3 text-[0.92rem] text-secondary">{tech.overview}</p>

      {tech.bestFor.length > 0 && (
        <p className="mt-4 text-[0.85rem] text-muted">
          <span className="font-semibold text-primary/80">Best suited for </span>
          {tech.bestFor.slice(0, 2).join(", ").toLowerCase()}
          {tech.bestFor.length > 2 ? "…" : ""}
        </p>
      )}

      <div className="mt-auto pt-8">
        <Link
          href={`/treatments/technologies/${tech.slug}`}
          className="inline-flex items-center gap-1 text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-accent-contrast hover:text-accent-hover"
        >
          Explore technology
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}

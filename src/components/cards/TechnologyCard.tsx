/* =============================================================================
   TechnologyCard — the showcase card for Skin and Scalp Technologies.
   -----------------------------------------------------------------------------
   Visual reference: the LED card the client approved in Artifact B. It shares
   the treatment card's language deliberately — white ground, same radius,
   padding and heading size, italic olive serif tagline, concise summary,
   "Learn more →" — so technologies read as a genuine clinic capability rather
   than a footnote.

   It stays distinguishable from a treatment in the ways that matter
   commercially: a TECHNOLOGY label instead of Skin / Hair & Scalp, and no
   Book Appointment CTA. Technologies are applied within treatments and
   selected by suitability — they are not booked directly.

   Used identically on /treatments, /skin and /hair so the three stay
   visually consistent.
   ========================================================================== */
import Link from "next/link";
import type { SkinTechnology } from "@/content/treatments";

export default function TechnologyCard({ tech }: { tech: SkinTechnology }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-9 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-md)]">
      <span className="eyebrow text-muted">Technology</span>
      <h3 className="mt-4 text-h3 text-[1.5rem]">{tech.name}</h3>
      <p className="mt-2.5 font-serif text-[1.02rem] italic text-accent-contrast">
        {tech.tagline}
      </p>
      <p className="mt-5 text-[0.94rem] leading-relaxed text-secondary text-pretty">{tech.summary}</p>

      <div className="mt-auto pt-9">
        <Link
          href={`/treatments/technologies/${tech.slug}`}
          className="inline-flex items-center gap-1 text-[0.85rem] font-semibold text-accent-contrast hover:text-accent-hover"
        >
          Learn more
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

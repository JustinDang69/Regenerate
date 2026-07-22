/* =============================================================================
   PractitionerCard — premium staff module.
   Accommodates image, name, role, qualifications, registration, specialties,
   languages, bio. Renders elegantly even while details are placeholders.
   ========================================================================== */
import type { Practitioner } from "@/content/practitioners";
import ImageFrame from "@/components/ui/ImageFrame";

export default function PractitionerCard({ p }: { p: Practitioner }) {
  return (
    <article className="group flex flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-xs)] transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <ImageFrame
        src={p.image}
        alt={p.image ? `${p.name}, ${p.role}` : ""}
        ratio="portrait"
        mask="arch"
        placeholderLabel="Practitioner portrait"
      />

      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-[1.35rem]">{p.name}</h3>
        <p className="text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-accent-contrast">
          {p.role}
        </p>
      </div>

      {p.isPlaceholder && (
        <p className="rounded-[var(--radius-sm)] bg-accent-soft/60 px-3 py-2 text-[0.72rem] text-accent-contrast">
          Full profile coming soon — details pending.
        </p>
      )}

      <p className="text-[0.9rem] text-secondary">{p.bio}</p>

      <dl className="flex flex-col gap-3 border-t border-border pt-4 text-[0.82rem]">
        <div>
          <dt className="eyebrow text-muted">Specialties</dt>
          <dd className="mt-1 text-secondary">{p.specialties.join(" · ")}</dd>
        </div>
        <div>
          <dt className="eyebrow text-muted">Languages</dt>
          <dd className="mt-1 text-secondary">{p.languages.join(", ")}</dd>
        </div>
        <div>
          <dt className="eyebrow text-muted">Qualifications</dt>
          <dd className="mt-1 text-secondary">{p.qualifications.join(", ")}</dd>
        </div>
        {/* Registration renders only when supplied (AHPRA etc.). */}
        {p.registration && (
          <div>
            <dt className="eyebrow text-muted">Registration</dt>
            <dd className="mt-1 text-secondary">{p.registration}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

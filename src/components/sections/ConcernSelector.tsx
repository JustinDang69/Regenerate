/* =============================================================================
   ConcernSelector — "start from a concern" entry point (client component).
   -----------------------------------------------------------------------------
   One group of concern buttons (skin OR hair); selecting one reveals a short
   informational description and the treatments Regenerate commonly considers
   for it, each linking to the booking form with that treatment preselected.

   Used twice on /concerns (client brief, 28 Sep 2026): Skin Concerns as a
   2 × 2 grid, Hair Concerns as three across. Same component, same design —
   only the group and its grid differ.

   One panel is open at a time, and clicking the open concern closes it, so the
   section never pushes the page around unexpectedly.

   Accessibility: the buttons are a real tablist — arrow keys move between
   concerns, the panel is labelled by its button, and only the active button is
   in the tab order (standard tabs pattern). Each instance is its own tablist.

   Wording is informational, never diagnostic. See src/content/concern-selector.ts.
   ========================================================================== */
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { concernsInGroup, type ConcernGroup } from "@/content/concern-selector";
import { treatmentBySlug } from "@/content/treatments";
import { bookHrefFor, cta } from "@/lib/site";

/* Grid per group. Skin is a 2 × 2, capped so each button keeps the width it
   had in the original three-across row rather than stretching to half the
   page. Hair is three across. Both go single-column on phones: the new labels
   ("Pigmentation & Brightening", "Hair thinning + Hair loss") are too long
   for half-width buttons at 375–414px and would break mid-phrase. */
const GRID: Record<ConcernGroup, string> = {
  skin: "grid-cols-1 sm:grid-cols-2 sm:max-w-[49rem]",
  hair: "grid-cols-1 sm:grid-cols-3",
};

export default function ConcernSelector({
  group,
  eyebrow,
  title,
  lead,
  onElevated = false,
}: {
  group: ConcernGroup;
  eyebrow: string;
  title: string;
  lead?: string;
  /** True when the section sits on the elevated tone, so the open panel
   *  takes the base surface instead of blending into the background. */
  onElevated?: boolean;
}) {
  const concerns = concernsInGroup(group);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const open = concerns.find((c) => c.slug === openSlug) ?? null;

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = concerns.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    buttonRefs.current[next]?.focus();
  }

  return (
    <Container>
      <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />

      <div role="tablist" aria-label={title} className={`mt-10 grid gap-3 lg:mt-12 lg:gap-4 ${GRID[group]}`}>
        {concerns.map((concern, i) => {
          const isOpen = concern.slug === openSlug;
          return (
            <button
              key={concern.slug}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`concern-tab-${concern.slug}`}
              aria-selected={isOpen}
              aria-controls={isOpen ? `concern-panel-${concern.slug}` : undefined}
              tabIndex={isOpen || (!openSlug && i === 0) ? 0 : -1}
              onClick={() => setOpenSlug(isOpen ? null : concern.slug)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={[
                "min-h-[3.25rem] rounded-[var(--radius-md)] border px-4 py-3.5 text-[0.9rem] font-semibold text-balance",
                "transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                isOpen
                  ? "border-accent bg-accent-soft/70 text-accent-contrast shadow-[var(--shadow-xs)]"
                  : "border-border bg-surface text-primary hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-sm)]",
              ].join(" ")}
            >
              {concern.label}
            </button>
          );
        })}
      </div>

      {open && (
        <div
          role="tabpanel"
          id={`concern-panel-${open.slug}`}
          aria-labelledby={`concern-tab-${open.slug}`}
          className={`mt-6 rounded-[var(--radius-lg)] border border-border p-6 sm:p-8 lg:mt-8 ${
            onElevated ? "bg-surface" : "bg-surface-elevated"
          }`}
        >
          <p className="max-w-[46rem] text-[0.95rem] leading-relaxed text-secondary text-pretty">
            {open.description}
          </p>

          {/* Deliberately non-committal framing: no efficacy claim is made for
              any treatment against any concern. */}
          <p className="mt-6 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-muted">
            Treatments commonly considered for this concern at Regenerate
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {open.treatmentSlugs.map((slug) => {
              const treatment = treatmentBySlug(slug);
              if (!treatment) return null;
              return (
                <li
                  key={slug}
                  className={`flex flex-col gap-3 rounded-[var(--radius-md)] border border-border p-5 ${
                    onElevated ? "bg-surface-elevated" : "bg-surface"
                  }`}
                >
                  <h3 className="text-h3 text-[1.1rem]">{treatment.name}</h3>
                  {treatment.summary && (
                    <p className="text-[0.86rem] leading-relaxed text-secondary">{treatment.summary}</p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                    <Button href={bookHrefFor(treatment.slug)} size="sm">
                      {cta.book}
                    </Button>
                    <Link
                      href={`/treatments/${treatment.slug}`}
                      className="text-[0.82rem] font-semibold text-accent-contrast underline underline-offset-2 hover:text-accent-hover"
                    >
                      Learn more
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-[0.78rem] text-muted">
            Information only — this is not a diagnosis. Suitability, expected experience and an
            individual plan are confirmed during consultation. Results vary.
          </p>
        </div>
      )}

      {!open && (
        <Reveal className="mt-6 text-[0.86rem] text-muted lg:mt-8">
          Select a concern above to see what it involves and which treatments are commonly
          considered for it.
        </Reveal>
      )}
    </Container>
  );
}

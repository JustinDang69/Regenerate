import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import CTABlock from "@/components/sections/CTABlock";
import TreatmentIndexCard from "@/components/cards/TreatmentIndexCard";
import ConcernSelector from "@/components/sections/ConcernSelector";
import TechnologyCard from "@/components/cards/TechnologyCard";

import {
  treatments,
  skinTechnologies,
  technologiesIntro,
  compounds,
  compoundsIntro,
  sharedInfo,
} from "@/content/treatments";
import { cta } from "@/lib/site";

/* =============================================================================
   CONCERNS — the former /treatments index, repositioned (client brief 28 Sep 2026).
   -----------------------------------------------------------------------------
   ROUTING: this page moved from /treatments to /concerns. /treatments now
   redirects here (next.config.ts). Treatment detail pages are NOT moved —
   they stay at /treatments/[slug] and /treatments/technologies/[slug], so
   every booking link and shared treatment URL keeps working.

   Section order: Skin Concerns · Skin Treatments · Hair Concerns · Hair
   Treatments · Technologies · Ingredients · Shared information.

   Every anchor id this page carried as /treatments is kept, so old deep links
   (/treatments#skin-treatments, #technologies …) arrive at the same section.
   ========================================================================== */
export const metadata: Metadata = {
  title: "Skin & Hair Concerns",
  description:
    "Skin and hair concerns at Regenerate Skin & Hair Clinic, Melbourne — rejuvenation, scarring, pigmentation, acne, hair thinning, scalp health and greying — with the treatments commonly considered for each.",
  alternates: { canonical: "/concerns" },
};

/* Small pill next to a section heading — keeps treatments and technologies
   from reading as the same commercial hierarchy (client requirement). */
function Kind({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[var(--radius-pill)] border border-border px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">
      {children}
    </span>
  );
}

const skinTreatments = treatments.filter((t) => t.group === "skin");
const scalpTreatments = treatments.filter((t) => t.group === "scalp");

export default function ConcernsPage() {
  return (
    <>
      <PageHero
        eyebrow="Concerns"
        title="Start with what you'd like to improve"
        lead="Explore common skin and hair concerns and the treatment options commonly considered at Regenerate. Your individual treatment plan is confirmed during consultation."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      {/* --- 1. SKIN CONCERNS -------------------------------------------------
          The combined "Skin & hair concerns" selector, split in two (client
          brief 28 Sep 2026). Skin is a 2 × 2 grid. The legacy #concerns anchor
          is kept here so any link to the old combined section still lands. */}
      <Section id="skin-concerns" tone="base" className="scroll-mt-28">
        <span id="concerns" aria-hidden className="block scroll-mt-28" />
        <ConcernSelector
          group="skin"
          eyebrow="Skin"
          title="Skin Concerns"
          lead="Choose what you'd like to work on and we'll show what it usually involves at Regenerate."
        />
      </Section>

      {/* --- 2. SKIN TREATMENTS (unchanged) --------------------------------- */}
      <Section id="skin-treatments" tone="base" space="spacious" className="scroll-mt-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader eyebrow="Skin" title="Skin Treatments" />
            <Kind>Bookable treatments</Kind>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:mt-14 lg:gap-8">
            {skinTreatments.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 3) * 70} className="h-full">
                <TreatmentIndexCard treatment={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- 3. HAIR CONCERNS ------------------------------------------------
          Three across. Shares the elevated tone with Hair Treatments below, so
          the hair half of the page reads as one block, as the skin half does. */}
      <Section id="hair-concerns" tone="elevated" className="scroll-mt-28">
        <ConcernSelector
          group="hair"
          eyebrow="Hair"
          title="Hair Concerns"
          lead="Choose what you'd like to work on and we'll show what it usually involves at Regenerate."
          onElevated
        />
      </Section>

      {/* --- 4. HAIR & SCALP TREATMENTS (unchanged) -------------------------- */}
      <Section id="hair-scalp-treatments" tone="elevated" space="spacious" className="scroll-mt-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader eyebrow="Hair" title="Hair Treatments" />
            <Kind>Bookable treatments</Kind>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:mt-14 lg:gap-8">
            {scalpTreatments.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 3) * 70} className="h-full">
                <TreatmentIndexCard treatment={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- C. SKIN AND SCALP TECHNOLOGIES ----------------------------------
          Showcased as real cards, comparable in prominence to the treatment
          cards above (client requirement) — not a row of pills. Clearly a
          different commercial tier: no booking CTA anywhere in this section. */}
      <Section id="technologies" tone="base" space="spacious" className="scroll-mt-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader
              eyebrow="Our capability"
              title="Skin and Scalp Technologies"
              lead={technologiesIntro}
             
            />
            <Kind>Applied within treatments</Kind>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14 lg:gap-8">
            {skinTechnologies.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 3) * 70} className="h-full">
                <TechnologyCard tech={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- D. ADVANCED COMPOUNDS & MEDICINAL COSMETICS ---------------------
          Reference only. Visually distinct: tinted ground, accordion rows,
          no cards, no CTA. */}
      <Section id="advanced-compounds" tone="sunken" space="spacious" className="scroll-mt-28">
        <Container size="narrow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader
              eyebrow="Ingredients"
              title="Advanced Compounds & Medicinal Cosmetics"
              lead={compoundsIntro}
             
            />
            <Kind>Reference · not bookable</Kind>
          </div>
          <div className="mt-12 flex flex-col gap-4 lg:mt-14">
            {compounds.map((c) => (
              <Accordion key={c.slug} title={c.name}>
                <p>{c.body}</p>
              </Accordion>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- E. SHARED TREATMENT / CLINIC INFORMATION ------------------------
          Written once here; individual treatment pages link back to this
          section rather than repeating consultation/scanning/aftercare text. */}
      <Section id="shared-information" tone="base" space="spacious" className="scroll-mt-28">
        <Container size="narrow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader eyebrow="Before you begin" title="Shared Treatment Information" />
            <Kind>Applies to every treatment</Kind>
          </div>
          <div className="mt-12 flex flex-col gap-4 lg:mt-14">
            {sharedInfo.map((s, i) => (
              <Accordion key={s.slug} title={s.name} defaultOpen={i === 0}>
                {s.list ? (
                  <ul className="flex flex-col gap-2">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{s.body}</p>
                )}
              </Accordion>
            ))}
          </div>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Not sure which treatment is right for you?"
            body="Book a consultation and we'll help match your skin or hair goals to the right pathway. See our pricing page for packages and individual treatments."
            secondary={{ label: "See Pricing", href: "/pricing" }}
          />
        </Container>
      </Section>
    </>
  );
}

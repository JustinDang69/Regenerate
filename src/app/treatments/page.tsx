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

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Skin and hair treatments at Regenerate Skin & Hair Clinic, Melbourne — facial and scalp microneedling, mesotherapy, HydraFacial, HydraScalp Therapy, and the skin and scalp technologies used within them.",
  alternates: { canonical: "/treatments" },
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

export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Skin and hair treatments, explained clearly"
        lead="Every treatment begins with a consultation and, where relevant, a professional skin or scalp scan. Below is what each treatment is, what it supports and what to expect."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      {/* --- A. SKIN TREATMENTS --------------------------------------------- */}
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

      {/* --- B. HAIR & SCALP TREATMENTS -------------------------------------- */}
      <Section id="hair-scalp-treatments" tone="elevated" space="spacious" className="scroll-mt-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader eyebrow="Hair & Scalp" title="Hair & Scalp Treatments" />
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
            body="Book a consultation and we'll help match your skin or hair goals to the right pathway. Pricing is confirmed in consultation — see indicative pricing on our packages page."
            secondary={{ label: "See Pricing", href: "/pricing" }}
          />
        </Container>
      </Section>
    </>
  );
}

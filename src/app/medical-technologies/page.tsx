/* =============================================================================
   MEDICAL TECHNOLOGIES — dedicated page for nav group 07 (client, 28 Sep 2026).
   -----------------------------------------------------------------------------
   An intentional duplicate of PRESENTATION only: the same TechnologyCard grid
   as the "Skin and Scalp Technologies" section of /concerns, reading the same
   `skinTechnologies` records. Each card's Learn More opens the existing
   /treatments/technologies/[slug] page. No technology data lives here.
   ========================================================================== */
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import CTABlock from "@/components/sections/CTABlock";
import Kind from "@/components/ui/Kind";
import TechnologyCard from "@/components/cards/TechnologyCard";
import { skinTechnologies } from "@/content/treatments";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medical Technologies",
  description:
    "The device-based technologies used across selected skin and scalp treatments at Regenerate Skin & Hair Clinic, Melbourne. Each is chosen according to the treatment area, goals and consultation.",
  alternates: { canonical: "/medical-technologies" },
};

export default function MedicalTechnologiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our capability"
        title="Medical Technologies"
        lead="Explore the device-based technologies used across selected skin and scalp treatments at Regenerate. Each technology is chosen according to the treatment area, goals and consultation."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      <Section id="technologies" tone="base" space="spacious" className="scroll-mt-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader
              eyebrow="Technologies"
              title="Medical Technologies"
              lead="Device-based technologies may be incorporated into selected treatments to support different skin and scalp protocols. The appropriate technology and settings are determined during consultation."
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

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Not sure which treatment is right for you?"
            body="Technologies are applied within treatments, never on their own. Book a consultation and we'll recommend the right pathway for your skin or scalp."
            secondary={{ label: "See Pricing", href: "/pricing" }}
          />
        </Container>
      </Section>
    </>
  );
}

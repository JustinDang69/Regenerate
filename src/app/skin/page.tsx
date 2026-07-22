import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ConcernSection from "@/components/sections/ConcernSection";
import TechBlock from "@/components/cards/TechBlock";
import CTABlock from "@/components/sections/CTABlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";

import { skinConcerns } from "@/content/concerns";
import { technologies } from "@/content/technologies";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skin Treatments",
  description:
    "Concern-led skin treatments in Melbourne — acne and congestion, scarring and texture, hydration and rejuvenation. Considered technology, confirmed in consultation.",
  alternates: { canonical: "/skin" },
};

// Technologies most relevant to skin pathways.
const skinTech = technologies.filter((t) =>
  ["hf", "rf", "led", "ultrasound", "actives"].includes(t.slug)
);

export default function SkinPage() {
  return (
    <>
      <PageHero
        eyebrow="Skin Treatments"
        title="Skin care that starts with your concern"
        lead="From everyday breakouts to texture, hydration and vitality — we explain the concern in plain language, the approach we may take, and what each pathway is designed to support."
        primary={{ label: cta.book, href: cta.bookHref }}
        secondary={{ label: cta.exploreHair, href: "/hair" }}
      />

      {/* Concern narratives */}
      <Section tone="base" innerClassName="!max-w-[var(--container-max)]">
        <Container>
          {skinConcerns.map((concern, i) => (
            <ConcernSection key={concern.slug} concern={concern} index={i} />
          ))}
        </Container>
      </Section>

      {/* Technology explained (inside the skin page, per IA) */}
      <Section tone="elevated" id="technology">
        <SectionHeader
          eyebrow="The science, explained"
          title="Technologies we may use"
          lead="Devices and actives are chosen to suit your concern — never applied by default. Here's what they are and what they're designed to support."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skinTech.map((tech, i) => (
            <Reveal key={tech.slug} delay={(i % 3) * 70}>
              <TechBlock tech={tech} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-[0.85rem] text-muted">
          {/* COMPLIANCE: careful, non-guaranteeing language. Confirm with clinical team. */}
          Most treatments run for approximately 45–90 minutes. Suitability and expected
          experience are confirmed in your consultation. Results vary by individual.
        </p>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Not sure where to start?"
            body="Book a consultation and we'll help match your skin goals to the right pathway."
          />
        </Container>
      </Section>
    </>
  );
}

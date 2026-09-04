import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ConcernSection from "@/components/sections/ConcernSection";
import TechnologyCard from "@/components/cards/TechnologyCard";
import CTABlock from "@/components/sections/CTABlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";

import { skinConcerns } from "@/content/concerns";
import { skinTechnologies } from "@/content/treatments";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skin Treatments",
  description:
    "Concern-led skin treatments in Melbourne — acne and congestion, scarring and texture, hydration and rejuvenation. Considered technology, confirmed in consultation.",
  alternates: { canonical: "/skin" },
};

/* All six approved technologies are shown. They are clinic capabilities rather
   than a per-page subset — which ones apply to a given plan is a consultation
   decision, so the page does not pre-filter them. */

export default function SkinPage() {
  return (
    <>
      <PageHero
        eyebrow="Skin Treatments"
        title="Skin care that starts with your concern"
        lead="From everyday breakouts to texture, hydration and vitality — we explain the concern in plain language, the approach we may take, and what each pathway is designed to support."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      {/* Concern narratives */}
      <Section tone="base" space="spacious" innerClassName="!max-w-[var(--container-max)]">
        <Container>
          {skinConcerns.map((concern, i) => (
            <ConcernSection key={concern.slug} concern={concern} index={i} />
          ))}
        </Container>
      </Section>

      {/* Skin and Scalp Technologies — the SAME TechnologyCard showcase used on
          /treatments and /hair, reading from the one approved technology set, so
          the three pages stay visually and factually consistent. */}
      <Section tone="elevated" space="spacious" id="technology">
        <SectionHeader
          eyebrow="Our capability"
          title="Skin and Scalp Technologies"
          lead="Our clinic technologies are capabilities, not add-ons. Which are used — and whether they are used at all — is selected in consultation according to your concern and suitability."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {skinTechnologies.map((tech, i) => (
            <Reveal key={tech.slug} delay={(i % 3) * 70} className="h-full">
              <TechnologyCard tech={tech} />
            </Reveal>
          ))}
        </div>
        <p className="mt-12 max-w-2xl text-[0.85rem] text-muted text-pretty">
          {/* COMPLIANCE: careful, non-guaranteeing language. Confirm with clinical team. */}
          Most treatments run for approximately 45–90 minutes. Suitability and expected
          experience are confirmed in your consultation. Results vary by individual.
        </p>
        <p className="mt-5 max-w-2xl text-[0.85rem] text-secondary text-pretty">
          For full treatment-by-treatment detail — how each works, what to expect and
          aftercare —{" "}
          <Link href="/treatments#skin-treatments" className="font-semibold text-accent-contrast underline underline-offset-2 hover:text-accent-hover">
            see our Skin Treatments guide
          </Link>
          .
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

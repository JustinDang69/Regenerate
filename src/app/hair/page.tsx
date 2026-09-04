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

import { hairConcerns } from "@/content/concerns";
import { skinTechnologies } from "@/content/treatments";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hair Treatments",
  description:
    "Consultation-led hair and scalp support in Melbourne — thinning support, scalp health, restorative recovery and considered grey-hair pathways.",
  alternates: { canonical: "/hair" },
};

/* All six approved technologies are shown — they are clinic capabilities, and
   which apply to a given hair or scalp plan is a consultation decision. */

export default function HairPage() {
  return (
    <>
      <PageHero
        eyebrow="Hair Treatments"
        title="Support for your hair and scalp, planned around you"
        lead="Noticing thinning, scalp discomfort or simply wanting to support hair vitality? We lead with consultation, then design a considered, restorative plan."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      <Section tone="base" space="spacious">
        <Container>
          {hairConcerns.map((concern, i) => (
            <ConcernSection key={concern.slug} concern={concern} index={i} />
          ))}
        </Container>
      </Section>

      {/* Skin and Scalp Technologies — identical showcase to /skin and
          /treatments, from the one approved technology set. */}
      <Section tone="elevated" space="spacious" id="technology">
        <SectionHeader
          eyebrow="Our capability"
          title="Skin and Scalp Technologies"
          lead="Our clinic technologies are capabilities, not add-ons. Which are used within a hair or scalp plan — and whether they are used at all — is selected in consultation according to your concern and suitability."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {skinTechnologies.map((tech, i) => (
            <Reveal key={tech.slug} delay={(i % 3) * 70} className="h-full">
              <TechnologyCard tech={tech} />
            </Reveal>
          ))}
        </div>
        <p className="mt-12 max-w-2xl text-[0.85rem] text-muted text-pretty">
          {/* COMPLIANCE: grey-hair and hair-growth claims to be clinically/legally confirmed. */}
          Recovery packages provide basic restorative support. Suitability, expected
          experience and any grey-hair pathways are confirmed in consultation. Results vary.
        </p>
        <p className="mt-5 max-w-2xl text-[0.85rem] text-secondary text-pretty">
          For full treatment-by-treatment detail — including HydraScalp —{" "}
          <Link href="/treatments#hair-scalp-treatments" className="font-semibold text-accent-contrast underline underline-offset-2 hover:text-accent-hover">
            see our Hair &amp; Scalp Treatments guide
          </Link>
          .
        </p>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Begin with a consultation"
            body="Every hair journey is individual. Let's talk through your goals and find a supportive starting point."
          />
        </Container>
      </Section>
    </>
  );
}

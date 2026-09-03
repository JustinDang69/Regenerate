import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ConcernSection from "@/components/sections/ConcernSection";
import TechBlock from "@/components/cards/TechBlock";
import CTABlock from "@/components/sections/CTABlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";

import { hairConcerns } from "@/content/concerns";
import { technologies } from "@/content/technologies";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hair Treatments",
  description:
    "Consultation-led hair and scalp support in Melbourne — thinning support, scalp health, restorative recovery and considered grey-hair pathways.",
  alternates: { canonical: "/hair" },
};

const hairTech = technologies.filter((t) =>
  ["essential-oils", "actives", "led", "ems"].includes(t.slug)
);

export default function HairPage() {
  return (
    <>
      <PageHero
        eyebrow="Hair Treatments"
        title="Support for your hair and scalp, planned around you"
        lead="Noticing thinning, scalp discomfort or simply wanting to support hair vitality? We lead with consultation, then design a considered, restorative plan."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      <Section tone="base">
        <Container>
          {hairConcerns.map((concern, i) => (
            <ConcernSection key={concern.slug} concern={concern} index={i} />
          ))}
        </Container>
      </Section>

      <Section tone="elevated" id="technology">
        <SectionHeader
          eyebrow="The science, explained"
          title="What supports our hair pathways"
          lead="From nourishing essential oils such as rosemary oil to targeted actives, each element is selected to suit your plan."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hairTech.map((tech, i) => (
            <Reveal key={tech.slug} delay={(i % 3) * 70}>
              <TechBlock tech={tech} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-[0.85rem] text-muted">
          {/* COMPLIANCE: grey-hair and hair-growth claims to be clinically/legally confirmed. */}
          Recovery packages provide basic restorative support. Suitability, expected
          experience and any grey-hair pathways are confirmed in consultation. Results vary.
        </p>
        <p className="mt-4 text-[0.85rem] text-secondary">
          For full treatment-by-treatment detail — including HydraScalp Therapy —{" "}
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

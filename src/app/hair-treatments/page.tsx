/* =============================================================================
   HAIR TREATMENTS — dedicated index for nav group 06 (client brief 28 Sep 2026).
   -----------------------------------------------------------------------------
   The same four treatment cards as the Hair Treatments section of /concerns,
   rendered by the same shared component from the same data. Each card links to
   its existing /treatments/[slug] page and books via the existing preselected
   CTA — nothing about treatment content or booking changes here.
   ========================================================================== */
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Divider from "@/components/brand/Divider";
import CTABlock from "@/components/sections/CTABlock";
import TreatmentGridSection from "@/components/sections/TreatmentGridSection";
import { hairTreatmentsIntro } from "@/content/treatments";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  /* Distinct from /hair, whose title is already "Hair Treatments". */
  title: "Hair Treatments — Scalp Treatment Guide",
  description:
    "Scalp and hair treatments at Regenerate Skin & Hair Clinic, Melbourne — Scalp Microneedling, Scalp Mesotherapy, MedicalSCALP and UltraSCALP. Your pathway is confirmed in consultation.",
  alternates: { canonical: "/hair-treatments" },
};

export default function HairTreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Hair Treatments"
        lead={hairTreatmentsIntro}
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      <TreatmentGridSection group="scalp" tone="base" />

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Not sure which treatment is right for you?"
            body="Book a consultation and we'll help match your hair and scalp goals to the right pathway."
            secondary={{ label: "Explore Hair Concerns", href: "/concerns#hair-concerns" }}
          />
        </Container>
      </Section>
    </>
  );
}

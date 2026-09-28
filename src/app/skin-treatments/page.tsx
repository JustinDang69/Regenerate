/* =============================================================================
   SKIN TREATMENTS — dedicated index for nav group 05 (client brief 28 Sep 2026).
   -----------------------------------------------------------------------------
   The same four treatment cards as the Skin Treatments section of /concerns,
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
import { skinTreatmentsIntro } from "@/content/treatments";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  /* Distinct from /skin, whose title is already "Skin Treatments". */
  title: "Skin Treatments — Facial Treatment Guide",
  description:
    "Facial treatments at Regenerate Skin & Hair Clinic, Melbourne — Facial Microneedling, Facial Mesotherapy, MedicalFACIAL and UltraFACIAL. Your pathway is confirmed in consultation.",
  alternates: { canonical: "/skin-treatments" },
};

export default function SkinTreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Skin Treatments"
        lead={skinTreatmentsIntro}
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      <TreatmentGridSection group="skin" tone="base" />

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title="Not sure which treatment is right for you?"
            body="Book a consultation and we'll help match your skin goals to the right pathway."
            secondary={{ label: "Explore Skin Concerns", href: "/concerns#skin-concerns" }}
          />
        </Container>
      </Section>
    </>
  );
}

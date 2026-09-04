/* =============================================================================
   HOME — strongest conversion + strategic summary page.
   Sections: Hero · Trust · Pathways (Skin/Hair/Packages) · Practitioners ·
   Location · Final enquiry CTA.
   -----------------------------------------------------------------------------
   CLIENT REVISION (round 1): the "Concerns We Support", "Featured Programs" and
   science-led editorial sections were removed from the homepage. The concern →
   technology → benefit narrative now lives solely on the dedicated Skin and Hair
   pages. "The Clinic Experience" moved to the About page.
   ========================================================================== */
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import HealthcareStatement from "@/components/sections/HealthcareStatement";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Divider from "@/components/brand/Divider";
import Reveal from "@/components/motion/Reveal";
import SplitEditorial from "@/components/sections/SplitEditorial";
import CTABlock from "@/components/sections/CTABlock";
import LocationBlock from "@/components/sections/LocationBlock";
import PathwayCard from "@/components/cards/PathwayCard";

import { cta } from "@/lib/site";

/* Top-level entry points. Data-driven so cards stay consistent and easy to edit.

   ROUTING (client-confirmed): the homepage treatment journey is BY SERVICE and
   points at /treatments, which carries the approved treatment presentation.
   The concern-led /skin and /hair pages are the BY CONCERN journey and stay
   reachable from the main navigation — they are not linked from here. */
const pathways = [
  {
    eyebrow: "Skin",
    title: "Skin Treatments",
    description:
      "Support for acne and congestion, scarring and texture, hydration and rejuvenation — with technology selected to suit each concern.",
    cta: { label: cta.exploreSkin, href: "/treatments#skin-treatments" },
    image: { label: "Skin treatment room" },
  },
  {
    eyebrow: "Hair",
    title: "Hair Treatments",
    description:
      "Consultation-led support for thinning, scalp health, restorative recovery and considered grey-hair pathways.",
    cta: { label: cta.exploreHair, href: "/treatments#hair-scalp-treatments" },
    image: { label: "Hair & scalp treatment" },
  },
  {
    eyebrow: "Packages",
    title: "Treatment Packages",
    description:
      "Multi-session programs designed around a specific concern, alongside individual treatments. Pricing is indicative and confirmed in consultation.",
    cta: { label: "View All Pricing", href: "/pricing" },
    highlights: ["Skin packages", "Hair packages", "Single treatments"],
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />

      {/* --- Healthcare positioning ------------------------------------------
          ROUND 3: the client's supplied statement, verbatim. Placed after the
          hero and trust strip and before the treatment pathways, so a visitor
          meets the clinic, then its position, then the treatments. */}
      <HealthcareStatement />

      {/* --- Skin · Hair · Packages pathways -------------------------------- */}
      <Section id="pathways" tone="base">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 80} className="h-full">
              <PathwayCard {...p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- Practitioners preview ------------------------------------------ */}
      <Section tone="elevated">
        <SplitEditorial
          title="Care led by qualified hands"
          image={{ label: "Practitioner portrait", mask: "arch", ratio: "portrait" }}
          imageCaption={
            /* TODO(client): replace with the practitioner's real name and role.
               Names, portraits, qualifications and AHPRA registration are still
               pending — the structure below is ready for the confirmed details. */
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[1.25rem] text-primary">
                Practitioner name to be confirmed
              </span>
              <span className="text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-accent-contrast">
                Dermal Therapist
              </span>
            </div>
          }
          cta={{ label: "Meet the team", href: "/about#practitioners" }}
        >
          <p>
            Our team brings a dermal specialist focus and a calm, methodical approach
            to every consultation and treatment.
          </p>
        </SplitEditorial>
      </Section>

      {/* --- Location & access ---------------------------------------------- */}
      <Section id="location" tone="base">
        <LocationBlock />
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Final CTA (enquiry only — booking lives in the header/hero/cards) */}
      <Section tone="base">
        <Container>
          <CTABlock
            eyebrow="Have a question first?"
            title="Talk to the Regenerate team"
            body="Tell us about your skin or hair goals and we'll help you find the right pathway — with care, clarity and no pressure."
            primary={{ label: cta.enquire, href: cta.enquireHref }}
            secondary={null}
          />
        </Container>
      </Section>
    </>
  );
}

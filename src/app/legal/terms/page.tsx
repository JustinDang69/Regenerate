import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Regenerate Skin & Hair Clinic website.",
  alternates: { canonical: "/legal/terms" },
  robots: { index: false, follow: true },
};

/* PLACEHOLDER — TODO(client/legal): replace with reviewed Terms of Use. */
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms" lead="Last updated: pending. Placeholder content for legal review." />
      <Section tone="base">
        <Prose>
          <p>
            <strong>Draft placeholder.</strong> These Terms require professional review
            before launch.
          </p>
          <h2>Use of this website</h2>
          <p>To be completed.</p>
          <h2>Information is general in nature</h2>
          <p>
            Content on this website is general information only and not a substitute for
            professional medical advice. Treatment suitability and outcomes are individual
            and confirmed in consultation. Results vary.
          </p>
        </Prose>
      </Section>
    </>
  );
}

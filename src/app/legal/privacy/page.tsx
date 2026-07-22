import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Regenerate Skin & Hair Clinic collects, uses and protects your information.",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: false, follow: true },
};

/* PLACEHOLDER — TODO(client/legal): replace with a lawyer-reviewed Privacy Policy
   compliant with the Australian Privacy Principles (Privacy Act 1988). */
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead="Last updated: pending. This is placeholder content for legal review." />
      <Section tone="base">
        <Prose>
          <p>
            <strong>Draft placeholder.</strong> This page requires a professionally
            reviewed Privacy Policy before launch, compliant with the Australian Privacy
            Principles under the Privacy Act 1988 (Cth).
          </p>
          <h2>Information we collect</h2>
          <p>To be completed — enquiry details, booking information, and health information handled in clinic.</p>
          <h2>How we use your information</h2>
          <p>To be completed — responding to enquiries, arranging consultations, and clinic administration.</p>
          <h2>Contact</h2>
          <p>Questions about privacy can be directed to the clinic via the details on our contact page.</p>
        </Prose>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Appointment cancellation and rescheduling policy for Regenerate Skin & Hair Clinic.",
  alternates: { canonical: "/legal/cancellation" },
  robots: { index: false, follow: true },
};

/* PLACEHOLDER — TODO(client): confirm cancellation window, deposit and rescheduling terms. */
export default function CancellationPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cancellation Policy" lead="Last updated: pending. Placeholder content for clinic confirmation." />
      <Section tone="base">
        <Prose>
          <p>
            <strong>Draft placeholder.</strong> Please confirm the clinic&apos;s exact
            cancellation window, deposit requirements and rescheduling terms.
          </p>
          <h2>Cancellations &amp; rescheduling</h2>
          <ul>
            <li>Notice period required to cancel or reschedule: <strong>to be confirmed</strong>.</li>
            <li>Deposit / booking fee terms: <strong>to be confirmed</strong>.</li>
            <li>Late arrivals and missed appointments: <strong>to be confirmed</strong>.</li>
          </ul>
        </Prose>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/forms/ContactForm";
import LocationBlock from "@/components/sections/LocationBlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import { site, cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Book",
  description:
    "Book a consultation or send an enquiry to Regenerate Skin & Hair Clinic in Pascoe Vale South. Address, hours, parking and transport details.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Book"
        title="Let's begin your consultation"
        lead="Booking is the best first step — we'll talk through your skin or hair goals and recommend a considered pathway. Prefer to ask first? Send an enquiry below."
        primary={{ label: cta.book, href: "#book" }}
        secondary={{ label: cta.enquire, href: "#enquire" }}
      />

      {/* --- Enquiry / Book ------------------------------------------------- */}
      <Section id="enquire" tone="base" className="scroll-mt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Booking column */}
            <Reveal id="book" className="scroll-mt-28 flex flex-col gap-6">
              <span className="eyebrow">Book a consultation</span>
              <h2 className="text-h2">Ready when you are</h2>
              <p className="text-secondary text-pretty">
                Consultations are the heart of how we work — an unhurried conversation to
                understand your goals before any treatment is recommended.
              </p>

              <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-elevated p-6">
                <div>
                  <span className="eyebrow text-muted">Call the clinic</span>
                  {/* TODO(client): confirm public phone number */}
                  <a href={`tel:${site.contact.phone}`} className="mt-1 block font-serif text-[1.4rem] text-accent-contrast">
                    {site.contact.phoneDisplay}
                  </a>
                </div>
                <div>
                  <span className="eyebrow text-muted">Email us</span>
                  <a href={`mailto:${site.contact.email}`} className="mt-1 block text-secondary hover:text-accent-contrast">
                    {site.contact.email}
                  </a>
                </div>
                <div>
                  <span className="eyebrow text-muted">Opening hours</span>
                  <div className="mt-1 text-secondary text-[0.92rem]">
                    {site.hours.map((h) => (
                      <div key={h.days}>{h.days}: {h.time}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TODO(client/dev): embed real online-booking platform here when available. */}
              <p className="text-[0.8rem] text-muted">
                Online booking integration can be added here in a future phase.
              </p>
            </Reveal>

            {/* Enquiry form column */}
            <Reveal delay={100} className="rounded-[var(--radius-xl)] border border-border bg-surface p-7 shadow-[var(--shadow-sm)] sm:p-10">
              <span className="eyebrow">Send an enquiry</span>
              <h2 className="mt-2 text-h3 text-[1.6rem]">Tell us how we can help</h2>
              <p className="mb-6 mt-2 text-[0.9rem] text-secondary">
                We&apos;ll reply to arrange your consultation or answer any questions.
              </p>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Location & how to find us ------------------------------------- */}
      <Section id="location" tone="base">
        <LocationBlock />
      </Section>
    </>
  );
}

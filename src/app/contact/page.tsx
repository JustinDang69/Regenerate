import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import BookingForm from "@/components/forms/BookingForm";
import ContactForm from "@/components/forms/ContactForm";
import LocationBlock from "@/components/sections/LocationBlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import { site, cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Book",
  description:
    "Book an appointment online with Regenerate Skin & Hair Clinic in Pascoe Vale South, or send an enquiry. Address, hours, parking and transport details.",
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

      {/* --- Book an appointment -------------------------------------------
          The booking form talks to our own API routes, which talk to
          Microsoft Bookings. Customers stay on the Regenerate website
          throughout — no Microsoft UI, no redirect.

          BookingForm reads `?service=` (a website treatment slug) to
          preselect the treatment, so it needs a Suspense boundary for
          useSearchParams under static rendering. */}
      <Section id="book" tone="base" className="scroll-mt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal className="min-w-0 flex flex-col gap-6">
              <span className="eyebrow">Book an appointment</span>
              <h2 className="text-h2">Ready when you are</h2>
              <p className="text-secondary text-pretty">
                Choose your treatment and a time that suits you. Every appointment is a
                considered, unhurried 50 minutes — including your consultation, so we
                understand your goals before anything begins.
              </p>

              <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-elevated p-6">
                <div>
                  <span className="eyebrow text-muted">Call the clinic</span>
                  <a href={`tel:${site.contact.phone}`} className="mt-1 block font-serif text-[1.4rem] text-accent-contrast">
                    {site.contact.phoneDisplay}
                  </a>
                </div>
                <div>
                  <span className="eyebrow text-muted">Email us</span>
                  <a href={`mailto:${site.contact.email}`} className="mt-1 block break-all text-secondary hover:text-accent-contrast">
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

              <p className="text-[0.8rem] text-muted">
                Need to change or cancel an appointment? Call the clinic and we&apos;ll
                rearrange it with you.
              </p>
            </Reveal>

            <Reveal delay={100} className="rounded-[var(--radius-xl)] border border-border bg-surface p-7 shadow-[var(--shadow-sm)] sm:p-10">
              <span className="eyebrow">Book appointment</span>
              <h2 className="mt-2 text-h3 text-[1.6rem]">Choose your treatment and time</h2>
              <p className="mb-6 mt-2 text-[0.9rem] text-secondary">
                Times shown are live from our clinic diary, in Melbourne time.
              </p>
              <Suspense
                fallback={
                  <div className="py-10 text-center text-[0.9rem] text-muted" aria-live="polite">
                    Loading the booking calendar…
                  </div>
                }
              >
                <BookingForm />
              </Suspense>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Enquiry --------------------------------------------------------
          Kept as its own flow (POST /api/enquiry): visitors who want to ask
          a question before committing to a time still have somewhere to go. */}
      <Section id="enquire" tone="elevated" className="scroll-mt-28">
        <Container>
          <div className="mx-auto max-w-[44rem]">
            <Reveal className="rounded-[var(--radius-xl)] border border-border bg-surface p-7 shadow-[var(--shadow-sm)] sm:p-10">
              <span className="eyebrow">Send an enquiry</span>
              <h2 className="mt-2 text-h3 text-[1.6rem]">Prefer to ask us first?</h2>
              <p className="mb-6 mt-2 text-[0.9rem] text-secondary">
                Not sure which treatment is right for you? Send us a note and we&apos;ll
                reply to help you decide.
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

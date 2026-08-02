import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import PackageCard from "@/components/cards/PackageCard";
import TreatmentCard from "@/components/cards/TreatmentCard";
import PricingNav from "@/components/sections/PricingNav";
import CTABlock from "@/components/sections/CTABlock";
import Motif from "@/components/brand/Motif";

import { skinPackages, hairPackages, singleTreatments } from "@/content/packages";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Packages & Single Treatments",
  description:
    "Transparent, elegant pricing for Regenerate skin and hair programs. Multi-session packages and individual treatments. Indicative pricing, confirmed in consultation.",
  alternates: { canonical: "/pricing" },
};

function GroupHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-8 flex items-center gap-4">
      <Motif className="h-6 w-6 text-accent/60" />
      <div>
        <span className="eyebrow text-muted">{eyebrow}</span>
        <h3 className="text-h3">{title}</h3>
      </div>
    </Reveal>
  );
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear pricing, considered programs"
        lead="Choose a multi-session package designed around a concern, or an individual treatment. Pricing is indicative and all suitability is confirmed in consultation."
        primary={{ label: cta.book, href: cta.bookHref }}
        secondary={{ label: cta.enquire, href: cta.enquireHref }}
      />

      <Container>
        <PricingNav />
      </Container>

      {/* --- PACKAGES ------------------------------------------------------- */}
      <Section id="packages" tone="base" className="scroll-mt-28">
        <Container>
          <GroupHeading eyebrow="Multi-session · Skin" title="Skin Packages" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skinPackages.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <PackageCard pkg={p} featured={p.featured} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <GroupHeading eyebrow="Multi-session · Hair" title="Hair Packages" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hairPackages.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 70}>
                  <PackageCard pkg={p} featured={p.featured} />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* --- SINGLE TREATMENTS --------------------------------------------- */}
      <Section id="single" tone="elevated" className="scroll-mt-28">
        <Container>
          <GroupHeading eyebrow="Individual sessions" title="Single Treatments" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {singleTreatments.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 3) * 60}>
                <TreatmentCard treatment={t} />
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-[0.82rem] text-muted">
            {/* COMPLIANCE / TODO(client): confirm GST display, durations, and any package
                terms & conditions. Prices indicative and subject to change. */}
            All prices are in AUD and indicative only. Treatment durations are approximate
            and confirmed at booking. Package suitability is determined in consultation.
          </p>
        </Container>
      </Section>

      <Section tone="base">
        <Container>
          <CTABlock
            title="Questions about a package?"
            body="We're happy to talk you through inclusions and help you choose. Book a consultation or send an enquiry."
          />
        </Container>
      </Section>
    </>
  );
}

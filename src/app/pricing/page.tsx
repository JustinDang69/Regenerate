import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import PackageCard from "@/components/cards/PackageCard";
import TreatmentCard from "@/components/cards/TreatmentCard";
import PricingNav from "@/components/sections/PricingNav";
import CTABlock from "@/components/sections/CTABlock";

import { skinPackages, hairPackages, singleTreatments } from "@/content/packages";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Packages & Single Treatments",
  description:
    "Pricing for Regenerate skin and hair programs in Melbourne — multi-session packages and individual treatments. All prices in AUD; suitability confirmed in consultation.",
  alternates: { canonical: "/pricing" },
};

function GroupHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-8 flex items-center gap-4">
      {/* ROUND 3: the small emblem was removed — it is illegible at this size,
          and a lone dandelion is no longer used. A short olive rule marks the group. */}
      <span aria-hidden className="h-px w-10 shrink-0 bg-accent/60" />
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
        lead="Choose a multi-session package designed around a concern, or an individual treatment. All prices are in AUD. Treatment suitability is confirmed in consultation."
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
          {/* The client's eight-item menu, in their two groups. Names are the
              client's concise price-menu names; each card links to the fuller
              Treatment Guide page rather than duplicating clinical copy. */}
          <GroupHeading eyebrow="Single sessions · Skin" title="Skin Treatments" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {singleTreatments.filter((t) => t.category === "skin").map((t, i) => (
              <Reveal key={t.slug} delay={(i % 4) * 60}>
                <TreatmentCard treatment={t} />
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <GroupHeading eyebrow="Single sessions · Hair" title="Hair Treatments" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {singleTreatments.filter((t) => t.category === "hair").map((t, i) => (
                <Reveal key={t.slug} delay={(i % 4) * 60}>
                  <TreatmentCard treatment={t} />
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-10 text-[0.82rem] text-muted">
            {/* Prices are the client-confirmed menu of 16 Sep 2026. GST status, package
                expiry, transferability and refund terms have not been supplied and are
                deliberately not stated. */}
            All prices are in AUD. Treatment suitability is confirmed in consultation.
          </p>
          <p className="mt-3 text-[0.82rem] text-secondary">
            For what each treatment involves —{" "}
            <Link href="/treatments" className="font-semibold text-accent-contrast underline underline-offset-2 hover:text-accent-hover">
              see the full Treatments guide
            </Link>
            .
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

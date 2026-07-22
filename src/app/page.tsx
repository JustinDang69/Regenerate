/* =============================================================================
   HOME — strongest conversion + strategic summary page.
   Sections: Hero · Trust · Pathways · Concerns · Featured Programs · Science ·
   Practitioners · Clinic Experience · Location · Final CTA.
   ========================================================================== */
import Link from "next/link";

import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Divider from "@/components/brand/Divider";
import Reveal from "@/components/motion/Reveal";
import SplitEditorial from "@/components/sections/SplitEditorial";
import CTABlock from "@/components/sections/CTABlock";
import LocationBlock from "@/components/sections/LocationBlock";
import Button from "@/components/ui/Button";

import ConcernCard from "@/components/cards/ConcernCard";
import PackageCard from "@/components/cards/PackageCard";
import ImageFrame from "@/components/ui/ImageFrame";

import { featuredConcerns } from "@/content/concerns";
import { featuredPackages } from "@/content/packages";
import { scienceIntro } from "@/content/technologies";
import { cta } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />

      {/* --- Skin & Hair pathways ------------------------------------------- */}
      <Section id="pathways" tone="base">
        <SectionHeader
          eyebrow="Two pathways, one philosophy"
          title="Concern-led care for skin and hair"
          lead="Whether you're navigating a skin concern or supporting your hair and scalp, we begin with you — your goals, your history, your comfort — then design a considered pathway together."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-[var(--shadow-xs)] transition-all duration-[var(--dur-base)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] md:p-10">
            <span className="eyebrow text-muted">Skin</span>
            <h3 className="mt-3 text-h3 text-[1.7rem]">Skin Treatments</h3>
            <p className="mt-3 max-w-md text-secondary">
              Support for acne and congestion, scarring and texture, hydration and
              rejuvenation — with technology selected to suit each concern.
            </p>
            <div className="mt-8"><ImageFrame ratio="landscape" mask="soft" placeholderLabel="Skin treatment room" /></div>
            <Button href="/skin" variant="secondary" className="mt-8">{cta.exploreSkin}</Button>
          </Reveal>

          <Reveal delay={100} className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-[var(--shadow-xs)] transition-all duration-[var(--dur-base)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] md:p-10">
            <span className="eyebrow text-muted">Hair</span>
            <h3 className="mt-3 text-h3 text-[1.7rem]">Hair Treatments</h3>
            <p className="mt-3 max-w-md text-secondary">
              Consultation-led support for thinning, scalp health, restorative
              recovery and considered grey-hair pathways.
            </p>
            <div className="mt-8"><ImageFrame ratio="landscape" mask="soft" placeholderLabel="Hair & scalp treatment" /></div>
            <Button href="/hair" variant="secondary" className="mt-8">{cta.exploreHair}</Button>
          </Reveal>
        </div>
      </Section>

      {/* --- Concerns overview ---------------------------------------------- */}
      <Section id="concerns" tone="elevated">
        <SectionHeader
          eyebrow="Concerns we support"
          title="Start with what matters to you"
          lead="Most people arrive with a concern, not a device in mind. Explore a starting point below — each opens a pathway explained in plain language."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredConcerns.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 80}>
              <ConcernCard concern={c} index={i} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- Featured programs ---------------------------------------------- */}
      <Section id="programs" tone="base">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Featured programs"
            title="Signature treatment packages"
            lead="Multi-session programs designed around specific concerns. Pricing is indicative; suitability is always confirmed in consultation."
          />
          <Reveal delay={120}>
            <Button href="/pricing" variant="ghost">View all pricing</Button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredPackages.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 70}>
              <PackageCard pkg={p} featured={p.featured} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- Science-led approach ------------------------------------------- */}
      <Section tone="elevated">
        <SplitEditorial
          eyebrow={scienceIntro.eyebrow}
          title={scienceIntro.title}
          image={{ label: "Technology & treatment detail", mask: "soft", ratio: "landscape" }}
          reverse
          cta={{ label: "See how it works on Skin", href: "/skin#rejuvenation", variant: "secondary" }}
          secondaryCta={{ label: cta.exploreHair, href: "/hair" }}
        >
          <p>{scienceIntro.body}</p>
          <p className="text-[0.9rem] text-muted">{scienceIntro.durationNote}</p>
        </SplitEditorial>
      </Section>

      {/* --- Practitioners preview ------------------------------------------ */}
      <Section tone="base">
        <SplitEditorial
          eyebrow="Meet the practitioners"
          title="Care led by qualified hands"
          image={{ label: "Practitioner portrait", mask: "arch", ratio: "portrait" }}
          cta={{ label: "Meet the team", href: "/about#practitioners" }}
        >
          <p>
            You should always know who is treating you and why they&apos;re credible.
            Our team brings a dermal specialist focus and a calm, methodical approach
            to every consultation.
          </p>
          <p className="text-[0.9rem] text-muted">
            {/* TODO(client): replace with real practitioner names, qualifications, AHPRA registration. */}
            One dermal therapist and two dermal specialists. Full profiles coming soon.
          </p>
        </SplitEditorial>
      </Section>

      {/* --- Clinic experience / space -------------------------------------- */}
      <Section tone="elevated">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="The clinic experience"
            title="A calm, considered space"
            lead="Regenerate is designed to feel unhurried — a place to be looked after with modern, effective care."
            className="mx-auto"
          />
        </Container>
        <Container size="wide" className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="lg:row-span-2"><ImageFrame ratio="tall" placeholderLabel="Clinic reception" /></Reveal>
            <Reveal delay={80}><ImageFrame ratio="landscape" placeholderLabel="Treatment room" /></Reveal>
            <Reveal delay={160}><ImageFrame ratio="landscape" placeholderLabel="Space detail" /></Reveal>
            <Reveal delay={120}><ImageFrame ratio="landscape" placeholderLabel="Product & tools" /></Reveal>
            <Reveal delay={200}><ImageFrame ratio="landscape" placeholderLabel="Waiting lounge" /></Reveal>
          </div>
        </Container>
      </Section>

      {/* --- Location & access ---------------------------------------------- */}
      <Section id="location" tone="base">
        <LocationBlock />
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Final CTA ------------------------------------------------------- */}
      <Section tone="base">
        <Container>
          <CTABlock
            eyebrow="Begin your journey"
            title="Book a consultation with Regenerate"
            body="Tell us about your skin or hair goals and we'll help you find the right pathway — with care, clarity and no pressure."
          />
          <p className="mt-6 text-center text-[0.85rem] text-muted">
            Prefer to ask a question first?{" "}
            <Link href={cta.enquireHref} className="underline underline-offset-2 hover:text-accent-contrast">
              Send an enquiry
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}

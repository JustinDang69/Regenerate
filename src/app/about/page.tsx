import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import SplitEditorial from "@/components/sections/SplitEditorial";
import PractitionerCard from "@/components/cards/PractitionerCard";
import CTABlock from "@/components/sections/CTABlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import DandelionMark from "@/components/brand/DandelionMark";

import { practitioners } from "@/content/practitioners";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Clinic & Practitioners",
  description:
    "The story behind Regenerate — our philosophy, the meaning of the dandelion, and the qualified practitioners who care for you.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Restore", body: "We're here to help restore and revive — never to make anyone feel less than they are." },
  { title: "Consider", body: "Every plan is individual, considered, and confirmed with you in consultation." },
  { title: "Care", body: "Modern, effective care delivered with warmth, patience and clinical respect." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Regenerate"
        title="Restoring and reviving, with calm confidence"
        lead="Regenerate was founded on a simple idea: that effective, science-led care should also feel gentle, personal and unhurried."
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      {/* --- About the Clinic ---------------------------------------------- */}
      <Section id="clinic" tone="base" className="scroll-mt-28">
        <SplitEditorial
          eyebrow="Our story"
          title="Why we exist"
          image={{ label: "Clinic space", mask: "arch", ratio: "portrait" }}
        >
          <p>
            The name <em>Regenerate</em> speaks to renewal — restoring and reviving natural
            beauty and confidence. It reflects how we see our work: supporting your skin and
            hair with modern, effective technology, guided by qualified hands.
          </p>
          <p>
            We built Regenerate for people with real concerns who want to feel genuinely cared
            for. Not rushed. Not sold to. Looked after — with clarity about what we do, why, and
            what it&apos;s designed to support.
          </p>
          {/* TODO(client): expand founder / origin story once provided. */}
        </SplitEditorial>
      </Section>

      {/* --- The dandelion meaning ----------------------------------------- */}
      <Section tone="elevated">
        <Container size="narrow" className="text-center">
          <Reveal className="mx-auto flex flex-col items-center gap-6">
            <DandelionMark className="h-16 w-16 text-accent/70" strokeWidth={0.9} />
            <span className="eyebrow">Our motif</span>
            <h2 className="text-h2 text-balance">The meaning of the dandelion</h2>
            <p className="text-lead text-secondary text-pretty">
              A dandelion releases its seeds to begin again elsewhere — a quiet emblem of
              regeneration, resilience and renewal. It carries the idea that beauty, like
              nature, can be restored and can flourish anew. You&apos;ll find it woven gently
              throughout the clinic and this website.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* --- Values -------------------------------------------------------- */}
      <Section tone="base">
        <SectionHeader
          eyebrow="Our philosophy"
          title="What guides our care"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80} className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
              <h3 className="font-serif text-[1.5rem] text-accent-contrast">{v.title}</h3>
              <p className="mt-3 text-secondary text-[0.92rem]">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Practitioners ------------------------------------------------- */}
      <Section id="practitioners" tone="base" className="scroll-mt-28">
        <SectionHeader
          eyebrow="The team"
          title="Meet the practitioners"
          lead="You should always know who is treating you. Full profiles — including qualifications and registration details — are being finalised."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <PractitionerCard p={p} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-[0.82rem] text-muted">
          {/* TODO(client): provide names, portraits, qualifications, AHPRA registration,
              languages, specialties. The card structure already supports each field. */}
          Practitioner details are placeholders pending confirmation from the clinic.
        </p>
      </Section>

      <Section tone="elevated">
        <Container>
          <CTABlock
            title="We'd love to care for you"
            body="Book a consultation and experience the Regenerate approach for yourself."
          />
        </Container>
      </Section>
    </>
  );
}

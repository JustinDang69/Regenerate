import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";
import CTABlock from "@/components/sections/CTABlock";
import ProcessSteps from "@/components/treatments/ProcessSteps";
import { treatments, treatmentBySlug } from "@/content/treatments";
import { cta } from "@/lib/site";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  props: PageProps<"/treatments/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const treatment = treatmentBySlug(slug);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description: treatment.summary,
    alternates: { canonical: `/treatments/${treatment.slug}` },
  };
}

function ExpectationBlock({ title, body }: { title: string; body: string }) {
  return (
    <article>
      <h3 className="text-h3 text-[1.25rem]">{title}</h3>
      {body.split("\n\n").map((para, i) => (
        <p key={i} className="mt-4 max-w-prose text-secondary text-pretty">
          {para}
        </p>
      ))}
    </article>
  );
}

export default async function TreatmentDetailPage(
  props: PageProps<"/treatments/[slug]">
) {
  const { slug } = await props.params;
  const treatment = treatmentBySlug(slug);
  if (!treatment) notFound();

  const groupLabel = treatment.group === "skin" ? "Skin" : "Hair & Scalp";
  /* Signature treatments carry the designation in the eyebrow, alongside their
     normal group label — they remain part of that group, not a separate tier. */
  const eyebrow = treatment.signature
    ? `${groupLabel} treatment · Signature Treatment`
    : `${groupLabel} treatment`;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={treatment.name}
        lead={treatment.overview}
        primary={{ label: cta.book, href: cta.bookHref }}
        secondary={{ label: "Back to Treatments", href: "/treatments" }}
      />

      {/* How it works / process */}
      <Section tone="base" space="spacious">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title={treatment.process ? "How the treatment works" : "The treatment"}
          />
          <div className="mt-12 lg:mt-16">
            {treatment.process ? (
              <ProcessSteps process={treatment.process} />
            ) : (
              <p className="max-w-2xl text-secondary text-pretty">{treatment.howItWorks}</p>
            )}
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section tone="elevated" space="spacious">
        <Container>
          <SectionHeader eyebrow="Benefits" title="What it's designed to support" />
          <ul className="mt-12 grid gap-x-12 gap-y-4 sm:grid-cols-2 lg:mt-14">
            {treatment.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 border-t border-border pt-3 text-[0.95rem] text-secondary">
                <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                  <path d="M3 8.5l3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Before / During / After */}
      <Section tone="base" space="spacious">
        <Container>
          <SectionHeader eyebrow="Your appointment" title="What to expect" />
          <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-12">
            {/* Client wording: "Pre-Treatment" rather than "Before". Set here in
                the shared template so every treatment inherits it. */}
            <ExpectationBlock title="Pre-Treatment" body={treatment.preProcedure} />
            <ExpectationBlock title="During" body={treatment.during} />
            <ExpectationBlock title="After" body={treatment.postProcedure} />
          </div>
        </Container>
      </Section>

      {/* Aftercare + recommendation */}
      <Section tone="elevated" space="spacious">
        <Container size="narrow">
          <SectionHeader eyebrow="Aftercare" title="Looking after yourself afterwards" />
          <Reveal className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface p-7 sm:p-9 lg:mt-14">
            <ul className="flex flex-col gap-3">
              {treatment.aftercare.map((item) => (
                <li key={item} className="border-t border-border pt-3 text-secondary first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-7 sm:p-9">
            <span className="eyebrow text-muted">Recommended schedule</span>
            <p className="mt-3 text-secondary">{treatment.recommendation}</p>
          </Reveal>
          <p className="mt-8 text-[0.85rem] text-muted">
            Consultation, scanning and general aftercare principles that apply to every
            treatment are covered once in{" "}
            <Link href="/treatments#shared-information" className="underline underline-offset-2 hover:text-accent-contrast">
              Shared Treatment Information
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base" space="spacious">
        <Container>
          <CTABlock
            title={`Is ${treatment.name} right for you?`}
            body="Treatment suitability, expected experience and an individual plan are confirmed during consultation. Results vary."
            primary={{ label: cta.book, href: cta.bookHref }}
            secondary={{ label: "See Pricing", href: "/pricing" }}
          />
        </Container>
      </Section>
    </>
  );
}

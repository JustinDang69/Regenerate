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
        <p key={i} className="mt-3 text-secondary">
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

  return (
    <>
      <PageHero
        eyebrow={`${groupLabel} treatment`}
        title={treatment.name}
        lead={treatment.overview}
        primary={{ label: cta.book, href: cta.bookHref }}
        secondary={{ label: "Back to Treatments", href: "/treatments" }}
      />

      {/* How it works / process */}
      <Section tone="base">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title={treatment.process ? "How the treatment works" : "The treatment"}
          />
          <div className="mt-10">
            {treatment.process ? (
              <ProcessSteps process={treatment.process} />
            ) : (
              <p className="max-w-3xl text-secondary text-pretty">{treatment.howItWorks}</p>
            )}
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section tone="elevated">
        <Container>
          <SectionHeader eyebrow="Benefits" title="What it's designed to support" />
          <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
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
      <Section tone="base">
        <Container>
          <SectionHeader eyebrow="Your appointment" title="What to expect" />
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <ExpectationBlock title="Before" body={treatment.preProcedure} />
            <ExpectationBlock title="During" body={treatment.during} />
            <ExpectationBlock title="After" body={treatment.postProcedure} />
          </div>
        </Container>
      </Section>

      {/* Aftercare + recommendation */}
      <Section tone="elevated">
        <Container>
          <SectionHeader eyebrow="Aftercare" title="Looking after yourself afterwards" />
          <Reveal className="mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-7 sm:p-8">
            <ul className="flex flex-col gap-3">
              {treatment.aftercare.map((item) => (
                <li key={item} className="border-t border-border pt-3 text-secondary first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="mt-6 rounded-[var(--radius-lg)] border border-border bg-surface p-7 sm:p-8">
            <span className="eyebrow text-muted">Recommended schedule</span>
            <p className="mt-3 text-secondary">{treatment.recommendation}</p>
          </Reveal>
          <p className="mt-6 text-[0.85rem] text-muted">
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

      <Section tone="base">
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

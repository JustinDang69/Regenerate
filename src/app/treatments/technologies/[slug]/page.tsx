import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Accordion from "@/components/ui/Accordion";
import Divider from "@/components/brand/Divider";
import CTABlock from "@/components/sections/CTABlock";
import LedLightSelector from "@/components/treatments/LedLightSelector";
import WavelengthTable from "@/components/treatments/WavelengthTable";
import { skinTechnologies, technologyBySlug } from "@/content/treatments";
import { cta } from "@/lib/site";

export function generateStaticParams() {
  return skinTechnologies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  props: PageProps<"/treatments/technologies/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const tech = technologyBySlug(slug);
  if (!tech) return {};
  return {
    title: tech.name,
    description: tech.overview,
    alternates: { canonical: `/treatments/technologies/${tech.slug}` },
  };
}

export default async function TechnologyDetailPage(
  props: PageProps<"/treatments/technologies/[slug]">
) {
  const { slug } = await props.params;
  const tech = technologyBySlug(slug);
  if (!tech) notFound();

  const isLed = !!tech.lights && !!tech.wavelengths;

  return (
    <>
      <PageHero
        eyebrow="Skin and Scalp Technology · applied within treatments"
        title={tech.name}
        lead={tech.overview}
        primary={{ label: "See Treatments", href: "/treatments#skin-treatments" }}
      />

      <Section tone="base" space="spacious">
        <Container>
          {/* SHORT information — direct panels. */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-7 sm:p-8">
              <span className="eyebrow text-muted">Best suited for</span>
              <ul className="mt-4 flex flex-col gap-2.5">
                {tech.bestFor.map((item) => (
                  <li key={item} className="text-[0.94rem] text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-7 sm:p-8">
              <span className="eyebrow text-muted">Treatment benefits</span>
              <ul className="mt-4 flex flex-col gap-2.5">
                {tech.benefits.map((item) => (
                  <li key={item} className="text-[0.94rem] text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LED: selectable light colours, swapped in place. */}
          {isLed && tech.lights && tech.wavelengths && (
            <div className="mt-16 lg:mt-20">
              <SectionHeader eyebrow="Choose the light" title="Five wavelengths, five purposes" />
              <div className="mt-10">
                <LedLightSelector lights={tech.lights} wavelengths={tech.wavelengths} />
              </div>
            </div>
          )}

          {/* LONG information — accordions. */}
          <div className="mt-16 flex flex-col gap-4 lg:mt-20">
            <Accordion title="How the technology works" defaultOpen>
              <p>{tech.howItWorks}</p>
            </Accordion>

            {tech.modes && (
              <Accordion title="Treatment modes and applications">
                <ul className="flex flex-col gap-3">
                  {tech.modes.map((m) => (
                    <li key={m.title}>
                      <span className="font-semibold text-primary">{m.title}</span> — {m.body}
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}

            {isLed && tech.lights && (
              <Accordion title="Light types and who they suit">
                <div className="flex flex-col gap-4">
                  {tech.lights.map((l) => (
                    <div key={l.title}>
                      <p className="font-semibold text-primary">{l.title}</p>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {l.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {isLed && tech.wavelengths && (
              <Accordion title="Wavelength reference">
                <WavelengthTable rows={tech.wavelengths} />
              </Accordion>
            )}

            <Accordion title="Before treatment">
              <p>{tech.before}</p>
            </Accordion>
            <Accordion title="During treatment">
              <p>{tech.during}</p>
            </Accordion>
            <Accordion title="After treatment">
              <p>{tech.after}</p>
            </Accordion>
            <Accordion title="Recommended schedule">
              <p>{tech.recommendation}</p>
            </Accordion>
          </div>

          <div className="mt-12 rounded-[var(--radius-md)] border border-dashed border-border-strong bg-surface-elevated p-6 sm:p-7">
            <span className="eyebrow text-muted">Note</span>
            <p className="mt-2 text-[0.9rem] text-secondary">
              {tech.name} is a technology applied within a treatment, selected in consultation —
              it is not booked on its own.{" "}
              <Link href="/treatments#skin-treatments" className="underline underline-offset-2 hover:text-accent-contrast">
                See the treatments it may be used within
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base" space="spacious">
        <Container>
          <CTABlock
            title="Curious whether this suits you?"
            body="Which technologies are used, and how, is confirmed in consultation and tailored to your goals."
            primary={{ label: cta.book, href: cta.bookHref }}
            secondary={{ label: "See all Technologies", href: "/treatments#technologies" }}
          />
        </Container>
      </Section>
    </>
  );
}

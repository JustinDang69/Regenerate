/* =============================================================================
   TreatmentGridSection — the bookable treatment list for one area.
   -----------------------------------------------------------------------------
   The same grid of TreatmentIndexCards that /concerns has always shown, now
   shared with the dedicated /skin-treatments and /hair-treatments pages.
   Reads the one `treatments` array — no treatment is duplicated — and every
   card keeps its existing booking CTA and link to /treatments/[slug].

   Pass `header` for a section inside a longer page (/concerns). Omit it where
   the page hero already titles the list (the dedicated pages), so the title
   and intro are not shown twice.
   ========================================================================== */
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Kind from "@/components/ui/Kind";
import TreatmentIndexCard from "@/components/cards/TreatmentIndexCard";
import { treatments } from "@/content/treatments";

export default function TreatmentGridSection({
  group,
  id,
  tone,
  header,
}: {
  group: "skin" | "scalp";
  id?: string;
  tone: "base" | "elevated";
  header?: { eyebrow: string; title: string; lead?: string };
}) {
  const list = treatments.filter((t) => t.group === group);

  return (
    <Section id={id} tone={tone} space="spacious" className="scroll-mt-28">
      <Container>
        {header ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeader eyebrow={header.eyebrow} title={header.title} lead={header.lead} />
            <Kind>Bookable treatments</Kind>
          </div>
        ) : (
          <Kind>Bookable treatments</Kind>
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:mt-14 lg:gap-8">
          {list.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 3) * 70} className="h-full">
              <TreatmentIndexCard treatment={t} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

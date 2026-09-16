import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import SplitEditorial from "@/components/sections/SplitEditorial";
import PractitionerCard from "@/components/cards/PractitionerCard";
import ImageFrame from "@/components/ui/ImageFrame";
import CTABlock from "@/components/sections/CTABlock";
import Reveal from "@/components/motion/Reveal";
import Divider from "@/components/brand/Divider";

import { practitioners } from "@/content/practitioners";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Clinic & Practitioners",
  description:
    "About Regenerate Skin & Hair Clinic in Pascoe Vale South — our philosophy, the clinic space, and the practitioner who leads your care.",
  alternates: { canonical: "/about" },
};

/* Only confirmed practitioners are rendered publicly. */
const publicPractitioners = practitioners.filter((p) => !p.isPlaceholder);

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
          /* Client mapping: the flower table / floral stand image. The holder
             is 3:4 ("tall") to match the photograph exactly rather than crop
             it into the previous 4:5 frame. */
          image={{
            src: "/media/clinic/clinic-space-flower-table.jpg",
            alt: "The Regenerate clinic interior, with a floral arrangement on a gold stand and the kitchen beyond",
            label: "Clinic space",
            mask: "arch",
            ratio: "tall",
          }}
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

      {/* CLIENT FEEDBACK (Sep 2026): the "meaning of the dandelion" section was
          removed — its explanation was not supplied by the client and must not
          be presented as brand story. The dandelion remains as the visual
          emblem only. Nothing has been put in its place. */}

      {/* --- Values -------------------------------------------------------- */}
      <Section tone="elevated">
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

      {/* --- The clinic space ----------------------------------------------
          CLIENT REVISION: moved here from the homepage. Copy trimmed to avoid
          duplicating the "Why we exist" story and the Values section above —
          this block now covers only the physical environment and what a visit
          feels like.

          PHOTOGRAPHY (client mapping, 16 Sep 2026): the previous 3-tile grid
          had a tall portrait tile for the waiting area, which would have
          cropped the client's landscape sofa photograph and hidden the seating
          — the client explicitly asked for the full sofa arrangement. The grid
          is now two landscape tiles, one per confirmed photograph; the
          unassigned "interior detail" tile was removed rather than guessed. */}
      <Section id="space" tone="elevated" className="scroll-mt-28">
        <Container>
          <SectionHeader
            eyebrow="The clinic"
            title="A calm, considered space"
            lead="Our Pascoe Vale South clinic is designed to feel unhurried — private treatment rooms, soft natural light, and time to talk things through properly."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:gap-6">
            <Reveal>
              <ImageFrame
                src="/media/clinic/waiting-room-sofa.jpg"
                alt="The clinic waiting room, with a full sofa and armchair, the Regenerate wall logo and a floral display"
                ratio="landscape"
                placeholderLabel="Waiting room"
                sizes="(max-width: 767px) 100vw, 570px"
              />
              <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Waiting room
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ImageFrame
                src="/media/clinic/treatment-room-one-bed.jpg"
                alt="A private treatment room with a single treatment bed, basin and stool"
                ratio="landscape"
                placeholderLabel="Private treatment room"
                sizes="(max-width: 767px) 100vw, 570px"
              />
              <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Private treatment room
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      {/* --- Practitioners ------------------------------------------------- */}
      {/* CLIENT FEEDBACK (Sep 2026): the clinic is recruiting and prospective
          practitioners may visit, so only CONFIRMED people are shown publicly.
          Placeholder profiles stay in the data file (privately useful as the
          structure for future entries) but are filtered out here. No "pending"
          copy is shown. */}
      <Section id="practitioners" tone="base" className="scroll-mt-28">
        <SectionHeader
          eyebrow="The team"
          title="Meet the practitioners"
          lead="You should always know who is treating you."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicPractitioners.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <PractitionerCard p={p} />
            </Reveal>
          ))}
        </div>
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

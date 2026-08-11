/* =============================================================================
   SAMPLE ONLY — NOT WIRED INTO THE APP
   -----------------------------------------------------------------------------
   A demonstration of how a /treatments/[slug] detail page would be built from
   components that ALREADY exist in this repository, so the client can see that
   the proposed architecture needs no new design system — only new content.

   This file lives under docs/ and is excluded from the Next.js build. It is not
   imported anywhere. Do not move it into src/ until the architecture is approved.

   Copy shown here is the COMPLIANCE-REVIEWED public version, not the raw source
   document. See treatment-content-map.md for what was changed and why.
   ========================================================================== */
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import CTABlock from "@/components/sections/CTABlock";
import Divider from "@/components/brand/Divider";
import { cta } from "@/lib/site";

/* In production this shape would live in src/content/treatments.ts and be looked
   up by slug, exactly as concerns.ts / packages.ts work today. */
const treatment = {
  slug: "microneedling",
  name: "Microneedling",
  eyebrow: "Skin treatment · Rejuvenation",
  subtitle: "The Collagen Booster", // TODO(client): public-facing subtitle, or internal heading only?
  intro:
    "A minimally invasive skin-needling treatment designed to support skin renewal, texture and collagen-related remodelling through controlled micro-channels.",

  pathway: {
    concern: "Texture, the appearance of certain scars, and skin rejuvenation goals.",
    technology:
      "Sterile fine needles create controlled microscopic channels in the skin as part of a practitioner-led treatment.",
    benefit:
      "Designed to support skin renewal and a smoother, revitalised-looking appearance. Individual response and suitability vary.",
  },

  before: [
    "A consultation with your practitioner, including a health-history review.",
    "Skin assessment and a discussion of your goals.",
    "Before-and-after photography, only with your consent.",
    "Questions are welcome at any point.",
  ],
  during: [
    "Numbing cream is applied around 30 minutes beforehand.",
    "Controlled skin needling is performed by your practitioner.",
    "Comfort levels vary between individuals and are discussed beforehand.",
  ],
  after: [
    "Mild to moderate redness is expected and typically settles within about two days.",
    "Dryness or a feeling of tightness may follow, often easing around days 4–5.",
    "Many people notice a change once flaking has settled.",
  ],

  aftercare: [
    { window: "Days 0–2", items: ["Avoid touching the face, direct sun, strenuous exercise, swimming, sauna and steam.", "Avoid make-up."] },
    { window: "Days 0–4", items: ["Use a gentle cleanser, a hyaluronic-acid serum and moisturiser.", "Apply mineral SPF and reapply regularly."] },
    { window: "Days 5–7", items: ["Active serums such as vitamin C can be reintroduced gradually."] },
  ],

  schedule:
    "A course of at least 3–6 sessions, spaced 4–6 weeks apart, with maintenance around every 3–4 months. Your plan is confirmed in consultation.",

  /* COMPLIANCE — deliberately NOT rendered publicly. Kept here so the reason is
     visible to whoever implements this, not so it can be switched on casually.
     The source document claims micro-channels improve product absorption "by up
     to 300% to 500%". Publishing that requires supporting evidence and clinical
     /legal sign-off (Ahpra prohibits claims creating unreasonable expectations
     of benefit). */
  internalOnly: {
    absorptionClaim: "300%–500% improved product absorption — evidence required before any public use.",
  },
} as const;

export default function TreatmentDetailSample() {
  return (
    <>
      <PageHero
        eyebrow={treatment.eyebrow}
        title={treatment.name}
        lead={treatment.intro}
        primary={{ label: cta.book, href: cta.bookHref }}
      />

      {/* Keeps the site's established concern → technology → benefit rhythm. */}
      <Section tone="base">
        <Container>
          <SectionHeader
            eyebrow="Treatment pathway"
            title="What the treatment is designed to support"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Concern", treatment.pathway.concern],
              ["Technology", treatment.pathway.technology],
              ["Benefit", treatment.pathway.benefit],
            ].map(([label, copy], index) => (
              <Reveal key={label} delay={index * 70}>
                <article className="h-full rounded-[var(--radius-md)] border border-border bg-surface p-6">
                  <span className="eyebrow text-muted">{label}</span>
                  <p className="mt-3 text-secondary">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="elevated">
        <Container>
          <SectionHeader eyebrow="Your appointment" title="What to expect" />
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <ExpectationBlock title="Before" items={treatment.before} />
            <ExpectationBlock title="During" items={treatment.during} />
            <ExpectationBlock title="After" items={treatment.after} />
          </div>
        </Container>
      </Section>

      <Section tone="base">
        <Container>
          <SectionHeader eyebrow="Aftercare" title="Looking after your skin" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {treatment.aftercare.map((phase, index) => (
              <Reveal key={phase.window} delay={index * 70}>
                <article className="h-full rounded-[var(--radius-md)] border border-border bg-surface p-6">
                  <span className="eyebrow text-muted">{phase.window}</span>
                  <ul className="mt-3 space-y-3 text-secondary">
                    {phase.items.map((item) => (
                      <li key={item} className="border-t border-border pt-3 text-[0.95rem]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface p-6">
            <span className="eyebrow text-muted">Recommended schedule</span>
            <p className="mt-3 text-secondary">{treatment.schedule}</p>
          </Reveal>
        </Container>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]" />

      <Section tone="base">
        <Container>
          <CTABlock
            title={`Is ${treatment.name} right for you?`}
            body="Treatment suitability, expected experience and an individual plan are confirmed during consultation. Results vary."
            primary={{ label: cta.book, href: cta.bookHref }}
            secondary={null}
          />
        </Container>
      </Section>
    </>
  );
}

function ExpectationBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article>
      <h2 className="text-h3">{title}</h2>
      <ul className="mt-4 space-y-3 text-secondary">
        {items.map((item) => (
          <li key={item} className="border-t border-border pt-3">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

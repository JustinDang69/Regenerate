/* =============================================================================
   HealthcareStatement — the clinic's healthcare positioning.
   -----------------------------------------------------------------------------
   ⚠️  CLIENT-SUPPLIED COPY — DO NOT EDIT THE WORDING.

   The paragraph below was supplied by the client and must appear verbatim. It has
   not been polished, rewritten, grammar-corrected or paraphrased, and it must not
   be. Only typography, line breaks, spacing and layout are designed here.

   Its purpose is to communicate that Regenerate is a healthcare-oriented skin and
   hair clinic, not a beauty salon — so the opening line is pulled out as a large
   serif statement and the remainder runs as body copy beneath it.

   This is the ONE deliberate warm surface on the site (`tone="sunken"`). Palette C
   is otherwise white-grounded; reserving the warm field for this single section is
   what makes the colour read as intentional rather than decorative.

   The full emblem sits behind this text — the placement the client asked for,
   where it stays visible rather than being covered by photography.
   ========================================================================== */
"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Motif from "@/components/brand/Motif";
import Reveal from "@/components/motion/Reveal";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { cta } from "@/lib/site";

export default function HealthcareStatement() {
  /* Scoped to an inner wrapper rather than <Section>, which does not forward a
     ref. The wrapper is unpositioned, so the emblem still anchors to <Section>. */
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* The statement is the strongest moment on the homepage, so it gets the
         most deliberate reveal: each line rises out of its own mask, in turn. */
      gsap.from("[data-statement-line]", {
        yPercent: 115,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: "[data-statement]", start: "top 82%" },
      });

      /* Extremely slow emblem drift, tied to scroll. No loop — it only keeps the
         composition from feeling static as the section passes. */
      gsap.fromTo(
        "[data-statement-emblem]",
        { yPercent: -53, scale: 0.97 },
        {
          yPercent: -47,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Section id="healthcare" tone="sunken" container={false} className="overflow-hidden">
      {/* Emblem behind the text — visible, never under an image. */}
      <Motif
        data-statement-emblem
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] -translate-x-1/2 -translate-y-1/2 text-accent/[0.06] sm:h-[38rem]"
      />

      <div ref={root}>
      <Container size="narrow" className="relative text-center">
        <Reveal as="span" className="eyebrow">
          Our position
        </Reveal>

        {/* CLIENT COPY — verbatim. Line breaks are a design choice; the words are not. */}
        <h2
          data-statement
          className="mt-6 font-serif text-[clamp(2.1rem,6vw,4rem)] font-normal leading-[1.1] tracking-[-0.02em]"
        >
          <span className="line">
            <span data-statement-line>Skincare and haircare</span>
          </span>
          <span className="line">
            <span data-statement-line>are healthcare.</span>
          </span>
        </h2>

        <Reveal
          as="p"
          delay={120}
          className="mx-auto mt-8 max-w-[46rem] text-lead leading-[1.85] text-secondary"
        >
          When your skin and your hair need attention, it means they are hurt, damaged
          or harmed for some reasons. They require to be healed and cared for. You can
          heal, improve and regenerate your skin and hair with our help and treatment.{" "}
          <span className="font-semibold text-accent-contrast">Start today!</span>
        </Reveal>

        <Reveal delay={200} className="mt-10 flex justify-center">
          <Button href={cta.bookHref} size="lg">
            {cta.book}
          </Button>
        </Reveal>
      </Container>
      </div>
    </Section>
  );
}

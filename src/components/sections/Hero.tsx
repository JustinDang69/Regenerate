/* =============================================================================
   Hero — homepage hero.
   -----------------------------------------------------------------------------
   ROUND 3: rebuilt around a clinic film. The media slot is a real <video>
   element, so when the client's footage arrives it drops in with no structural
   change (see HeroMedia below).

   Motion is cinematic but restrained: the media reveals with a slow clip-path
   wipe, the headline rises line by line out of its own masks, then the lead and
   CTAs follow. ~1.5s total, deliberately unhurried. Nothing loops decoratively.

   Fully disabled under prefers-reduced-motion.
   ========================================================================== */
"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import MotifLayer from "@/components/brand/MotifLayer";
import HeroMedia from "@/components/sections/HeroMedia";
import { gsap } from "@/lib/motion/gsap";
import { cta } from "@/lib/site";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-eyebrow]", { y: 14, opacity: 0, duration: 0.8 }, 0)
        // Each headline line slides up out of its own overflow mask.
        .from("[data-hero-line]", { yPercent: 115, duration: 1.15, stagger: 0.1 }, 0.1)
        // Media wipes open from a slightly inset rectangle — the "curtain".
        .fromTo(
          "[data-hero-media]",
          { clipPath: "inset(12% 12% 12% 12% round 22px)", opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0% round 22px)", opacity: 1, duration: 1.5 },
          0.25
        )
        .from("[data-hero-lead]", { y: 18, opacity: 0, duration: 0.9 }, 0.75)
        .from("[data-hero-cta]", { y: 18, opacity: 0, duration: 0.9 }, 0.88)
        .from("[data-hero-cue]", { opacity: 0, duration: 0.8 }, 1.05);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden pt-28 pb-[clamp(3rem,7vw,5rem)] sm:pt-36"
      aria-label="Introduction"
    >
      {/* Emblem sits behind the TEXT column, never behind the media. */}
      <MotifLayer variant="hero" />

      <div className="mx-auto grid max-w-[var(--container-max)] items-center gap-12 px-[var(--gutter)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        {/* Copy */}
        <div className="flex flex-col items-start">
          <span data-hero-eyebrow className="eyebrow">
            Regenerate Skin &amp; Hair Clinic
          </span>

          {/* COMPLIANCE: "Forever in Your 20s" is the client-approved tagline.
              It was flagged for advertising review before public use; the client
              confirmed it. Lines are explicit so each mask holds exactly one. */}
          <h1 className="mt-5 text-display tracking-[-0.02em]">
            <span className="line">
              <span data-hero-line>Regenerate —</span>
            </span>
            <span className="line">
              <span data-hero-line>Forever in</span>
            </span>
            <span className="line">
              <span data-hero-line>Your 20s</span>
            </span>
          </h1>

          <p data-hero-lead className="mt-6 max-w-xl text-lead text-secondary text-pretty">
            A Melbourne clinic where medical credibility meets calm, considered care.
            Concern-led skin and hair programs, guided by qualified practitioners.
          </p>

          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={cta.bookHref} size="lg">
              {cta.book}
            </Button>
            <Button href="/skin" variant="secondary" size="lg">
              {cta.exploreSkin}
            </Button>
          </div>

          <div
            data-hero-cue
            className="mt-10 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em] text-muted"
          >
            <span
              aria-hidden
              className="relative block h-px w-11 overflow-hidden bg-border-strong"
            >
              <span className="absolute inset-0 animate-[cue_2.6s_var(--ease-in-out)_infinite] bg-accent" />
            </span>
            Scroll
          </div>
        </div>

        {/* Media */}
        <div data-hero-media>
          <HeroMedia />
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   Hero — homepage hero. Soft layered fade/translate reveal + ambient motif
   drift via GSAP. Falls back to a clean static hero under reduced-motion.
   Strongest conversion moment: headline, supportive sub-line, dual CTA.
   ========================================================================== */
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import MotifLayer from "@/components/brand/MotifLayer";
import ImageFrame from "@/components/ui/ImageFrame";
import { gsap } from "@/lib/motion/gsap";
import { cta } from "@/lib/site";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Layered entrance — soft, unhurried, staggered.
      gsap.from("[data-hero-stagger]", {
        y: 26,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from("[data-hero-media]", {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 1.3,
        ease: "power3.out",
        delay: 0.35,
      });
      // Ambient, never-ending gentle drift on the decorative motif.
      gsap.to("[data-hero-drift]", {
        y: 16,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden pt-32 pb-[clamp(3.5rem,8vw,7rem)] sm:pt-40"
      aria-label="Introduction"
    >
      <MotifLayer variant="hero" />
      <div data-hero-drift className="pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[var(--container-max)] items-center gap-12 px-[var(--gutter)] lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          {/* COMPLIANCE: "Forever in Your 20s" is a client-approved tagline. It was
              previously flagged for legal/advertising review before public use in
              regulated advertising — confirm sign-off is on file. */}
          <h1 data-hero-stagger className="text-display text-balance">
            Regenerate — Forever in Your&nbsp;20s
          </h1>

          <p data-hero-stagger className="max-w-xl text-lead text-secondary text-pretty">
            A Melbourne clinic where medical credibility meets calm, luxury care.
            We design concern-led skin and hair programs — considered, personalised,
            and guided by qualified practitioners.
          </p>

          <div data-hero-stagger className="mt-2 flex flex-wrap items-center gap-4">
            <Button href={cta.bookHref} size="lg">{cta.book}</Button>
            <Button href="/skin" variant="secondary" size="lg">{cta.exploreSkin}</Button>
          </div>
        </div>

        {/* Media */}
        <div data-hero-media className="relative">
          <ImageFrame
            ratio="tall"
            mask="arch"
            priority
            placeholderLabel="Clinic hero photography"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          {/* Floating credential card — quiet trust cue */}
          <Link
            href="/about#practitioners"
            className="absolute -bottom-6 -left-4 hidden max-w-[13rem] flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-surface/95 p-4 shadow-[var(--shadow-md)] backdrop-blur-sm transition-transform hover:-translate-y-1 sm:flex"
          >
            <span className="eyebrow text-muted">Cared for by</span>
            <span className="font-serif text-[1.1rem] text-accent-contrast">
              Dermal specialists &amp; therapist
            </span>
            <span className="text-[0.75rem] text-muted">Meet the team →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

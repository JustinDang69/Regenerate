/* =============================================================================
   SmoothScroll — Lenis smooth scrolling wired to GSAP ScrollTrigger.
   -----------------------------------------------------------------------------
   • Adds `.js` to <html> so CSS reveal primitives can safely hide content.
   • Fully disabled when the user prefers reduced motion (native scroll only).
   • Keeps ScrollTrigger in sync with Lenis' virtual scroll position.
   Accessible by design: no scroll-jacking, no scroll hijack of anchor links.
   ========================================================================== */
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    // Signal to CSS that JS is available (enables reveal choreography).
    root.classList.add("js");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Respect the user: no smooth-scroll instance at all.
      return () => root.classList.remove("js");
    }

    const lenis = new Lenis({
      /* Slightly slower and heavier than the previous 1.05 — one wheel gesture
         travels a little less and settles more gracefully. Deliberately kept
         under ~1.3: beyond that it starts to read as scroll-jacking rather
         than pacing, and navigation gets frustrating. */
      duration: 1.25,
      // Premium, unhurried easing — never a jarring snap.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      /* Slightly under 1 so a wheel notch covers a little less ground. */
      wheelMultiplier: 0.88,
      /* Touch was 1.6, which overshot on mobile. 1.2 is calmer without feeling
         sticky — a finger flick still tracks naturally. */
      touchMultiplier: 1.2,
    });

    root.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      root.classList.remove("js", "lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}

/* =============================================================================
   GSAP singleton — registers ScrollTrigger once, client-side only.
   Import { gsap, ScrollTrigger } from here anywhere you need timeline motion.
   ========================================================================== */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/* =============================================================================
   Reveal — lightweight scroll-reveal primitive.
   -----------------------------------------------------------------------------
   Uses IntersectionObserver (not GSAP) so basic reveals stay cheap and reliable
   on mobile. CSS in globals.css handles the actual fade/translate transition;
   this component only toggles `.is-visible`.

   • `as`     — render element (default "div")
   • `delay`  — stagger delay in ms (applied as transition-delay)
   • `once`   — reveal a single time (default true)

   If JS is off or reduced-motion is set, content is visible immediately (CSS).
   ========================================================================== */
"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Any extra DOM attributes (id, aria-*, etc.) pass through to the element. */
  [key: string]: unknown;
};

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  once = true,
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={`${visible ? "is-visible" : ""} ${className ?? ""}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

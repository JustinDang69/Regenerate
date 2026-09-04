/* =============================================================================
   Section — vertical rhythm wrapper. `tone` sets the surface background.

   `space` sets the vertical rhythm:
     default   — --section-y,          the site's standard cadence
     spacious  — --section-y-spacious, a slower editorial cadence for
                 content-heavy routes (Treatments, Skin, Hair and the
                 treatment/technology detail pages) where dense clinical copy
                 needs room to read as separate chapters.

   Applied selectively, not globally: the homepage keeps `default` so its
   composition is not stretched.
   ========================================================================== */
import type { ElementType } from "react";
import Container from "./Container";

type Tone = "base" | "elevated" | "sunken" | "accent";
type Space = "default" | "spacious";

type Props = {
  as?: ElementType;
  id?: string;
  tone?: Tone;
  space?: Space;
  container?: "default" | "narrow" | "wide" | false;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

const tones: Record<Tone, string> = {
  base: "bg-background text-primary",
  elevated: "bg-surface-elevated text-primary",
  sunken: "bg-surface-sunken text-primary",
  accent: "bg-accent text-on-accent",
};

const spaces: Record<Space, string> = {
  default: "py-[var(--section-y)]",
  spacious: "py-[var(--section-y-spacious)]",
};

export default function Section({
  as: Tag = "section",
  id,
  tone = "base",
  space = "default",
  container = "default",
  className,
  innerClassName,
  children,
}: Props) {
  const inner =
    container === false ? (
      children
    ) : (
      <Container size={container} className={innerClassName}>
        {children}
      </Container>
    );

  return (
    <Tag
      id={id}
      className={`relative ${spaces[space]} ${tones[tone]} ${className ?? ""}`.trim()}
    >
      {inner}
    </Tag>
  );
}

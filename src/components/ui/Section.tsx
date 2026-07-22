/* Section — vertical rhythm wrapper. `tone` sets the surface background. */
import type { ElementType } from "react";
import Container from "./Container";

type Tone = "base" | "elevated" | "sunken" | "accent";

type Props = {
  as?: ElementType;
  id?: string;
  tone?: Tone;
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

export default function Section({
  as: Tag = "section",
  id,
  tone = "base",
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
      className={`relative py-[var(--section-y)] ${tones[tone]} ${className ?? ""}`.trim()}
    >
      {inner}
    </Tag>
  );
}

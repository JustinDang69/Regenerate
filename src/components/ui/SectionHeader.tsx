/* =============================================================================
   SectionHeader — eyebrow + serif title + optional lead. Reveal-animated.
   `align` controls composition; default is left for editorial asymmetry.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Heading = "h2",
  className,
  titleClassName,
}: Props) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  const sizeClass =
    Heading === "h1" ? "text-h1" : Heading === "h3" ? "text-h3" : "text-h2";

  return (
    <div
      className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className ?? ""}`.trim()}
    >
      {eyebrow && (
        <Reveal as="span" className="eyebrow flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-accent/60 align-middle"
          />
          {eyebrow}
        </Reveal>
      )}
      <Reveal as={Heading} delay={80} className={`${sizeClass} text-balance ${titleClassName ?? ""}`}>
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" delay={160} className="text-lead text-secondary text-pretty">
          {lead}
        </Reveal>
      )}
    </div>
  );
}

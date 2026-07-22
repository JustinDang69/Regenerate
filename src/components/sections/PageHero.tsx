/* =============================================================================
   PageHero — refined interior-page hero. Eyebrow + serif title + lead + motif.
   Server component (no client JS) — reveals handled by CSS/Reveal children.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import MotifLayer from "@/components/brand/MotifLayer";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  align?: "left" | "center";
};

export default function PageHero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  align = "left",
}: Props) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden pt-32 pb-[clamp(2.5rem,5vw,4.5rem)] sm:pt-40">
      <MotifLayer variant="quiet" />
      <Container>
        <div className={`flex max-w-3xl flex-col gap-5 ${centered ? "mx-auto items-center text-center" : "items-start"}`}>
          {eyebrow && (
            <Reveal as="span" className="eyebrow flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-8 bg-accent/60" />
              {eyebrow}
            </Reveal>
          )}
          <Reveal as="h1" delay={60} className="text-h1 text-balance">
            {title}
          </Reveal>
          {lead && (
            <Reveal as="p" delay={120} className="text-lead text-secondary text-pretty">
              {lead}
            </Reveal>
          )}
          {(primary || secondary) && (
            <Reveal delay={180} className={`mt-3 flex flex-wrap gap-4 ${centered ? "justify-center" : ""}`}>
              {primary && <Button href={primary.href} size="lg">{primary.label}</Button>}
              {secondary && <Button href={secondary.href} variant="secondary" size="lg">{secondary.label}</Button>}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

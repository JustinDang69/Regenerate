/* =============================================================================
   SplitEditorial — asymmetric image + copy block. `reverse` flips the image
   side. Used for practitioner previews, clinic story, science, etc.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import ImageFrame from "@/components/ui/ImageFrame";
import Button from "@/components/ui/Button";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  children: React.ReactNode; // body copy
  image?: { src?: string; alt?: string; label?: string; mask?: "none" | "arch" | "soft"; ratio?: "portrait" | "landscape" | "square" | "tall" };
  reverse?: boolean;
  cta?: { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };
  secondaryCta?: { label: string; href: string };
};

export default function SplitEditorial({
  eyebrow,
  title,
  children,
  image,
  reverse,
  cta,
  secondaryCta,
}: Props) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={reverse ? "md:order-2" : ""}>
        <ImageFrame
          src={image?.src}
          alt={image?.alt ?? ""}
          ratio={image?.ratio ?? "portrait"}
          mask={image?.mask ?? "soft"}
          placeholderLabel={image?.label ?? "Clinic photography"}
        />
      </Reveal>

      <div className={`flex flex-col gap-5 ${reverse ? "md:order-1" : ""}`}>
        {eyebrow && <Reveal as="span" className="eyebrow">{eyebrow}</Reveal>}
        <Reveal as="h2" delay={60} className="text-h2 text-balance">
          {title}
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-4 text-secondary text-pretty">
          {children}
        </Reveal>
        {(cta || secondaryCta) && (
          <Reveal delay={180} className="mt-2 flex flex-wrap gap-4">
            {cta && (
              <Button href={cta.href} variant={cta.variant ?? "primary"}>
                {cta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="ghost">
                {secondaryCta.label}
              </Button>
            )}
          </Reveal>
        )}
      </div>
    </div>
  );
}

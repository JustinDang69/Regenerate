/* =============================================================================
   CTABlock — reusable conversion band. Used mid-page and as the final CTA.
   `tone="accent"` gives the deep olive band; `tone="soft"` a quiet ivory panel.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import Motif from "@/components/brand/Motif";
import { cta } from "@/lib/site";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  tone?: "accent" | "soft";
  primary?: { label: string; href: string };
  /** Pass `null` to render a single-action CTA (no secondary button). */
  secondary?: { label: string; href: string } | null;
};

export default function CTABlock({
  eyebrow = "Begin your consultation",
  title,
  body,
  tone = "accent",
  primary = { label: cta.book, href: cta.bookHref },
  secondary = { label: cta.enquire, href: cta.enquireHref },
}: Props) {
  const isAccent = tone === "accent";
  return (
    <Reveal
      className={`relative overflow-hidden rounded-[var(--radius-xl)] px-8 py-14 text-center sm:px-16 ${
        isAccent
          ? "bg-accent text-on-accent"
          : "border border-border bg-surface-elevated text-primary"
      }`}
    >
      <Motif className={`absolute -right-6 -top-6 h-40 w-40 ${isAccent ? "text-on-accent/10" : "text-accent/10"}`}
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
        {eyebrow && (
          <span className={`eyebrow ${isAccent ? "text-on-accent/70" : ""}`}>{eyebrow}</span>
        )}
        <h2 className={`text-h2 text-balance ${isAccent ? "text-on-accent" : ""}`}>{title}</h2>
        {body && (
          <p className={`text-lead text-pretty ${isAccent ? "text-on-accent/85" : "text-secondary"}`}>
            {body}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Button href={primary.href} variant={isAccent ? "on-accent" : "primary"} size="lg">
            {primary.label}
          </Button>
          {secondary && (
            <Button
              href={secondary.href}
              variant={isAccent ? "ghost" : "secondary"}
              size="lg"
              className={isAccent ? "text-on-accent hover:text-on-accent/80" : ""}
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </Reveal>
  );
}

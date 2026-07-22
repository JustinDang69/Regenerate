/* =============================================================================
   Logo — lockup of the dandelion mark + serif wordmark.
   Variants: "full" (mark + wordmark), "stacked", "mark" (glyph only).
   Tone inherits from `color` via currentColor, so `reversed` just sets a light
   colour on dark surfaces. Keep this in sync with the exported SVG assets.
   ========================================================================== */

import Link from "next/link";
import DandelionMark from "./DandelionMark";
import { site } from "@/lib/site";

type Variant = "full" | "stacked" | "mark";

type Props = {
  variant?: Variant;
  href?: string | null;
  className?: string;
  markClassName?: string;
  /** Accessible label used when the logo links home. */
  label?: string;
};

function Wordmark({ stacked }: { stacked?: boolean }) {
  return (
    <span
      className={
        stacked
          ? "flex flex-col items-center leading-none"
          : "flex flex-col leading-none"
      }
    >
      <span className="font-serif text-[1.35rem] tracking-[0.02em] text-current">
        Regenerate
      </span>
      <span className="mt-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-current/70">
        Skin&nbsp;&amp;&nbsp;Hair Clinic
      </span>
    </span>
  );
}

export default function Logo({
  variant = "full",
  href = "/",
  className,
  markClassName,
  label = `${site.name} — home`,
}: Props) {
  const content = (
    <span
      className={`inline-flex items-center gap-3 text-accent-contrast ${
        variant === "stacked" ? "flex-col gap-2" : ""
      } ${className ?? ""}`}
    >
      <DandelionMark className={`h-9 w-9 shrink-0 ${markClassName ?? ""}`} />
      {variant !== "mark" && <Wordmark stacked={variant === "stacked"} />}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} aria-label={label} className="inline-flex">
      {content}
    </Link>
  );
}

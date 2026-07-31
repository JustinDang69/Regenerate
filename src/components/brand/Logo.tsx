/* =============================================================================
   Logo — lockup of the dandelion mark + serif wordmark.
   Variants: "full" (mark + wordmark), "stacked", "mark" (glyph only).
   Tone inherits from `color` via currentColor, so `reversed` just sets a light
   colour on dark surfaces. Keep this in sync with the exported SVG assets.
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";
import DandelionMark from "./DandelionMark";
import { site } from "@/lib/site";
import { LOGO_READY, LOGO_ASPECT, logoAssets } from "@/lib/brand";

type Variant = "full" | "stacked" | "mark";

type Props = {
  variant?: Variant;
  href?: string | null;
  className?: string;
  markClassName?: string;
  /** Accessible label used when the logo links home. */
  label?: string;
  /** Selects the size-optimised asset variant. */
  placement?: "header" | "footer";
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
  placement = "header",
}: Props) {
  /* PRIMARY PATH — the client's original logo, rendered as an image so the
     artwork (capital R, dandelion, curved line, "regenerate", "SKIN & HAIR",
     "CLINIC", its own lettering, spacing and olive-gold) is preserved exactly.
     Never reconstruct these forms in code. */
  const content = LOGO_READY ? (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src={placement === "footer" ? logoAssets.footer : logoAssets.header}
        alt={site.name}
        width={LOGO_ASPECT.width}
        height={LOGO_ASPECT.height}
        priority={placement === "header"}
        className={`h-auto w-auto ${
          variant === "mark" ? "max-h-10" : "max-h-14"
        } object-contain ${markClassName ?? ""}`}
      />
    </span>
  ) : (
    /* FALLBACK — placeholder lockup shown only while the client's original PNG
       is missing. This is NOT the client's logo and must not ship. See
       src/lib/brand.ts for the two-step activation instructions. */
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

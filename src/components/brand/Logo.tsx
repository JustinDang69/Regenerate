/* =============================================================================
   Logo — renders the CLIENT'S ORIGINAL logo artwork.
   -----------------------------------------------------------------------------
   The logo is always an image derived from the client's supplied original
   (see src/lib/brand.ts and public/brand/README.md). It is never reconstructed
   from type or vector shapes in code — the capital R, dandelion, curved line,
   "regenerate", "SKIN & HAIR", "CLINIC", the logo's own lettering, spacing,
   proportions and olive-gold all come straight from the source file.

   The website's own fonts are unrelated to the lettering inside the logo.

   `placement` picks the size-optimised asset. Note the lockup is a near-square
   stacked composition, so it needs more height than a horizontal wordmark for
   the smallest line ("CLINIC") to stay legible.
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { LOGO_ASPECT, logoAssets } from "@/lib/brand";

type Props = {
  href?: string | null;
  className?: string;
  imageClassName?: string;
  /** Accessible label used when the logo links home. */
  label?: string;
  /** Selects the size-optimised asset variant. */
  placement?: "header" | "footer";
};

export default function Logo({
  href = "/",
  className,
  imageClassName,
  label = `${site.name} — home`,
  placement = "header",
}: Props) {
  const content = (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src={placement === "footer" ? logoAssets.footer : logoAssets.header}
        alt={site.name}
        width={LOGO_ASPECT.width}
        height={LOGO_ASPECT.height}
        priority={placement === "header"}
        className={`w-auto object-contain ${
          placement === "footer" ? "h-20 sm:h-24" : "h-14 sm:h-16"
        } ${imageClassName ?? ""}`}
      />
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} aria-label={label} className="inline-flex">
      {content}
    </Link>
  );
}

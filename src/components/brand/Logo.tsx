/* =============================================================================
   Logo — renders the CLIENT'S ORIGINAL logo artwork.
   -----------------------------------------------------------------------------
   ROUND 3: the CIRCULAR logo is the main brand identity and appears in the
   header. The footer uses the emblem + brand-name lockup as the clinic identity.

   The artwork is always an image derived from the client's supplied files (see
   src/lib/brand.ts and scripts/generate-logo-assets.mjs). It is never
   reconstructed from type or vector shapes in code — the R, dandelions, curved
   stems, "regenerate", "SKIN & HAIR CLINIC", the logo's own lettering, spacing,
   proportions and colour all come straight from the source file.

   Intrinsic width/height are passed so the browser reserves the correct aspect
   ratio and nothing shifts as the logo loads.
   ========================================================================== */

import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { logoAssets, LOGO_SIZES } from "@/lib/brand";

type Props = {
  href?: string | null;
  className?: string;
  imageClassName?: string;
  /** Accessible label used when the logo links home. */
  label?: string;
  /** Selects which identity to render. */
  placement?: "header" | "footer";
};

export default function Logo({
  href = "/",
  className,
  imageClassName,
  label = `${site.name} — home`,
  placement = "header",
}: Props) {
  const isFooter = placement === "footer";
  const src = isFooter ? logoAssets.footer : logoAssets.header;
  const size = isFooter ? LOGO_SIZES.footer : LOGO_SIZES.circle;

  const content = (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src={src}
        alt={site.name}
        width={size.width}
        height={size.height}
        priority={!isFooter}
        sizes={isFooter ? "(max-width: 640px) 200px, 260px" : "(max-width: 1024px) 56px, 64px"}
        /* Header: the circular lockup carries small type, so it needs enough
           height to stay legible while still reading as a navigation logo.
           It steps down on scroll via the `is-compact` class set by Header. */
        className={`w-auto object-contain ${
          isFooter
            ? "h-24 sm:h-28"
            : "h-[56px] transition-[height] duration-[var(--dur-base)] ease-[var(--ease-soft)] lg:h-16"
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

/* =============================================================================
   Button — brand CTA. Renders as <a>/<Link> when href is given, else <button>.
   Variants: primary (olive fill), secondary (outline), ghost (text), on-accent.
   Elegant hover: subtle lift + deepening, never harsh.
   ========================================================================== */
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "on-accent";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
} & { onClick?: never };

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

const base =
  "group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-sans font-semibold tracking-wide transition-all duration-[var(--dur-fast)] ease-[var(--ease-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.8rem]",
  md: "px-6 py-3 text-[0.9rem]",
  lg: "px-8 py-4 text-[0.95rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[var(--shadow-sm)] hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
  secondary:
    "border border-border-strong bg-surface/60 text-accent-contrast hover:border-accent hover:bg-surface hover:-translate-y-0.5",
  ghost:
    "text-accent-contrast hover:text-accent-hover underline-offset-4 hover:underline",
  "on-accent":
    "bg-on-accent text-accent-contrast hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
};

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-[var(--dur-fast)] ease-[var(--ease-soft)] group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export default function Button(props: AsLink | AsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
  } = props;

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`.trim();

  if ("href" in props && props.href) {
    const { href, external } = props;
    const isInternal = href.startsWith("/") && !external;
    if (isInternal) {
      return (
        <Link href={href} className={cls}>
          {children}
          <Arrow />
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
        <Arrow />
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as AsButton;
  return (
    <button className={cls} {...rest}>
      {children}
      <Arrow />
    </button>
  );
}

/* =============================================================================
   PackageCard — premium multi-session program card.
   Shows name, price, concern, positioning, sessions, inclusions, CTA.
   `featured` renders a subtly emphasised treatment.
   ========================================================================== */
import { type Package, formatPrice } from "@/content/packages";
import { cta } from "@/lib/site";
import Button from "@/components/ui/Button";

type Props = {
  pkg: Package;
  featured?: boolean;
};

export default function PackageCard({ pkg, featured }: Props) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[var(--radius-lg)] border p-8 transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${
        featured
          ? "border-accent/40 bg-surface shadow-[var(--shadow-md)] ring-1 ring-accent/10"
          : "border-border bg-surface shadow-[var(--shadow-xs)] hover:border-border-strong"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-[var(--radius-pill)] bg-accent px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-on-accent">
          Signature
        </span>
      )}

      <span className="eyebrow text-muted">{pkg.concern}</span>

      <h3 className="mt-3 text-h3 text-primary">{pkg.name}</h3>
      <p className="mt-2 text-[0.92rem] text-secondary">{pkg.positioning}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-serif text-[2.4rem] leading-none text-accent-contrast">
          {formatPrice(pkg.price)}
        </span>
        <span className="text-small text-muted">· {pkg.sessions}</span>
      </div>

      <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-secondary">
            <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path d="M3 8.5l3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button href={cta.bookHref} variant={featured ? "primary" : "secondary"} size="md" className="w-full">
          {cta.book}
        </Button>
      </div>

      {/* COMPLIANCE: pricing indicative; suitability confirmed in consultation. */}
      <p className="mt-3 text-center text-[0.7rem] text-muted">
        Indicative pricing · suitability confirmed in consultation
      </p>
    </article>
  );
}

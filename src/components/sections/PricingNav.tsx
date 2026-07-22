/* PricingNav — sticky in-page anchor nav for the pricing page (client). */
"use client";

const links = [
  { label: "Packages", href: "#packages" },
  { label: "Single Treatments", href: "#single" },
];

export default function PricingNav() {
  return (
    <div className="sticky top-[4.5rem] z-30 -mx-[var(--gutter)] mb-4 border-y border-border bg-background/85 px-[var(--gutter)] py-3 backdrop-blur-md">
      <nav aria-label="Pricing sections" className="flex items-center gap-2">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-[var(--radius-pill)] border border-border px-4 py-2 text-[0.82rem] font-semibold text-accent-contrast transition-colors hover:border-accent hover:bg-accent-soft/50"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

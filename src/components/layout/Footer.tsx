/* =============================================================================
   Footer — quiet, premium close. NAP, nav groups, legal, subtle motif.
   Booking is NOT buried here alone (per brief) — it's a reinforcement, not the
   only path. Includes the compliance-facing content notes as HTML comments.
   ========================================================================== */
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import Motif from "@/components/brand/Motif";
import Button from "@/components/ui/Button";
import { site, footerNav, cta, addressLines } from "@/lib/site";

function LinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="eyebrow text-muted">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[0.9rem] text-secondary transition-colors hover:text-accent-contrast">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const a = site.contact.address;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface-elevated">
      <Motif className="pointer-events-none absolute -bottom-10 right-[6%] h-56 w-56 text-accent/[0.06]" />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-16">
        {/* Top: brand + closing CTA */}
        <div className="flex flex-col gap-8 border-b border-border pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Logo placement="footer" />
            <p className="mt-4 text-secondary text-pretty">{site.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={cta.bookHref}>{cta.book}</Button>
            <Button href={cta.enquireHref} variant="secondary">{cta.enquire}</Button>
          </div>
        </div>

        {/* Middle: NAP + nav groups */}
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <h3 className="eyebrow text-muted">Visit us</h3>
            <address className="not-italic text-[0.9rem] leading-relaxed text-secondary">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="text-muted">{a.precinct}</span>
            </address>
            <a href={`mailto:${site.contact.email}`} className="text-[0.9rem] text-secondary hover:text-accent-contrast">
              {site.contact.email}
            </a>
            {/* TODO(client): confirm public phone number */}
            <a href={`tel:${site.contact.phone}`} className="text-[0.9rem] text-secondary hover:text-accent-contrast">
              {site.contact.phoneDisplay}
            </a>
            <div className="mt-2 text-[0.85rem] text-muted">
              {site.hours.map((h) => (
                <div key={h.days}>
                  {h.days} {h.time}
                </div>
              ))}
            </div>
          </div>

          <LinkGroup title="Treatments" links={footerNav.treatments} />
          <LinkGroup title="Clinic" links={footerNav.clinic} />
          <LinkGroup title="Information" links={footerNav.legal} />
        </div>

        {/* Bottom: legal line */}
        <div className="flex flex-col gap-3 border-t border-border pt-8 text-[0.78rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          {/* COMPLIANCE: general advisory line — confirm final wording with clinic/legal. */}
          <p className="max-w-xl md:text-right">
            Information on this website is general in nature and not a substitute for
            professional advice. Treatment suitability and outcomes are individual and
            confirmed in consultation. Results vary.
          </p>
        </div>
      </div>
    </footer>
  );
}

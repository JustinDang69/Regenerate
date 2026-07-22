/* =============================================================================
   LocationBlock — NAP, hours, access notes + map placeholder.
   Part of conversion (per competitor analysis): address, hours, parking,
   transport, "how to find us". Data comes from lib/site.ts.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { site, cta } from "@/lib/site";

const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  site.contact.mapQuery
)}&output=embed`;

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0">
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-1.5 text-secondary text-[0.92rem]">{children}</dd>
    </div>
  );
}

export default function LocationBlock({ showMap = true }: { showMap?: boolean }) {
  const a = site.contact.address;
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      {/* Details */}
      <Reveal>
        <span className="eyebrow">Visit the clinic</span>
        <h2 className="mt-3 text-h2">Conveniently located in Pascoe Vale South</h2>
        <p className="mt-3 text-secondary">
          Find us in the {a.precinct}, with on-site parking and easy public-transport access.
        </p>

        <dl className="mt-8">
          <InfoRow label="Address">
            {a.line1}, {a.suburb}, {a.state} {a.postcode}
          </InfoRow>
          <InfoRow label="Opening hours">
            {site.hours.map((h) => (
              <span key={h.days} className="block">
                {h.days}: {h.time}
              </span>
            ))}
          </InfoRow>
          <InfoRow label="Email">
            <a className="underline-offset-2 hover:underline" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
          </InfoRow>
          <InfoRow label="Phone">
            {/* TODO(client): confirm public phone number */}
            <a className="underline-offset-2 hover:underline" href={`tel:${site.contact.phone}`}>
              {site.contact.phoneDisplay}
            </a>
          </InfoRow>
          <InfoRow label="Parking">
            {site.access.parking.map((p) => (
              <span key={p} className="block">
                {p}
              </span>
            ))}
          </InfoRow>
          <InfoRow label="Public transport">
            {site.access.transport.map((t) => (
              <span key={t} className="block">
                {t}
              </span>
            ))}
          </InfoRow>
          <InfoRow label="Accessibility">{site.access.accessibility}</InfoRow>
        </dl>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={cta.bookHref}>{cta.book}</Button>
          <Button
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.contact.mapQuery)}`}
            variant="secondary"
            external
          >
            Get directions
          </Button>
        </div>
      </Reveal>

      {/* Map */}
      {showMap && (
        <Reveal delay={120} className="min-h-[22rem]">
          <div className="h-full min-h-[22rem] overflow-hidden rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-sm)]">
            {/* Google Maps embed — no API key required for basic place embed. */}
            <iframe
              title={`Map to ${site.name}`}
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
              style={{ border: 0, minHeight: "22rem" }}
            />
          </div>
        </Reveal>
      )}
    </div>
  );
}

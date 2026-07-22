/* =============================================================================
   TrustStrip — quiet band of trust signals. Content is generic and safe;
   swap items as real credentials/registrations are confirmed.
   TODO(client): confirm AHPRA-registered clinician wording + any memberships.
   ========================================================================== */
import Reveal from "@/components/motion/Reveal";

const items: { label: string; sub: string }[] = [
  { label: "Practitioner-led", sub: "Dermal specialists & therapist" },
  { label: "Concern-first", sub: "Plans tailored in consultation" },
  { label: "Considered technology", sub: "Applied with care, never by default" },
  { label: "Melbourne clinic", sub: "Pascoe Vale South, VIC" },
];

export default function TrustStrip() {
  return (
    <div className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-2 gap-px px-[var(--gutter)] py-2 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 60}
            className="flex flex-col items-center gap-0.5 px-4 py-6 text-center"
          >
            <span className="font-serif text-[1.15rem] text-accent-contrast">{item.label}</span>
            <span className="text-[0.78rem] text-muted">{item.sub}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

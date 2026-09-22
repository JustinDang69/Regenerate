/* =============================================================================
   ProcessSteps — renders a Treatment's multi-step process.
   `rail`      — short sequences (MedicalFACIAL's 5 steps): a compact always-open row.
   `accordion` — long sequences (MedicalSCALP's 15 stages): numbered, collapsed by
                 default except the first, so the page never renders fifteen
                 always-open cards at once.
   ========================================================================== */
import Accordion from "@/components/ui/Accordion";
import type { Process } from "@/content/treatments";

export default function ProcessSteps({ process }: { process: Process }) {
  if (process.display === "rail") {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {process.steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-border bg-surface p-6"
          >
            <span className="font-serif text-[1.6rem] leading-none text-accent/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-semibold text-primary">{step.title}</span>
            <p className="text-[0.85rem] text-secondary">{step.body}</p>
          </div>
        ))}
      </div>
    );
  }

  const badge = (n: number) => (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-[0.85rem] text-accent-contrast">
      {n}
    </span>
  );

  return (
    /* Long sequences (MedicalSCALP's 15 stages, UltraFACIAL/UltraSCALP's 12). A
       slightly wider gap keeps them reading as discrete stages rather than one
       dense stack. A step WITH a description is an accordion; a step whose
       source supplied only a title (UltraFACIAL, UltraSCALP) renders as a static
       numbered row in the same style — no chevron, nothing to expand, and no
       description manufactured to fill it. */
    <div className="flex flex-col gap-4">
      {process.steps.map((step, i) =>
        step.body ? (
          <Accordion key={step.title + i} defaultOpen={i === 0} meta={badge(i + 1)} title={step.title}>
            <p>{step.body}</p>
          </Accordion>
        ) : (
          <div
            key={step.title + i}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-5 sm:px-7"
          >
            {badge(i + 1)}
            <span className="font-semibold text-primary">{step.title}</span>
          </div>
        )
      )}
    </div>
  );
}

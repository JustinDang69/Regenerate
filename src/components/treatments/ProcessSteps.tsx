/* =============================================================================
   ProcessSteps — renders a Treatment's multi-step process.
   `rail`      — short sequences (HydraFacial's 5 steps): a compact always-open row.
   `accordion` — long sequences (HydraScalp's 15 stages): numbered, collapsed by
                 default except the first, so the page never renders fifteen
                 always-open cards at once.
   ========================================================================== */
import Accordion from "@/components/ui/Accordion";
import type { Process } from "@/content/treatments";

export default function ProcessSteps({ process }: { process: Process }) {
  if (process.display === "rail") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {process.steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-surface p-5"
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

  return (
    <div className="flex flex-col gap-3">
      {process.steps.map((step, i) => (
        <Accordion
          key={step.title}
          defaultOpen={i === 0}
          meta={
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-[0.85rem] text-accent-contrast">
              {i + 1}
            </span>
          }
          title={step.title}
        >
          <p>{step.body}</p>
        </Accordion>
      ))}
    </div>
  );
}

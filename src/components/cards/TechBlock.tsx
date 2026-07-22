/* TechBlock — explains one technology: what it is · where used · what it supports. */
import type { Technology } from "@/content/technologies";

export default function TechBlock({ tech }: { tech: Technology }) {
  return (
    <article className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-[0.9rem] font-semibold tracking-wide text-accent-contrast">
          {tech.abbr}
        </span>
        <h3 className="text-[1.05rem] font-semibold text-primary">{tech.name}</h3>
      </div>
      <dl className="mt-1 flex flex-col gap-2 text-[0.85rem]">
        <div>
          <dt className="sr-only">What it is</dt>
          <dd className="text-secondary">{tech.what}</dd>
        </div>
        <div>
          <dt className="font-semibold text-primary/80">Where it may be used</dt>
          <dd className="text-secondary">{tech.where}</dd>
        </div>
        <div>
          <dt className="font-semibold text-primary/80">Designed to support</dt>
          <dd className="text-secondary">{tech.supports}</dd>
        </div>
      </dl>
    </article>
  );
}

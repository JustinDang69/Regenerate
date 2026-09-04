/* =============================================================================
   Accordion — single expand/collapse disclosure. Used for long-form technology
   and treatment content (how it works, before/during/after, HydraScalp's 15
   stages) so a detail page never renders as one continuous wall of text.
   ========================================================================== */
"use client";

import { useState, type ReactNode } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Small right-aligned label, e.g. a stage number. */
  meta?: ReactNode;
  className?: string;
};

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  meta,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${className ?? ""}`.trim()}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-elevated sm:px-7"
      >
        <span className="flex items-center gap-3">
          {meta}
          <span className="font-semibold text-primary">{title}</span>
        </span>
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className={`h-2.5 w-3 shrink-0 text-muted transition-transform duration-[var(--dur-fast)] ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path d="M1 1.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-[var(--dur-base)] ease-[var(--ease-soft)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="max-w-prose px-5 pb-6 text-[0.95rem] leading-relaxed text-secondary text-pretty sm:px-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

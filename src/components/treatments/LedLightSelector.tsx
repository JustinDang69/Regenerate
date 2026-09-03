/* LedLightSelector — selectable light-colour chips that swap the detail panel
   in place. LED is the only technology with this shape of content (the guide's
   "modes" are its light colours), so this is purpose-built rather than a
   generic `modes` renderer. Client component: selection is local UI state. */
"use client";

import { useState } from "react";
import type { LedLight, Wavelength } from "@/content/treatments";

/** "Blue light — Acne-focused treatment" -> "Blue" */
function shortLabel(title: string) {
  return title.split(" light")[0];
}
/** "Blue light — Acne-focused treatment" -> "Acne-focused treatment" */
function purpose(title: string) {
  return (title.split("—")[1] ?? "").trim();
}

export default function LedLightSelector({
  lights,
  wavelengths,
}: {
  lights: LedLight[];
  wavelengths: Wavelength[];
}) {
  // Red is the well-studied, broadly-applicable default (matches the artifact's
  // approved default example).
  const defaultIndex = Math.max(
    lights.findIndex((l) => shortLabel(l.title) === "Red"),
    0
  );
  const [active, setActive] = useState(defaultIndex);

  const light = lights[active];
  const label = shortLabel(light.title);
  const wave = wavelengths.find((w) => w.light === label);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Choose the light">
        {lights.map((l, i) => {
          const lbl = shortLabel(l.title);
          const w = wavelengths.find((x) => x.light === lbl);
          const isActive = i === active;
          return (
            <button
              key={l.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-[0.86rem] font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface text-secondary hover:border-border-strong"
              }`}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: w?.swatch ?? "var(--accent)" }}
              />
              {lbl}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface p-6">
        <span className="eyebrow text-muted">
          {label} light{wave ? ` · ${wave.nm}` : ""}
        </span>
        <p className="mt-1.5 font-serif text-[1.3rem] text-primary">{purpose(light.title)}</p>

        <p className="mt-5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-primary/80">
          Best suited for
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {light.items.map((item) => (
            <li key={item} className="text-[0.92rem] text-secondary">
              {item}
            </li>
          ))}
        </ul>

        {wave && <p className="mt-5 text-[0.9rem] text-secondary">{wave.does}</p>}
      </div>
    </div>
  );
}

/* WavelengthTable — LED's wavelength reference. Table on desktop (md and up),
   stacked cards on mobile — a compressed four-column table reads poorly under
   768px. Same data renders both ways; CSS shows exactly one at any width. */
import type { Wavelength } from "@/content/treatments";

export default function WavelengthTable({ rows }: { rows: Wavelength[] }) {
  return (
    <>
      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-[var(--radius-md)] border border-border md:block">
        <table className="w-full text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="px-4 py-3 font-semibold text-primary">Light</th>
              <th className="px-4 py-3 font-semibold text-primary">Typical wavelength</th>
              <th className="px-4 py-3 font-semibold text-primary">Main clinic use</th>
              <th className="px-4 py-3 font-semibold text-primary">What the technology does</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.light} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-accent-contrast">
                  <span
                    aria-hidden
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                    style={{ background: w.swatch }}
                  />
                  {w.light}
                </td>
                <td className="px-4 py-3 text-secondary">{w.nm}</td>
                <td className="px-4 py-3 text-secondary">{w.use}</td>
                <td className="px-4 py-3 text-secondary">{w.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((w) => (
          <div key={w.light} className="rounded-[var(--radius-md)] border border-border bg-surface p-5">
            <div className="flex items-baseline gap-2 border-b border-border pb-3">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: w.swatch }} />
              <span className="font-semibold uppercase tracking-[0.04em] text-primary">{w.light}</span>
              <span className="text-[0.85rem] text-muted">{w.nm}</span>
            </div>
            <div className="mt-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted">
                Main clinic use
              </p>
              <p className="mt-1 text-[0.92rem] text-secondary">{w.use}</p>
            </div>
            <div className="mt-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted">
                What the technology does
              </p>
              <p className="mt-1 text-[0.92rem] text-secondary">{w.does}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* Kind — small pill beside a section heading that says what KIND of thing the
   section lists ("Bookable treatments", "Applied within treatments" …), so
   treatments and technologies never read as the same commercial tier (client
   requirement). Moved out of the Concerns page unchanged so the dedicated
   treatment pages can share it. */
export default function Kind({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[var(--radius-pill)] border border-border px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted">
      {children}
    </span>
  );
}

/* Prose — readable long-form text column for legal / editorial content. */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[var(--container-narrow)] flex-col gap-5 text-secondary [&_h2]:mt-8 [&_h2]:text-h3 [&_h2]:text-primary [&_a]:text-accent-contrast [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_strong]:text-primary">
      {children}
    </div>
  );
}

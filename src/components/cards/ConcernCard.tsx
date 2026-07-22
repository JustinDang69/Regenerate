/* ConcernCard — light, elevated card for a single concern. Gentle lift on hover. */
import Link from "next/link";
import type { Concern } from "@/content/concerns";
import DandelionMark from "@/components/brand/DandelionMark";

type Props = {
  concern: Concern;
  href?: string;
  index?: number;
};

export default function ConcernCard({ concern, href, index }: Props) {
  const link = href ?? `/${concern.category}#${concern.slug}`;
  return (
    <Link
      href={link}
      className="group relative flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-7 shadow-[var(--shadow-xs)] transition-all duration-[var(--dur-base)] ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted">
          {typeof index === "number" ? String(index + 1).padStart(2, "0") : concern.category}
        </span>
        <DandelionMark className="h-6 w-6 text-accent/30 transition-colors group-hover:text-accent/60" strokeWidth={1} />
      </div>
      <h3 className="text-h3">{concern.title}</h3>
      <p className="text-secondary text-[0.95rem]">{concern.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-accent-contrast">
        Explore pathway
        <span aria-hidden className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

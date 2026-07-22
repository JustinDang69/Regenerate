/* Container — the premium editorial column. Width from --container-max token. */
import type { ElementType } from "react";

type Props = {
  as?: ElementType;
  size?: "default" | "narrow" | "wide";
  className?: string;
  children: React.ReactNode;
};

const sizes: Record<string, string> = {
  default: "max-w-[var(--container-max)]",
  narrow: "max-w-[var(--container-narrow)]",
  wide: "max-w-[86rem]",
};

export default function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
}: Props) {
  return (
    <Tag
      className={`mx-auto w-full ${sizes[size]} px-[var(--gutter)] ${className ?? ""}`.trim()}
    >
      {children}
    </Tag>
  );
}

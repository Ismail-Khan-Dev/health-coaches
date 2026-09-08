import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "good" | "warn" | "danger" | "sage";
  children: ReactNode;
}) {
  const tones = {
    default: "bg-paper-deep text-ink-soft",
    good: "bg-good/10 text-good",
    warn: "bg-warn/10 text-warn",
    danger: "bg-danger/10 text-danger",
    sage: "bg-sage/10 text-sage",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

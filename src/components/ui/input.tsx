import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted/80 outline-none transition-colors duration-150 focus:border-sage focus:ring-2 focus:ring-sage/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/80 outline-none transition-colors duration-150 focus:border-sage focus:ring-2 focus:ring-sage/20",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-xs font-medium tracking-label text-muted uppercase", className)}
      {...props}
    />
  );
}

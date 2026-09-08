import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-sage", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="16" cy="16" r="14.25" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M7.5 19.25c4.2-6.2 12.8-6.2 17 0"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark className="size-7" />
      <span className="font-display text-xl font-medium tracking-tight">Halden</span>
    </span>
  );
}

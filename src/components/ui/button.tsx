import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-sage text-sage-fg hover:bg-moss",
        ink: "bg-ink text-paper hover:bg-ink-soft",
        outline: "border border-line-strong bg-transparent text-ink hover:bg-paper-deep",
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        paper: "bg-paper text-ink hover:bg-paper-deep",
      },
      size: {
        sm: "h-10 rounded-md px-4 text-sm",
        md: "h-12 rounded-md px-5 text-sm",
        lg: "h-14 rounded-lg px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

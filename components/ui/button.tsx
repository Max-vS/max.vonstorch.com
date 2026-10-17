import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap outline-ink outline-offset-2 focus-visible:outline-2 disabled:cursor-default disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        // Square, like the Links page's CV button.
        solid:
          "min-h-38 bg-ink px-16 font-mono text-[length:--spacing(10)] text-ground uppercase tracking-[0.06em] sm:min-h-44 sm:text-[length:--spacing(11)]",
        ghost:
          "min-h-40 font-semibold text-[length:--spacing(13)] text-muted [transition:color_200ms] hover:text-ink sm:text-[length:--spacing(15)]",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

export function Button({
  className,
  variant,
  type = "button",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

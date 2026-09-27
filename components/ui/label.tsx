import { cn } from "cn";
import type { ComponentProps } from "react";

// The design's small mono captions (SHAPE, COLOUR, GROUND); field labels look the same.
export const labelText =
  "font-mono text-[length:--spacing(9)] text-muted uppercase tracking-[0.06em] sm:text-[length:--spacing(10)]";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: callers pass htmlFor.
    <label data-slot="label" className={cn(labelText, className)} {...props} />
  );
}

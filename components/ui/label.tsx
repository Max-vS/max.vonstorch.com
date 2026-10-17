import { cn } from "cn";
import type { ComponentProps } from "react";

export const labelText = "caption-sm text-muted";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: callers pass htmlFor.
    <label data-slot="label" className={cn(labelText, className)} {...props} />
  );
}

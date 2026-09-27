import { cn } from "cn";
import type { ComponentProps } from "react";

// At least 16px, or iOS Safari zooms into the field on focus.
export const fieldText =
  "w-full min-w-0 border-ink/35 border-b bg-transparent text-[length:max(16px,--spacing(16))] text-ink outline-none placeholder:text-muted focus-visible:border-ink focus-visible:shadow-[0_1px_0_var(--color-ink)] aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(fieldText, "h-30 sm:h-34", className)}
      {...props}
    />
  );
}

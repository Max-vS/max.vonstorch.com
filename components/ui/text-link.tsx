import { cn } from "cn";
import type { ComponentProps } from "react";

// Exported for next/link, which takes a typed route instead of an <a> href.
export const textLinkStyle = "underline underline-offset-4 hover:opacity-60";

export function TextLink({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      data-slot="text-link"
      className={cn(textLinkStyle, className)}
      {...props}
    />
  );
}

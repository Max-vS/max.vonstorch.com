import { cn } from "cn";
import type { ComponentProps } from "react";

export function TextLink({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      data-slot="text-link"
      className={cn("underline underline-offset-4 hover:opacity-60", className)}
      {...props}
    />
  );
}

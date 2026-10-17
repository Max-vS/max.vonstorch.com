import { cn } from "cn";
import type { ComponentProps } from "react";
import { fieldText } from "./input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldText, "resize-none py-6 leading-[1.3]", className)}
      {...props}
    />
  );
}

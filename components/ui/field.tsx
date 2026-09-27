import { cn } from "cn";
import type { ComponentProps } from "react";

export function Field({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  if (!children) return null;
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn(
        "text-[length:--spacing(12)] text-danger sm:text-[length:--spacing(13)]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

export const textLinkVariants = cva(
  "underline underline-offset-4 hover:opacity-60",
  {
    variants: {
      variant: {
        inline: "",
        // The design's tt-ext: the panel's own link, in mono under the text.
        action:
          "self-start font-mono text-[length:--spacing(11)] tracking-[0.02em] sm:text-[length:--spacing(13)]",
      },
    },
    defaultVariants: { variant: "inline" },
  },
);

export function TextLink({
  className,
  variant,
  ...props
}: ComponentProps<"a"> & VariantProps<typeof textLinkVariants>) {
  return (
    <a
      data-slot="text-link"
      className={cn(textLinkVariants({ variant }), className)}
      {...props}
    />
  );
}

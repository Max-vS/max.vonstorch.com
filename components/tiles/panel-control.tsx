import { cn } from "cn";
import Link from "next/link";
import type { ComponentProps } from "react";
import { textLinkStyle } from "@/components/ui/text-link";

export function PanelControl(props: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "caption inline-flex min-h-32 shrink-0 items-center self-start",
        textLinkStyle,
      )}
      {...props}
    />
  );
}

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

/** The panel's small mono controls: Show more, Show less, Back. */
export function PanelControl<Href>({
  href,
  children,
}: {
  href: LinkProps<Href>["href"];
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-32 shrink-0 items-center self-start font-mono text-[length:--spacing(10)] uppercase tracking-[0.06em] underline underline-offset-4 hover:opacity-60 sm:text-[length:--spacing(11)]"
    >
      {children}
    </Link>
  );
}

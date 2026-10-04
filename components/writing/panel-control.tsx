import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

/** The Writing panel's small mono controls: Close, back to the list. */
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
      className="inline-flex min-h-32 items-center font-mono text-[length:--spacing(10)] uppercase tracking-[0.06em] hover:opacity-60 sm:text-[length:--spacing(11)]"
    >
      {children}
    </Link>
  );
}

import { Fragment } from "react";
import { TextLink } from "@/components/ui/text-link";

export function PanelLinks({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  return links.map((link, index) => (
    <Fragment key={link.href}>
      {/* A no-break space keeps the dot at the end of a line, never at the start. */}
      {index > 0 ? "\u00a0· " : null}
      <TextLink href={link.href}>{link.label}</TextLink>
    </Fragment>
  ));
}

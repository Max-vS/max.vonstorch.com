import { Fragment } from "react";
import { TextLink } from "@/components/ui/text-link";

export function PanelLinks({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  return links.map((link, index) => (
    <Fragment key={link.href}>
      {index > 0 ? " · " : null}
      <TextLink href={link.href}>{link.label}</TextLink>
    </Fragment>
  ));
}

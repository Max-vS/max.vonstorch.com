import { TextLink } from "@/components/ui/text-link";

/** The panel's outside links, in the design's mono link style. */
export function PanelLinks({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-x-18 gap-y-8">
      {links.map(({ label, href }) => (
        <li key={href}>
          <TextLink href={href} variant="action">
            {label} ↗
          </TextLink>
        </li>
      ))}
    </ul>
  );
}

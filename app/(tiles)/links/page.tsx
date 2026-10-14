import { existsSync } from "node:fs";
import { join } from "node:path";
import { TextLink } from "@/components/ui/text-link";
import { links, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.links);

export default function LinksPage() {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));
  return (
    <ul className="flex flex-col gap-4 font-medium text-[length:--spacing(15)] leading-[1.3] sm:gap-6 sm:text-[length:--spacing(22)]">
      {[...(hasCv ? [links.cv] : []), ...links.liked].map((link) => (
        <li key={link.href}>
          <TextLink href={link.href}>{link.label}</TextLink>
        </li>
      ))}
    </ul>
  );
}

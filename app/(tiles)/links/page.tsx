import { existsSync } from "node:fs";
import { join } from "node:path";
import { TextLink } from "@/components/ui/text-link";
import { links, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.links);

export default function LinksPage() {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));
  return (
    <ul className="flex flex-col gap-6 text-[length:--spacing(14)] leading-[1.3] sm:gap-8 sm:text-[length:--spacing(17)]">
      {[...(hasCv ? [links.cv] : []), ...links.liked].map((link) => (
        <li key={link.href}>
          <TextLink
            href={link.href}
            className="decoration-ink/25 [transition:text-decoration-color_200ms] hover:decoration-ink hover:opacity-100"
          >
            {link.label}
          </TextLink>
        </li>
      ))}
    </ul>
  );
}

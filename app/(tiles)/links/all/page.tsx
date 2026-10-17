import { LinkList } from "@/components/links/link-list";
import { pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

// The same page as /links with every link shown, so the canonical URL stays /links.
export const metadata = pageMetadata(pages.links);

export default function AllLinksPage() {
  return <LinkList all />;
}

import { LinkList } from "@/components/links/link-list";
import { pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.links);

export default function LinksPage() {
  return <LinkList />;
}

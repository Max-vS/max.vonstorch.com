import { PanelText } from "@/components/tiles/panel-text";
import { community, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.community);

export default function CommunityPage() {
  return <PanelText>{community.empty}</PanelText>;
}

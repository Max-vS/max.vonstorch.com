import { PanelControl } from "@/components/tiles/panel-control";
import { PostList } from "@/components/writing/post-list";
import { panelControls, writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  ...writing.archive,
  path: "/writing/archive",
  feed: true,
});

export default function ArchivePage() {
  return (
    <PostList
      posts={getPosts()}
      control={
        <PanelControl href="/writing">{panelControls.less}</PanelControl>
      }
    />
  );
}

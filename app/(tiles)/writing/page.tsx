import { PanelControl } from "@/components/tiles/panel-control";
import { PostList } from "@/components/writing/post-list";
import { pages, panelControls } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...pages.writing, feed: true });

const LATEST = 3;

export default function WritingPage() {
  const posts = getPosts();
  return (
    <PostList
      posts={posts.slice(0, LATEST)}
      control={
        posts.length > LATEST ? (
          <PanelControl href="/writing/archive">
            {panelControls.more}
          </PanelControl>
        ) : null
      }
    />
  );
}

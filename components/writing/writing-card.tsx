import { PanelControl } from "@/components/tiles/panel-control";
import { panelControls } from "@/content/site";
import { getPosts } from "@/content/writing";
import { PostList } from "./post-list";

const LATEST = 3;

export function WritingCard() {
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

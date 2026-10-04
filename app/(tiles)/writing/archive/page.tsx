import { PanelControl } from "@/components/writing/panel-control";
import { PostLink } from "@/components/writing/post-link";
import { PostMeta } from "@/components/writing/post-meta";
import { writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  ...writing.archive,
  path: "/writing/archive",
  feed: true,
});

export default function ArchivePage() {
  const posts = getPosts();
  return (
    <div className="flex min-h-0 flex-1 animate-panel-in flex-col gap-10 motion-reduce:animate-none">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[length:--spacing(9)] text-muted uppercase tracking-[0.06em] sm:text-[length:--spacing(10)]">
          {writing.count(posts.length)}
        </h2>
        <PanelControl href="/writing">{writing.close}</PanelControl>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto border-ink border-t-[1.5px]">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostLink
              post={post}
              className="row-nudge flex flex-col items-start gap-3 border-ink/18 border-b py-10 sm:py-12"
            >
              <PostMeta post={post} minutes="short" />
              <span className="font-semibold text-[length:--spacing(17)] tracking-[-0.01em] sm:text-[length:--spacing(19)]">
                {post.title}
                {post.url ? " ↗" : null}
              </span>
              <span className="text-[length:--spacing(13)] text-muted leading-[1.35] sm:text-[length:--spacing(14)]">
                {post.summary}
              </span>
            </PostLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

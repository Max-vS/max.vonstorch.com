import type { ReactNode } from "react";
import type { Post } from "@/content/writing";
import { PostLink } from "./post-link";
import { PostMeta } from "./post-meta";

export function PostList({
  posts,
  control,
}: {
  posts: readonly Post[];
  control: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-10">
      <ul className="-mt-8 min-h-0 flex-1 overflow-y-auto sm:-mt-9">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostLink
              post={post}
              className="row-nudge flex items-baseline justify-between gap-16 border-ink/18 border-b py-8 sm:py-9"
            >
              <span className="min-w-0 truncate font-semibold text-[length:--spacing(15)] tracking-[-0.01em] sm:text-[length:--spacing(18)]">
                {post.title}
                {post.url ? " ↗" : null}
              </span>
              <PostMeta post={post} className="shrink-0 whitespace-nowrap" />
            </PostLink>
          </li>
        ))}
      </ul>
      {control}
    </div>
  );
}

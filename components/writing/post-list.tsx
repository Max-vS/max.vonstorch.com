import type { ReactNode } from "react";
import { ListRow } from "@/components/ui/list-row";
import type { Post } from "@/content/writing";
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
      <ul className="-mt-9 min-h-0 flex-1 overflow-y-auto sm:-mt-7">
        {posts.map((post) => (
          <li key={post.slug}>
            <ListRow
              href={post.url ?? `/writing/${post.slug}`}
              target={post.url ? "_blank" : undefined}
              rel={post.url ? "noopener" : undefined}
              title={post.url ? `${post.title} ↗` : post.title}
              meta={<PostMeta post={post} />}
            />
          </li>
        ))}
      </ul>
      {control}
    </div>
  );
}

import Link from "next/link";
import type { ComponentProps } from "react";
import type { Post } from "@/content/writing";

export function PostLink({
  post,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { post: Pick<Post, "slug" | "url"> }) {
  return post.url ? (
    <a href={post.url} target="_blank" rel="noopener" {...props} />
  ) : (
    <Link href={`/writing/${post.slug}`} {...props} />
  );
}

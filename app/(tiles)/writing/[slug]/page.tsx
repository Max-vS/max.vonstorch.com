import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WritingCard } from "@/components/writing/writing-card";
import { getLocalPosts, getPost } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getLocalPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const post = getPost((await props.params).slug);
  if (!post) notFound();
  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}`,
    feed: true,
    article: {
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  });
}

// The article itself renders in the @reader slot, above the tiles; the panel behind it keeps the writing card.
export default function PostPage() {
  return <WritingCard />;
}

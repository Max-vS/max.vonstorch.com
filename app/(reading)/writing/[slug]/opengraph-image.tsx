import { notFound } from "next/navigation";
import { shareImage, shareImageSize } from "@/components/share-image";
import { pages } from "@/content/site";
import { getLocalPosts, getPost } from "@/content/writing";
import { SITE_NAME } from "@/lib/metadata";

// Next reads the alt text once per file, so it cannot name the post.
export const alt = `Title card of a post by ${SITE_NAME}`;
export const size = shareImageSize;
export const contentType = "image/png";

// The image is a route of its own, so it lists the slugs itself to be built with the posts.
export function generateStaticParams() {
  return getLocalPosts().map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return shareImage({ ...pages.writing, kicker: SITE_NAME, title: post.title });
}

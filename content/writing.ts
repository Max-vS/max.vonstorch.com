import type { MDXContent } from "mdx/types";
import * as z from "zod";

const RESERVED_SLUGS = ["archive", "feed.xml"];

const postSchema = z.strictObject({
  slug: z
    .string()
    .refine(
      (slug) => !RESERVED_SLUGS.includes(slug),
      "This slug belongs to another /writing route. Rename the file.",
    ),
  title: z.string().min(1),
  date: z.iso.date(),
  summary: z.string().min(1),
  updated: z.iso.date().optional(),
  url: z.httpUrl().optional(),
});

export type Post = z.infer<typeof postSchema> & {
  Body: MDXContent;
  minutes: number;
};

type PostModule = {
  default: MDXContent;
  frontmatter?: Record<string, unknown>;
  readingTime: { minutes: number };
};

// Inside content/, because Next.js silently matches nothing for "../" patterns.
const modules = import.meta.glob("./writing/*.mdx", {
  eager: true,
}) as Record<string, PostModule>;

const posts: Post[] = Object.entries(modules)
  .map(([path, { default: Body, frontmatter, readingTime }]) => {
    const slug = path.slice(path.lastIndexOf("/") + 1, -".mdx".length);
    const result = postSchema.safeParse({ ...frontmatter, slug });
    if (!result.success) {
      throw new Error(
        `Invalid post content/writing/${slug}.mdx:\n${z.prettifyError(result.error)}`,
      );
    }
    const minutes = Math.max(1, Math.round(readingTime.minutes));
    return { ...result.data, Body, minutes };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPosts() {
  return posts;
}

export function getLocalPosts() {
  return posts.filter((post) => !post.url);
}

export function getPost(slug: string) {
  return getLocalPosts().find((post) => post.slug === slug);
}

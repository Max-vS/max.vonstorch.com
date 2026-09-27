import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocalPosts, getPost } from "@/content/writing";
import { pageMetadata, SITE_URL } from "@/lib/metadata";

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
  });
}

export default function PostPage({ params }: PageProps<"/writing/[slug]">) {
  return (
    // Known slugs prerender in full; the boundary lets an unknown slug's notFound() stream into the shell instead of failing the whole document.
    <Suspense>
      {params.then(({ slug }) => (
        <Post slug={slug} />
      ))}
    </Suspense>
  );
}

function Post({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: "Max von Storch", url: SITE_URL },
  };

  return (
    <article>
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <time dateTime={post.date} className="font-mono text-muted text-sm">
          {post.date}
        </time>
      </header>
      <div className="prose prose-site sm:prose-lg">
        <post.Body />
      </div>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; escaping "<" keeps a title from closing the script.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}

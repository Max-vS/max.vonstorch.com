import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { PanelControl } from "@/components/writing/panel-control";
import { PostMeta } from "@/components/writing/post-meta";
import { writing } from "@/content/site";
import { getLocalPosts, getPost } from "@/content/writing";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/metadata";

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
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="flex min-h-0 flex-1 animate-panel-in flex-col gap-12 motion-reduce:animate-none">
      <div className="flex items-center justify-between">
        <PanelControl href="/writing/archive">{writing.back}</PanelControl>
        <PanelControl href="/writing">{writing.close}</PanelControl>
      </div>
      <article className="flex min-h-0 flex-1 flex-col gap-14 overflow-y-auto border-ink border-t-[1.5px] pt-6 pr-6 pb-24 sm:gap-16 sm:pr-14">
        <PostMeta post={post} minutes="long" className="mt-10 text-forest" />
        <h1 className="text-balance font-bold text-[length:--spacing(32)] leading-[0.98] tracking-[-0.035em] sm:text-[length:--spacing(44)]">
          {post.title}
        </h1>
        <p className="mb-14 font-medium text-[length:--spacing(17)] text-lede leading-[1.35] sm:mb-16 sm:text-[length:--spacing(19)]">
          {post.summary}
        </p>
        <div className="post-body contents">
          <post.Body />
        </div>
      </article>
      <JsonLd data={jsonLd} />
    </div>
  );
}

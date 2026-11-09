import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { PanelControl } from "@/components/tiles/panel-control";
import { formatDate } from "@/components/writing/post-meta";
import { panelControls } from "@/content/site";
import { getLocalPosts, getPost } from "@/content/writing";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

export function generateStaticParams() {
  return getLocalPosts().map(({ slug }) => ({ slug }));
}

export default function PostReader({ params }: PageProps<"/writing/[slug]">) {
  return (
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
    <div className="relative flex h-full flex-col">
      <div className="flex h-(--tile) shrink-0 items-center justify-between px-24 sm:px-(--tile) lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:z-10">
        <PanelControl
          href="/writing"
          className="self-center lg:pointer-events-auto"
        >
          {panelControls.back}
        </PanelControl>
        <time dateTime={post.date} className="caption">
          {formatDate(post.date)}
        </time>
      </div>
      {/* From lg the column clears the controls, so the title shares their row; --aside keeps wide figures clear of them, --cap-top is their cap line. */}
      <div className="@container min-h-0 flex-1 overflow-y-auto lg:[--aside:calc(2*var(--tile)+16px)] lg:[--cap-top:--spacing(40.5)]">
        <article className="mx-auto flex max-w-720 flex-col gap-20 px-24 pt-20 pb-96 sm:px-40 sm:pt-40 sm:pb-120 lg:pt-28">
          <h1 className="text-balance font-bold text-[length:--spacing(40)] leading-[0.98] tracking-[-0.035em] sm:text-[length:--spacing(56)]">
            {post.title}
          </h1>
          <p className="mb-12 font-medium text-[length:--spacing(21)] text-lede leading-[1.4]">
            {post.summary}
          </p>
          <div className="post-body contents">
            <post.Body />
          </div>
        </article>
      </div>
      <JsonLd data={jsonLd} />
    </div>
  );
}

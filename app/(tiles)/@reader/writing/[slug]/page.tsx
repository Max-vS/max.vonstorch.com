import { cn } from "cn";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { PanelControl } from "@/components/tiles/panel-control";
import { sourceSerif } from "@/components/writing/post-font";
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
    <div className={cn("relative flex h-full flex-col", sourceSerif.variable)}>
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
      {/* --aside keeps wide figures clear of the controls; --cap-top is the controls' cap line, for a figure's sticky head. */}
      <div className="@container min-h-0 flex-1 overflow-y-auto lg:[--aside:calc(2*var(--tile)+16px)] lg:[--cap-top:--spacing(40.5)]">
        <article className="mx-auto max-w-[736px] px-[24px] pt-[56px] pb-[128px] lg:pt-[calc(var(--tile)+46px)]">
          <h1 className="text-balance font-bold text-[40px] leading-none tracking-[-0.03em] sm:text-[64px]">
            {post.title}
          </h1>
          <p className="mt-[16px] text-pretty font-serif text-[18px] text-lede leading-[1.5] sm:mt-[20px] sm:text-[20px]">
            {post.summary}
          </p>
          <div className="post-body mt-[48px] sm:mt-[64px]">
            <post.Body />
          </div>
        </article>
      </div>
      <JsonLd data={jsonLd} />
    </div>
  );
}

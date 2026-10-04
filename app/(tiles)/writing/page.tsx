import Link from "next/link";
import { PostLink } from "@/components/writing/post-link";
import { PostMeta } from "@/components/writing/post-meta";
import { pages, writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...pages.writing, feed: true });

export default function WritingPage() {
  return (
    <div className="flex animate-panel-in flex-col gap-12 motion-reduce:animate-none">
      <ul className="flex flex-col border-ink border-t-[1.5px]">
        {getPosts()
          .slice(0, 3)
          .map((post) => (
            <li key={post.slug}>
              <PostLink
                post={post}
                className="row-nudge flex flex-col items-start gap-3 border-ink/18 border-b py-7 sm:py-9"
              >
                <PostMeta post={post} />
                <span className="max-w-full truncate font-semibold text-[length:--spacing(16)] tracking-[-0.01em] sm:text-[length:--spacing(18)]">
                  {post.title}
                  {post.url ? " ↗" : null}
                </span>
              </PostLink>
            </li>
          ))}
      </ul>
      {/* Small and mono like the design's controls, because it opens the panel rather than pointing elsewhere. */}
      <Link
        href="/writing/archive"
        className="inline-flex min-h-32 items-center self-start font-mono text-[length:--spacing(12)] tracking-[0.02em] underline underline-offset-4 hover:opacity-60 sm:text-[length:--spacing(13)]"
      >
        {writing.allWriting}
      </Link>
    </div>
  );
}

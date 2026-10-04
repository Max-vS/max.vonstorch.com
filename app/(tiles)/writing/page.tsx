import Link from "next/link";
import { PanelText } from "@/components/tiles/panel-text";
import { textLinkStyle } from "@/components/ui/text-link";
import { PostLink } from "@/components/writing/post-link";
import { pages, writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...pages.writing, feed: true });

export default function WritingPage() {
  return (
    <>
      <ul className="flex flex-col border-ink border-t-[1.5px]">
        {getPosts()
          .slice(0, 3)
          .map((post) => (
            <li key={post.slug}>
              <PostLink
                post={post}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-14 border-ink/18 border-b py-9 [transition:padding_300ms_cubic-bezier(0.19,0.8,0.12,1)] hover:pl-8 sm:py-11"
              >
                <span className="truncate font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
                  {post.title}
                </span>
                <span className="font-mono text-[length:--spacing(10)] text-muted sm:text-[length:--spacing(11)]">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.url ? " ↗" : null}
                </span>
              </PostLink>
            </li>
          ))}
      </ul>
      <PanelText>
        <Link href="/writing/archive" className={textLinkStyle}>
          {writing.allPosts}
        </Link>
      </PanelText>
    </>
  );
}

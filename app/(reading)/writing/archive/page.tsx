import { PostLink } from "@/components/writing/post-link";
import { writing } from "@/content/site";
import { getPosts } from "@/content/writing";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  ...writing.archive,
  path: "/writing/archive",
  feed: true,
});

export default function ArchivePage() {
  return (
    <>
      <h1 className="mb-10 font-bold text-4xl leading-tight tracking-tight sm:text-5xl">
        {writing.archive.title}
      </h1>
      <ul className="border-ink border-t-[1.5px]">
        {getPosts().map((post) => (
          <li key={post.slug} className="border-ink/18 border-b">
            <PostLink
              post={post}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 py-4 [transition:padding_300ms_cubic-bezier(0.19,0.8,0.12,1)] hover:pl-2"
            >
              <span className="font-semibold text-lg">{post.title}</span>
              <span className="font-mono text-muted text-xs">
                <time dateTime={post.date}>{post.date}</time>
                {post.url ? " ↗" : null}
              </span>
              <span className="col-span-2 text-muted">{post.summary}</span>
            </PostLink>
          </li>
        ))}
      </ul>
    </>
  );
}

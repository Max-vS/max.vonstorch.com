import { pages, writing } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.writing);

export default function WritingPage() {
  return (
    <ul className="flex flex-col border-ink border-t-[1.5px]">
      {writing.posts.map((post) => (
        <li
          key={post.title}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-14 border-ink/18 border-b py-9 sm:py-11"
        >
          <span className="truncate font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
            {post.title}
          </span>
          <time
            dateTime={post.date}
            className="font-mono text-[length:--spacing(10)] text-muted sm:text-[length:--spacing(11)]"
          >
            {post.date}
          </time>
        </li>
      ))}
    </ul>
  );
}

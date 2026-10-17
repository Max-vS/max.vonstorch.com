import { cn } from "cn";
import { writing } from "@/content/site";
import type { Post } from "@/content/writing";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2026-09-27" as "27 Sep 2026", read from the string so no time zone can shift the day. */
function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** "27 SEP 2026", with the read time when `readTime` is set. */
export function PostMeta({
  post,
  readTime = false,
  className,
}: {
  post: Pick<Post, "date" | "minutes">;
  readTime?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[length:--spacing(9)] text-muted uppercase tracking-[0.06em] sm:text-[length:--spacing(10)]",
        className,
      )}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {readTime ? ` · ${writing.readTime(post.minutes)}` : null}
    </span>
  );
}

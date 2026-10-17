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

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

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
    <span className={cn("caption-sm text-muted", className)}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {readTime ? ` · ${writing.readTime(post.minutes)}` : null}
    </span>
  );
}

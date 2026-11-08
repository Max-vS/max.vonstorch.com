import { WritingCard } from "@/components/writing/writing-card";
import { pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ ...pages.writing, feed: true });

export default function WritingPage() {
  return <WritingCard />;
}

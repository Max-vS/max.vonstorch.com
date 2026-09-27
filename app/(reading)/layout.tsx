import Link from "next/link";
import { pages } from "@/content/site";

// A plain layout until the owner designs the article page (spec §2).
export default function ReadingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <header className="flex items-baseline justify-between gap-6 py-6 sm:py-10">
        <Link
          href={pages.index.path}
          className="font-bold text-lg tracking-tight hover:opacity-60"
        >
          {pages.index.title}
        </Link>
        <nav aria-label="Site">
          <Link
            href={pages.writing.path}
            className="font-medium text-muted hover:text-ink"
          >
            {pages.writing.label}
          </Link>
        </nav>
      </header>
      <main className="pt-6 pb-24 sm:pt-10">{children}</main>
    </div>
  );
}

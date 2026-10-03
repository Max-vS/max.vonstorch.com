import { cn } from "cn";
import Link from "next/link";
import { pages } from "@/content/site";
import type { SceneId } from "@/lib/tiles/types";

export function PageNav({ current }: { current?: SceneId }) {
  return (
    <nav
      aria-label="Pages"
      className="grid grid-cols-3 gap-x-12 gap-y-4 border-ink/25 border-t pt-12 sm:grid-cols-4 sm:gap-x-14 sm:gap-y-6"
    >
      {Object.values(pages).map((page) => {
        const active = page.id === current;
        return (
          <Link
            key={page.id}
            href={page.path}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-30 items-baseline whitespace-nowrap text-[length:--spacing(14)] tracking-[-0.01em] [transition:color_250ms] hover:text-ink sm:text-[length:--spacing(17)]",
              active ? "font-semibold text-ink" : "font-medium text-muted",
            )}
          >
            <span
              className={cn(
                "border-b-[1.5px] pb-1",
                active ? "border-ink" : "border-transparent",
              )}
            >
              {page.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

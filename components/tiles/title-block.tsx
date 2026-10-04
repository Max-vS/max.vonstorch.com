import { cn } from "cn";
import type { SitePage } from "@/content/site";
import { titleColors } from "@/lib/tiles/palettes";
import type { SceneId } from "@/lib/tiles/types";

export type TitlePage = Pick<SitePage, "kicker" | "title"> & { id: SceneId };

/** `away` slides the block up and out, to free the tiles behind it; `heading` false leaves the page's H1 to its content. */
export function TitleBlock({
  page,
  away,
  heading = true,
}: {
  page: TitlePage;
  away: boolean;
  heading?: boolean;
}) {
  const colors = titleColors[page.id];
  const Title = heading ? "h1" : "p";
  return (
    <header
      className={cn(
        "@container absolute top-0 left-0 flex h-(--title-height) w-(--title-width) flex-col justify-end px-18 py-16 [transition:background-color_600ms_var(--ease-turn),color_600ms] sm:px-30 sm:py-26 motion-safe:[transition:background-color_600ms_var(--ease-turn),color_600ms,translate_750ms_var(--ease-turn)]",
        away && "-translate-y-full",
      )}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      {page.kicker ? (
        <p className="mb-auto font-mono text-[length:--spacing(9)] uppercase tracking-[0.06em] opacity-80 sm:text-[length:--spacing(12)]">
          {page.kicker}
        </p>
      ) : null}
      <Title
        className={cn(
          "font-bold",
          // The cap is the block width ÷ 4.7, because "Community", the widest title, is 4.65 em.
          page.id === "index"
            ? "text-[length:min(--spacing(54),100cqi/4.7)] leading-[0.88] tracking-[-0.045em] sm:text-[length:min(--spacing(104),100cqi/4.7)]"
            : "text-[length:min(--spacing(68),100cqi/4.7)] leading-[0.85] tracking-[-0.05em] sm:text-[length:min(--spacing(132),100cqi/4.7)]",
        )}
      >
        {page.title}
      </Title>
    </header>
  );
}

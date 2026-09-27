"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { pages } from "@/content/site";
import { PATTERNS } from "@/lib/tiles/patterns";
import type { PageId } from "@/lib/tiles/types";
import { PageNav } from "./page-nav";
import { Panel } from "./panel";
import { PatternIndicator } from "./pattern-indicator";
import { TileGrid } from "./tile-grid";
import { TitleBlock } from "./title-block";
import { useGrid } from "./use-grid";
import { type Direction, usePatternInput } from "./use-pattern-input";
import { type Corner, useTileEngine } from "./use-tile-engine";

type View = { page: PageId; pattern: number; from: Corner };

export function TileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Every route of the (tiles) group is in `pages`; the fallback only satisfies the type.
  const page =
    Object.values(pages).find(({ path }) => path === pathname) ?? pages.index;
  const [view, setView] = useState<View>({
    page: page.id,
    pattern: 0,
    from: "top-left",
  });
  if (view.page !== page.id) {
    setView({ page: page.id, pattern: 0, from: "top-left" });
  }
  const still = page.id === "community";
  const grid = useGrid();
  const { tiles, turn, isBusy } = useTileEngine({ grid, ...view, still });

  function step(direction: Direction) {
    setView((current) => {
      const count = PATTERNS[current.page].length;
      return {
        ...current,
        pattern: (current.pattern + direction + count) % count,
        from: direction > 0 ? "top-left" : "bottom-right",
      };
    });
  }

  function select(pattern: number) {
    setView((current) =>
      pattern === current.pattern
        ? current
        : {
            ...current,
            pattern,
            from: pattern > current.pattern ? "top-left" : "bottom-right",
          },
    );
  }

  const input = usePatternInput({ step, isBusy, enabled: !still });

  return (
    // One spacing step is one design pixel (tile ÷ 65 on mobile, ÷ 90 on desktop), so all sizes scale with the tile.
    // The browser gets only horizontal pans, so a vertical swipe changes the pattern and never pulls to refresh.
    <div
      className="fixed inset-0 touch-pan-x touch-pinch-zoom overflow-hidden [--spacing:calc(var(--tile)/65)] sm:[--spacing:calc(var(--tile)/90)]"
      onWheel={input.onWheel}
      onTouchStart={input.onTouchStart}
      onTouchEnd={input.onTouchEnd}
    >
      <TileGrid tiles={tiles} onTurn={turn} />
      <TitleBlock page={page} />
      <Panel>
        <main className="flex flex-col gap-10 sm:gap-14">{children}</main>
        <div className="mt-auto flex flex-col gap-10">
          {still ? null : (
            <PatternIndicator
              names={PATTERNS[view.page].map(({ name }) => name)}
              current={view.pattern}
              onSelect={select}
            />
          )}
          <PageNav current={page.id} />
        </div>
      </Panel>
    </div>
  );
}

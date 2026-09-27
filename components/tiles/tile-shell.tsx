"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { pages } from "@/content/site";
import { masterBlock, tileCells } from "@/lib/tiles/grid";
import { buildMotif, motifIndex } from "@/lib/tiles/motif";
import { buildPattern, PATTERNS } from "@/lib/tiles/patterns";
import { randomSeed } from "@/lib/tiles/random";
import type { Cell, Grid, PageId, Tile } from "@/lib/tiles/types";
import { MasterBlock } from "./master-block";
import { PageNav } from "./page-nav";
import { Panel } from "./panel";
import { PatternIndicator } from "./pattern-indicator";
import { TileGrid } from "./tile-grid";
import { type TileScene, TileSceneContext } from "./tile-scene";
import { TitleBlock } from "./title-block";
import { useGrid } from "./use-grid";
import { type Direction, usePatternInput } from "./use-pattern-input";
import { type Corner, useTileEngine } from "./use-tile-engine";

type View = { page: PageId; pattern: number; from: Corner };

function cornerCell(corner: Corner, grid: Grid): Cell {
  return corner === "top-left"
    ? { row: 0, col: 0 }
    : { row: grid.rows - 1, col: grid.cols - 1 };
}

// Spec §9: a painted motif starts at the master block, a browsed one at the first full cell.
function motifOrigin(grid: Grid, master: Cell | null): Cell {
  return master ?? { row: grid.firstFullRow, col: grid.firstFullCol };
}

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
  const community = page.id === "community";
  // A scene left over from Community never applies to another page.
  const [pageScene, setScene] = useState<TileScene | null>(null);
  const scene = community ? pageScene : null;
  const painting = scene?.mode === "paint";
  const grid = useGrid();
  const { tiles, show, turn, isBusy } = useTileEngine({ still: community });

  // On Community the tiles behind the title block exist, so the block can slide away when paint mode needs the room.
  const behindTitle =
    community &&
    grid !== null &&
    (grid.mobile || masterBlock(grid, false) === null);
  const titleAway = painting && behindTitle;
  const master = grid && painting ? masterBlock(grid, titleAway) : null;

  // Only these decide the tiles, so a new step callback or label from the page never rebuilds them.
  const [contentKey, from, motif]: [string, Corner, readonly Tile[] | null] =
    !scene
      ? [`${view.page}/${view.pattern}`, view.from, null]
      : scene.mode === "browse"
        ? [scene.key, scene.from, scene.motif]
        : // The design enters paint mode with a wave from the bottom right.
          ["paint", "bottom-right", scene.motif];
  // Community waits for its page's scene, so the grid never flashes the fallback pattern first.
  const waiting = community && !scene;

  const shownKey = useRef<string | null>(null);
  useEffect(() => {
    if (!grid || waiting) return;
    const cells = tileCells(grid, behindTitle);
    const next = motif
      ? buildMotif(
          motif,
          cells,
          motifOrigin(grid, painting ? masterBlock(grid, titleAway) : null),
        )
      : buildPattern(view.page, view.pattern, grid, cells, randomSeed());
    // A new key flips the tiles over in a wave; the same key (after a resize or a paint stroke) changes them in place.
    const wave = contentKey !== shownKey.current;
    shownKey.current = contentKey;
    show(next, wave ? cornerCell(from, grid) : undefined);
  }, [
    grid,
    waiting,
    contentKey,
    from,
    motif,
    painting,
    titleAway,
    behindTitle,
    view.page,
    view.pattern,
    show,
  ]);

  function step(direction: Direction) {
    if (scene) {
      if (scene.mode === "browse") scene.step?.(direction);
      return;
    }
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

  // A stroke during a wave would cut the wave short, so paint mode ignores it, as the design does.
  function paint(index: number) {
    if (scene?.mode === "paint" && !isBusy()) scene.paint(index);
  }

  function paintTile(index: number) {
    if (grid) paint(motifIndex(tiles[index], motifOrigin(grid, master)));
  }

  const input = usePatternInput({
    step,
    isBusy,
    enabled: scene
      ? scene.mode === "browse" && scene.step !== null
      : !community,
  });

  return (
    <TileSceneContext value={setScene}>
      {/* One spacing step is one design pixel (tile ÷ 65 on mobile, ÷ 90 on desktop), and touch-pan-x leaves vertical swipes to the pattern instead of pull-to-refresh. */}
      <div
        className="fixed inset-0 touch-pan-x touch-pinch-zoom overflow-hidden [--spacing:calc(var(--tile)/65)] sm:[--spacing:calc(var(--tile)/90)]"
        onWheel={input.onWheel}
        onTouchStart={input.onTouchStart}
        onTouchEnd={input.onTouchEnd}
      >
        <TileGrid
          tiles={tiles}
          onTurn={turn}
          onPaint={painting ? paintTile : undefined}
        />
        {master ? <MasterBlock at={master} onPaint={paint} /> : null}
        <TitleBlock page={page} away={titleAway} />
        <Panel>
          <main className="flex flex-col gap-10 sm:gap-14">{children}</main>
          <div className="mt-auto flex flex-col gap-10">
            {!community ? (
              <PatternIndicator
                label={PATTERNS[view.page][view.pattern].name}
                hint="change"
                live
                ticks={{
                  names: PATTERNS[view.page].map(({ name }) => name),
                  current: view.pattern,
                  onSelect: select,
                }}
              />
            ) : scene?.label ? (
              // Community announces the whole mark in its panel instead.
              <PatternIndicator
                label={scene.label}
                hint={painting ? "paint" : "browse"}
                live={false}
              />
            ) : null}
            {/* The design hides the nav while painting; Cancel leaves paint mode. */}
            {painting ? null : <PageNav current={page.id} />}
          </div>
        </Panel>
      </div>
    </TileSceneContext>
  );
}

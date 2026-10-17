"use client";

import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { pages } from "@/content/site";
import { masterBlock, tileCells } from "@/lib/tiles/grid";
import { buildMotif, motifIndex } from "@/lib/tiles/motif";
import { buildPattern, PATTERNS } from "@/lib/tiles/patterns";
import { randomSeed } from "@/lib/tiles/random";
import type { Cell, Grid, SceneId, Tile } from "@/lib/tiles/types";
import { MasterBlock } from "./master-block";
import { PageNav } from "./page-nav";
import { Panel, type PanelSize } from "./panel";
import { PatternIndicator } from "./pattern-indicator";
import { TileGrid } from "./tile-grid";
import { type TileScene, TileSceneContext } from "./tile-scene";
import { TitleBlock, type TitlePage } from "./title-block";
import { useGrid } from "./use-grid";
import { type Direction, usePatternInput } from "./use-pattern-input";
import { type Corner, useTileEngine } from "./use-tile-engine";

type View = { page: SceneId; pattern: number; from: Corner };

function cornerCell(corner: Corner, grid: Grid): Cell {
  return corner === "top-left"
    ? { row: 0, col: 0 }
    : { row: grid.rows - 1, col: grid.cols - 1 };
}

function panelSize(pathname: string): PanelSize {
  if (pathname === "/writing/archive" || pathname === "/links/all") {
    return "list";
  }
  return pathname.startsWith("/writing/") ? "article" : "small";
}

function motifOrigin(grid: Grid, master: Cell | null): Cell {
  return master ?? { row: grid.firstFullRow, col: grid.firstFullCol };
}

export function TileShell({
  page: fixedPage,
  children,
}: {
  page?: TitlePage;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const page: TitlePage =
    fixedPage ??
    Object.values(pages).find(
      ({ path }) => path === pathname || pathname.startsWith(`${path}/`),
    ) ??
    pages.index;
  const [view, setView] = useState<View>({
    page: page.id,
    pattern: 0,
    from: "top-left",
  });
  if (view.page !== page.id) {
    setView({ page: page.id, pattern: 0, from: "top-left" });
  }
  const community = page.id === "community";
  const [pageScene, setScene] = useState<TileScene | null>(null);
  const scene = community ? pageScene : null;
  const painting = scene?.mode === "paint";
  const size: PanelSize = painting
    ? "paint"
    : fixedPage
      ? "small"
      : panelSize(pathname);
  const grid = useGrid();
  const { tiles, show, turn, hover, isBusy } = useTileEngine({
    still: community,
  });

  const behindTitle =
    community &&
    grid !== null &&
    (grid.mobile || masterBlock(grid, false) === null);
  const titleAway = painting && behindTitle;
  const master = grid && painting ? masterBlock(grid, titleAway) : null;

  const [contentKey, from, motif]: [string, Corner, readonly Tile[] | null] =
    !scene
      ? [`${view.page}/${view.pattern}`, view.from, null]
      : scene.mode === "browse"
        ? [scene.key, scene.from, scene.motif]
        : ["paint", "bottom-right", scene.motif];
  const waiting = community && !scene;

  const shownKey = useRef<string | null>(null);
  useEffect(() => {
    if (!grid || waiting) return;
    const cells = tileCells(grid, behindTitle);
    const origin =
      contentKey !== shownKey.current ? cornerCell(from, grid) : undefined;
    shownKey.current = contentKey;
    if (motif) {
      const start = motifOrigin(
        grid,
        painting ? masterBlock(grid, titleAway) : null,
      );
      show(buildMotif(motif, cells, start), { origin });
      return;
    }
    const { animate, idle } = PATTERNS[view.page][view.pattern];
    show(buildPattern(view.page, view.pattern, grid, cells, randomSeed()), {
      origin,
      animate,
      idle,
    });
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

  function paint(index: number) {
    if (scene?.mode === "paint" && !isBusy()) scene.paint(index);
  }

  function paintTile(index: number) {
    if (grid) paint(motifIndex(tiles[index], motifOrigin(grid, master)));
  }

  const patterns = PATTERNS[view.page];
  const changeable = patterns.length > 1;
  const input = usePatternInput({
    step,
    isBusy,
    enabled: scene
      ? scene.mode === "browse" && scene.step !== null
      : changeable && size === "small",
  });

  return (
    <TileSceneContext value={setScene}>
      <div
        className="fixed inset-0 touch-pan-x touch-pinch-zoom overflow-hidden"
        onWheel={input.onWheel}
        onTouchStart={input.onTouchStart}
        onTouchEnd={input.onTouchEnd}
      >
        <TileGrid
          tiles={tiles}
          onTurn={turn}
          onHover={hover ? turn : undefined}
          onPaint={painting ? paintTile : undefined}
        />
        {painting ? (
          <div
            aria-hidden="true"
            className="blueprint pointer-events-none absolute inset-0"
          />
        ) : null}
        {master ? (
          <div
            aria-hidden="true"
            className="motif-crosses pointer-events-none absolute inset-0"
            style={
              {
                "--motif-row": master.row,
                "--motif-col": master.col,
              } as CSSProperties
            }
          />
        ) : null}
        {master ? <MasterBlock at={master} onPaint={paint} /> : null}
        <TitleBlock page={page} away={titleAway} heading={size !== "article"} />
        <Panel size={size}>
          <main className="flex min-h-0 flex-1 flex-col gap-10 overflow-hidden sm:gap-14">
            {children}
          </main>
          <div className="flex shrink-0 flex-col gap-10 sm:gap-14">
            {changeable ? (
              <PatternIndicator
                className={size === "small" ? undefined : "max-sm:hidden"}
                label={patterns[view.pattern].name}
                hint="change"
                live
                ticks={{
                  names: patterns.map(({ name }) => name),
                  current: view.pattern,
                  onSelect: select,
                }}
              />
            ) : scene?.label ? (
              <PatternIndicator
                className={painting ? "max-sm:hidden" : undefined}
                label={scene.label}
                hint={painting ? "paint" : "browse"}
                live={false}
              />
            ) : null}
            {scene?.mode === "browse" ? scene.action : null}
            {painting ? null : <PageNav current={page.id} />}
          </div>
        </Panel>
      </div>
    </TileSceneContext>
  );
}

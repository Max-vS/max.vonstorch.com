import { useEffect, useState, useSyncExternalStore } from "react";
import { buildPattern } from "@/lib/tiles/patterns";
import { randomSeed } from "@/lib/tiles/random";
import type { Grid, PageId } from "@/lib/tiles/types";
import { createTileEngine, type TileView } from "./tile-engine";

export type Corner = "top-left" | "bottom-right";

const NO_TILES: readonly TileView[] = [];

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function isVisible() {
  return !document.hidden;
}

export function useTileEngine({
  grid,
  page,
  pattern,
  from,
  still,
}: {
  grid: Grid | null;
  page: PageId;
  pattern: number;
  from: Corner;
  still: boolean;
}) {
  const [engine] = useState(createTileEngine);
  const tiles = useSyncExternalStore(
    engine.subscribe,
    engine.getTiles,
    () => NO_TILES,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false,
  );
  const visible = useSyncExternalStore(
    subscribeVisibility,
    isVisible,
    () => true,
  );

  useEffect(() => {
    const turns = !reducedMotion && !still;
    engine.setMotion({ waves: !reducedMotion, turns, idle: turns && visible });
  }, [engine, reducedMotion, still, visible]);

  useEffect(() => {
    if (!grid) return;
    const origin =
      from === "top-left"
        ? { row: 0, col: 0 }
        : { row: grid.rows - 1, col: grid.cols - 1 };
    engine.show(buildPattern(page, pattern, grid, randomSeed()), origin);
  }, [engine, grid, page, pattern, from]);

  useEffect(() => engine.stop, [engine]);

  return { tiles, turn: engine.turn, isBusy: engine.isBusy };
}

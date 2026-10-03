import type { Random } from "./random";
import type { Shape, ShapeKey } from "./shapes";

export type PageId =
  | "index"
  | "education"
  | "projects"
  | "writing"
  | "music"
  | "cv"
  | "contact"
  | "community";

/** A page, or the 404 page, which has no nav entry. */
export type SceneId = PageId | "notFound";

export type Cell = { row: number; col: number };

export type Grid = {
  mobile: boolean;
  cols: number;
  rows: number;
  titleCols: number;
  titleRows: number;
  // 1 when the first row or column is cut at the window edge, else 0.
  firstFullRow: number;
  firstFullCol: number;
};

export type Tile = {
  // A key into SHAPES, or paths drawn for this one tile.
  shape: ShapeKey | Shape;
  // Degrees; it only ever grows, so every CSS turn goes forward.
  rot: number;
  bg: string;
  fg: string;
  fg2?: string;
  scale?: number;
  // Milliseconds, negative: where this tile starts in the ripple animation.
  rippleDelay?: number;
};

export type PlacedTile = Tile & Cell;

export type PatternInput = Cell & {
  random: Random;
  // Shared by the cells of one 2×2 block during a single build.
  blocks: Map<string, Tile>;
  grid: Grid;
};

export type Pattern = {
  name: string;
  tile: (input: PatternInput) => Tile;
  /** Runs at each animation step; it returns only the changed fields, or null when the tile stays the same. */
  animate?: (tile: PlacedTile, seconds: number) => Partial<Tile> | null;
  /** False where `animate` sets the colors, because idle flips would fight it. */
  idle?: boolean;
};

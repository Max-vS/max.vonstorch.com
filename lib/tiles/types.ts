import type { Random } from "./random";
import type { ShapeKey } from "./shapes";

export type PageId =
  | "index"
  | "education"
  | "projects"
  | "writing"
  | "music"
  | "cv"
  | "contact"
  | "community";

export type Cell = { row: number; col: number };

export type Grid = {
  mobile: boolean;
  cols: number;
  rows: number;
  titleCols: number;
  titleRows: number;
};

export type Tile = {
  shape: ShapeKey;
  // Degrees; it only ever grows, so every CSS turn goes forward.
  rot: number;
  bg: string;
  fg: string;
  fg2?: string;
  scale?: number;
  pulseDistance?: number;
};

export type PlacedTile = Tile & Cell;

export type PatternInput = Cell & {
  random: Random;
  // Shared by the cells of one 2×2 block during a single build.
  blocks: Map<string, Tile>;
  grid: Grid;
};

export type Pattern = { name: string; tile: (input: PatternInput) => Tile };

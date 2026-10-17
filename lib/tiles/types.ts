import type { Random } from "./random";
import type { Shape, ShapeKey } from "./shapes";

export type PageId =
  | "index"
  | "education"
  | "projects"
  | "writing"
  | "music"
  | "links"
  | "contact"
  | "community";

export type SceneId = PageId | "notFound";

export type Cell = { row: number; col: number };

export type Grid = {
  mobile: boolean;
  cols: number;
  rows: number;
  titleCols: number;
  titleRows: number;
  firstFullRow: number;
  firstFullCol: number;
};

export type Tile = {
  shape: ShapeKey | Shape;
  rot: number;
  bg: string;
  fg: string;
  fg2?: string;
  scale?: number;
  rippleDelay?: number;
};

export type PlacedTile = Tile & Cell;

export type PatternInput = Cell & {
  random: Random;
  blocks: Map<string, Tile>;
  grid: Grid;
};

export type Pattern = {
  name: string;
  tile: (input: PatternInput) => Tile;
  animate?: (tile: PlacedTile, seconds: number) => Partial<Tile> | null;
  idle?: boolean;
};

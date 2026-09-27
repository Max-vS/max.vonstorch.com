import type { Cell, PlacedTile, Tile } from "./types";

// Here, not in lib/schemas/mark.ts: the shell loads this file on every page, and that one brings Zod.
export const MOTIF_SIDE = 4;

function wrap(value: number) {
  return ((value % MOTIF_SIDE) + MOTIF_SIDE) % MOTIF_SIDE;
}

/** The index (0–15) of the motif tile that a grid cell shows when the motif repeats from `origin`. */
export function motifIndex({ row, col }: Cell, origin: Cell): number {
  return wrap(row - origin.row) * MOTIF_SIDE + wrap(col - origin.col);
}

export function buildMotif(
  motif: readonly Tile[],
  cells: readonly Cell[],
  origin: Cell,
): PlacedTile[] {
  return cells.map((cell) => ({ ...motif[motifIndex(cell, origin)], ...cell }));
}

import type { Random } from "./random";
import type { Cell, Tile } from "./types";

// A flip folds the tile for 260 ms in CSS; the new content goes in once it is edge-on.
export const SWAP_DELAY_MS = 270;
export const ANIMATION_STEP_MS = 110;

export function waveDelay(cell: Cell, origin: Cell): number {
  return 45 * Math.hypot(cell.row - origin.row, cell.col - origin.col);
}

export function idleGap(random: Random): number {
  return 450 + random() * 500;
}

export function idleTurn(random: Random): number {
  return random() < 0.8 ? 90 : 180;
}

export function hoverTurns(
  cells: readonly Cell[],
  index: number,
  random: Random,
): number[] {
  const { row, col } = cells[index];
  return cells.flatMap((cell, i) => {
    const distance = Math.abs(cell.row - row) + Math.abs(cell.col - col);
    return distance === 0 || (distance === 1 && random() < 0.35) ? [i] : [];
  });
}

export function pulseScale(distance: number, seconds: number): number {
  const wave = 0.5 + 0.5 * Math.sin(distance * 1.1 - seconds * 2.6);
  return Math.round((0.18 + 0.82 * wave) * 1000) / 1000;
}

export function swapColors<T extends Tile>(tile: T): T {
  const fg2 = tile.fg2 ?? tile.fg;
  return {
    ...tile,
    bg: tile.fg,
    fg: tile.bg,
    fg2: fg2 === tile.bg ? tile.fg : fg2,
  };
}

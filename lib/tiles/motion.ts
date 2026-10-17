import type { Random } from "./random";
import type { Cell, Tile } from "./types";

export const SWAP_DELAY_MS = 270;
export const ANIMATION_STEP_MS = 110;

export const RIPPLE_KEYFRAMES: Keyframe[] = [{ scale: 0.83 }, { scale: 0.26 }];
export const RIPPLE_TIMING = {
  duration: 1200,
  direction: "alternate",
  easing: "ease-in-out",
  iterations: Number.POSITIVE_INFINITY,
} satisfies KeyframeAnimationOptions;
export const RIPPLE_PERIOD_MS = 2 * RIPPLE_TIMING.duration;

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

export function swapColors<T extends Tile>(tile: T): T {
  const fg2 = tile.fg2 ?? tile.fg;
  return {
    ...tile,
    bg: tile.fg,
    fg: tile.bg,
    fg2: fg2 === tile.bg ? tile.fg : fg2,
  };
}

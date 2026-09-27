import {
  hoverTurns,
  idleGap,
  idleTurn,
  PULSE_INTERVAL_MS,
  pulseScale,
  SWAP_DELAY_MS,
  swapColors,
  waveDelay,
} from "@/lib/tiles/motion";
import { SYMMETRIC_SHAPES } from "@/lib/tiles/shapes";
import type { Cell, PlacedTile } from "@/lib/tiles/types";

export type TileView = PlacedTile & { folded?: boolean };

export type Motion = { waves: boolean; turns: boolean; idle: boolean };

const WAITING = 0;
const FOLDED = 1;
const DONE = 2;

type Wave = {
  start: number;
  next: readonly PlacedTile[];
  delays: number[];
  stages: Uint8Array;
};

// The frame loop reads and writes tiles synchronously, so they live here and React renders snapshots.
export function createTileEngine() {
  let tiles: readonly TileView[] = [];
  let wave: Wave | null = null;
  let flips: { index: number; at: number }[] = [];
  let motion: Motion = { waves: false, turns: false, idle: false };
  let nextIdleAt = 0;
  let lastPulseAt = 0;
  let frame = 0;
  const listeners = new Set<() => void>();

  function commit(next: readonly TileView[]) {
    tiles = next;
    for (const listener of listeners) listener();
  }

  function run() {
    if (frame === 0 && (wave || flips.length > 0 || motion.idle)) {
      frame = requestAnimationFrame(tick);
    }
  }

  function tick(now: number) {
    frame = 0;
    const changes = new Map<number, TileView>();
    const get = (index: number) => changes.get(index) ?? tiles[index];

    if (wave) {
      let done = true;
      for (let i = 0; i < wave.next.length; i++) {
        const elapsed = now - wave.start - wave.delays[i];
        if (wave.stages[i] === WAITING && elapsed >= 0) {
          changes.set(i, { ...get(i), folded: true });
          wave.stages[i] = FOLDED;
        }
        if (wave.stages[i] === FOLDED && elapsed >= SWAP_DELAY_MS) {
          changes.set(i, wave.next[i]);
          wave.stages[i] = DONE;
        }
        if (wave.stages[i] !== DONE) done = false;
      }
      if (done) wave = null;
    } else {
      if (motion.idle && now - lastPulseAt >= PULSE_INTERVAL_MS) {
        lastPulseAt = now;
        tiles.forEach((tile, i) => {
          if (tile.pulseDistance === undefined) return;
          changes.set(i, {
            ...tile,
            scale: pulseScale(tile.pulseDistance, now / 1000),
          });
        });
      }
      if (motion.idle && now >= nextIdleAt) {
        nextIdleAt = now + idleGap(Math.random);
        const index = Math.floor(Math.random() * tiles.length);
        const tile = get(index);
        if (SYMMETRIC_SHAPES.has(tile.shape)) {
          changes.set(index, { ...tile, folded: true });
          flips.push({ index, at: now + SWAP_DELAY_MS });
        } else {
          changes.set(index, {
            ...tile,
            rot: tile.rot + idleTurn(Math.random),
          });
        }
      }
      flips = flips.filter(({ index, at }) => {
        if (now < at) return true;
        changes.set(index, { ...swapColors(get(index)), folded: false });
        return false;
      });
    }

    if (changes.size > 0) {
      const next = [...tiles];
      for (const [index, tile] of changes) next[index] = tile;
      commit(next);
    }
    run();
  }

  function show(next: readonly PlacedTile[], origin: Cell) {
    flips = [];
    const first = tiles.length === 0;
    const sameCells =
      next.length === tiles.length &&
      next.every(
        (tile, i) => tile.row === tiles[i].row && tile.col === tiles[i].col,
      );
    if (!motion.waves || !(first || sameCells)) {
      wave = null;
      commit(next);
    } else {
      if (first) commit(next.map((tile) => ({ ...tile, folded: true })));
      wave = {
        start: performance.now(),
        next,
        delays: next.map((tile) => waveDelay(tile, origin)),
        stages: new Uint8Array(next.length).fill(first ? FOLDED : WAITING),
      };
    }
    run();
  }

  function turn(index: number) {
    if (!motion.turns || wave) return;
    const next = [...tiles];
    for (const i of hoverTurns(tiles, index, Math.random)) {
      next[i] = { ...next[i], rot: next[i].rot + 90 };
    }
    commit(next);
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getTiles: () => tiles,
    isBusy: () => wave !== null,
    show,
    turn,
    setMotion(next: Motion) {
      motion = next;
      run();
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

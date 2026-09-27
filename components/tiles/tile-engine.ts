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

function cellKey({ row, col }: Cell) {
  return `${row},${col}`;
}

// Rotation only grows, so a change from 270° to 0° shows as a quarter turn forward, not three back.
function turnForward(tile: PlacedTile, shown: TileView | undefined): TileView {
  if (!shown) return tile;
  return {
    ...tile,
    rot: shown.rot + ((((tile.rot - shown.rot) % 360) + 360) % 360),
  };
}

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

  /** With an origin the tiles flip over in a wave from it; without one they change in place. */
  function show(next: readonly PlacedTile[], origin?: Cell) {
    flips = [];
    const shown = new Map(tiles.map((tile) => [cellKey(tile), tile]));
    if (!origin || !motion.waves) {
      wave = null;
      commit(next.map((tile) => turnForward(tile, shown.get(cellKey(tile)))));
    } else {
      // A cell without a tile yet (the first show, or the cells behind the title block) unfolds from nothing.
      commit(
        next.map(
          (tile) => shown.get(cellKey(tile)) ?? { ...tile, folded: true },
        ),
      );
      wave = {
        start: performance.now(),
        next,
        delays: next.map((tile) => waveDelay(tile, origin)),
        stages: Uint8Array.from(next, (tile) =>
          shown.has(cellKey(tile)) ? WAITING : FOLDED,
        ),
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

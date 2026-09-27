export type Random = () => number;

// mulberry32: a few lines, and random enough for picking tile colors.
export function createRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 32);
}

export function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

export function pickOther<T>(random: Random, items: readonly T[], other: T): T {
  let item = pick(random, items);
  while (item === other) item = pick(random, items);
  return item;
}

export function quarterTurn(random: Random): number {
  return Math.floor(random() * 4) * 90;
}

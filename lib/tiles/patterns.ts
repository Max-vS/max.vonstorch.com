import { panelRect } from "./grid";
import { pulseScale } from "./motion";
import {
  contactColors as contact,
  cvColors as cv,
  dryftColors as dryft,
  educationColors as education,
  indexColors as index,
  musicColors as music,
  notFoundColors as notFound,
  writingColors as writing,
} from "./palettes";
import {
  createRandom,
  pick,
  pickOther,
  quarterTurn,
  type Random,
} from "./random";
import type {
  Cell,
  Grid,
  Pattern,
  PatternInput,
  PlacedTile,
  SceneId,
  Tile,
} from "./types";

function blockTile(
  { row, col, blocks }: PatternInput,
  create: () => Tile,
): Tile {
  const key = `${row >> 1},${col >> 1}`;
  let tile = blocks.get(key);
  if (!tile) {
    tile = create();
    blocks.set(key, tile);
  }
  return tile;
}

/** The item at `index` in a list that repeats in both directions. */
function cycle<T>(items: readonly T[], index: number): T {
  return items[((index % items.length) + items.length) % items.length];
}

const INDEX_COLORS = [
  index.red,
  index.blue,
  index.yellow,
  index.sage,
  index.ink,
  index.ground,
  index.pink,
];

const EDUCATION_BANDS = [
  education.ground,
  education.cream,
  education.yellow,
  education.ochre,
  education.yellow,
  education.cream,
];

const WRITING_BANDS = [
  writing.ground,
  writing.sage,
  writing.forest,
  writing.ink,
  writing.forest,
  writing.sage,
];

const INTERFERENCE_COLORS = [
  music.ground,
  music.peach,
  music.tangerine,
  music.rust,
  music.ink,
];

// Turns each tile of a 2×2 block so that the four L shapes frame the block.
const BLOCK_TURNS = [
  [0, 90],
  [270, 180],
];

// A quarter disc filling one 60×60 quarter of a tile, for each clockwise quarter turn: its corner, then the path from there.
const QUARTER_DISCS = [
  [0, 0, "h60a60 60 0 0 1 -60 60z"],
  [60, 0, "v60a60 60 0 0 1 -60 -60z"],
  [60, 60, "h-60a60 60 0 0 1 60 -60z"],
  [0, 60, "v-60a60 60 0 0 1 60 60z"],
] as const;

const QUARTERS = [
  [0, 0],
  [60, 0],
  [0, 60],
  [60, 60],
] as const;

function threeColors(random: Random, colors: readonly string[]) {
  const bg = pick(random, colors);
  const fg = pickOther(random, colors, bg);
  let fg2 = pickOther(random, colors, bg);
  while (fg2 === fg) fg2 = pickOther(random, colors, bg);
  return { bg, fg, fg2 };
}

/** Four quarter discs, each turned at random and drawn in fg or fg2. */
function mosaicShape(random: Random) {
  let fill = "";
  let fill2 = "";
  for (const [x, y] of QUARTERS) {
    const [dx, dy, path] = QUARTER_DISCS[Math.floor(random() * 4)];
    const disc = `M${x + dx} ${y + dy}${path}`;
    if (random() < 0.5) fill += disc;
    else fill2 += disc;
  }
  return { fill, fill2 };
}

/** Vertical bars of 1–3 units with gaps of 1–2 units, where a unit is a tenth of the tile. */
function barsShape(random: Random) {
  let fill = "";
  for (let x = 0; x < 120; ) {
    const width = Math.min(12 * (1 + Math.floor(random() * 3)), 120 - x);
    fill += `M${x} 0H${x + width}V120H${x}Z`;
    x += width + 12 * (1 + Math.floor(random() * 2));
  }
  return { fill };
}

function interferenceBand({ row, col }: Cell, seconds: number) {
  const wave =
    Math.sin(col * 0.55 + seconds * 0.9) +
    Math.sin(row * 0.7 - seconds * 0.6) +
    Math.sin((col + row) * 0.35 + seconds * 0.4);
  const band = Math.floor(((wave + 3) / 6) * INTERFERENCE_COLORS.length);
  return Math.max(0, Math.min(INTERFERENCE_COLORS.length - 1, band));
}

function interferenceColors(cell: Cell, seconds: number) {
  const band = interferenceBand(cell, seconds);
  return {
    bg: INTERFERENCE_COLORS[band],
    fg: cycle(INTERFERENCE_COLORS, band + 1),
  };
}

function panelDistance({ row, col }: Cell, grid: Grid) {
  const panel = panelRect(grid);
  return Math.hypot(
    col - (panel.col + panel.cols / 2),
    row - (panel.row + panel.rows / 2),
  );
}

const bauhaus: Pattern = {
  name: "Bauhaus",
  tile: ({ random }) => {
    const bg = pick(random, INDEX_COLORS);
    const fg = pickOther(random, INDEX_COLORS, bg);
    const shape = pick(random, [
      "qdisc",
      "qdisc",
      "half",
      "half",
      "dot",
      "tri",
      "qring",
      "qring",
      "halves",
    ] as const);
    return { shape, rot: quarterTurn(random), bg, fg };
  },
};

export const PATTERNS: Record<SceneId, readonly Pattern[]> = {
  index: [
    bauhaus,
    {
      name: "Mosaic",
      tile: ({ random }) => ({
        ...threeColors(random, INDEX_COLORS),
        shape: mosaicShape(random),
        rot: 0,
      }),
    },
    {
      name: "Halves",
      tile: ({ random }) => ({
        ...threeColors(random, INDEX_COLORS),
        shape: "halfsq",
        rot: quarterTurn(random),
      }),
    },
  ],
  education: [
    {
      name: "Waves",
      tile: ({ row, col }) => {
        const up = col % 2 === 1;
        return {
          shape: "half",
          rot: up ? 180 : 0,
          bg: cycle(EDUCATION_BANDS, row),
          fg: cycle(EDUCATION_BANDS, up ? row + 1 : row - 1),
        };
      },
    },
    {
      name: "Routes",
      tile: ({ random }) => ({
        shape: "arc",
        rot: random() < 0.5 ? 0 : 90,
        bg: education.ground,
        fg: education.ink,
      }),
    },
    {
      name: "Ascent",
      tile: ({ row, col }) => ({
        shape: "tri",
        rot: 0,
        bg: cycle(EDUCATION_BANDS, row + col + 1),
        fg: cycle(EDUCATION_BANDS, row + col),
      }),
    },
  ],
  projects: [
    {
      name: "Wedges",
      tile: ({ random }) => {
        const bg = pick(random, [dryft.ground, dryft.tint, dryft.deep]);
        const fg =
          bg === dryft.deep
            ? dryft.blue
            : pick(random, [dryft.blue, dryft.deep]);
        return {
          shape: "wedge",
          rot: quarterTurn(random),
          bg,
          fg,
          fg2: bg === dryft.ground ? dryft.tint : dryft.ground,
        };
      },
    },
    {
      name: "Matrix",
      tile: ({ random }) => {
        const x = random();
        return x < 0.12
          ? { shape: "dots4", rot: 0, bg: dryft.blue, fg: dryft.ground }
          : {
              shape: "dots4",
              rot: 0,
              bg: dryft.deep,
              fg: x < 0.3 ? dryft.blue : dryft.tint,
            };
      },
    },
    {
      name: "Machine",
      tile: ({ row, col, random }) => {
        if ((row + col) % 2 === 0) {
          return {
            shape: "ring",
            rot: 0,
            bg: dryft.tint,
            fg: dryft.deep,
            fg2: dryft.blue,
          };
        }
        const shape = pick(random, ["cross", "squares", "squares"] as const);
        return {
          shape,
          rot: 0,
          bg: dryft.ground,
          fg: shape === "cross" ? dryft.blue : dryft.deep,
          fg2: dryft.tint,
        };
      },
    },
  ],
  writing: [
    {
      name: "Triangles",
      tile: ({ random }) => {
        const colors = [
          writing.ground,
          writing.sage,
          writing.forest,
          writing.clay,
        ];
        const bg = pick(random, colors);
        const fg = pickOther(random, colors, bg);
        return { shape: "tri", rot: quarterTurn(random), bg, fg };
      },
    },
    {
      name: "Squares",
      tile: ({ row, col }) => {
        const colors = [
          writing.ground,
          writing.sage,
          writing.forest,
          writing.ink,
          writing.clay,
        ];
        return {
          shape: "squares",
          rot: 0,
          bg: cycle(colors, col + row),
          fg: cycle(colors, col + row + 1),
          fg2: cycle(colors, col + row + 2),
        };
      },
    },
    {
      name: "Hills",
      tile: ({ row, col }) => ({
        shape: "qdisc",
        rot: (row + col) % 2 === 0 ? 180 : 270,
        bg: cycle(WRITING_BANDS, row),
        fg: cycle(WRITING_BANDS, row + 1),
      }),
    },
  ],
  music: [
    {
      name: "Records",
      tile: ({ random }) => {
        const bg = pick(random, [music.ground, music.ground, music.peach]);
        const rot = quarterTurn(random);
        const fg2 = pick(random, [music.ink, music.rust]);
        return { shape: "split", rot, bg, fg: music.tangerine, fg2 };
      },
    },
    {
      name: "Dots",
      tile: ({ random }) => {
        const rot = quarterTurn(random);
        const bg = pick(random, [music.ground, music.ground, music.peach]);
        const fg = pick(random, [
          music.tangerine,
          music.tangerine,
          music.ink,
          music.rust,
        ]);
        return { shape: "offdot", rot, bg, fg };
      },
    },
    {
      name: "Interference",
      tile: (cell) => ({
        ...interferenceColors(cell, 0),
        shape: "dot",
        rot: 0,
        scale: 0.45,
      }),
      // Only a tile whose band changes gets a new object, so the other tiles skip the render.
      animate: (tile, seconds) => {
        const colors = interferenceColors(tile, seconds);
        return colors.bg === tile.bg ? null : colors;
      },
      idle: false,
    },
  ],
  cv: [
    {
      name: "Pinwheel",
      tile: (input) =>
        blockTile(input, () => {
          const x = input.random();
          const [bg, fg] =
            x < 0.3
              ? [cv.chartreuse, cv.black]
              : x < 0.5
                ? [cv.black, cv.chartreuse]
                : x < 0.75
                  ? [cv.paper, cv.black]
                  : [cv.white, cv.black];
          return { shape: "pin", rot: 0, bg, fg };
        }),
    },
    {
      name: "Blocks",
      tile: (input) => {
        const block = blockTile(input, () => {
          const x = input.random();
          const [bg, fg] =
            x < 0.4
              ? [cv.white, cv.black]
              : x < 0.7
                ? [cv.chartreuse, cv.black]
                : [cv.black, cv.chartreuse];
          return { shape: "lshape", rot: 0, bg, fg };
        });
        return { ...block, rot: BLOCK_TURNS[input.row % 2][input.col % 2] };
      },
    },
    {
      name: "Bars",
      tile: ({ random }) => ({
        shape: barsShape(random),
        rot: 0,
        bg: random() < 0.5 ? cv.white : cv.paper,
        fg: random() < 0.15 ? cv.chartreuse : cv.black,
      }),
    },
  ],
  contact: [
    {
      name: "Pulse",
      tile: ({ row, col }) => ({
        shape: "dot",
        rot: 0,
        bg: (row + col) % 2 ? contact.ground : contact.blush,
        fg: contact.terracotta,
      }),
      // The wave starts at the panel, wherever the grid puts it.
      animate: (tile, seconds, grid) => ({
        scale: pulseScale(panelDistance(tile, grid), seconds),
      }),
    },
    {
      name: "Speech",
      tile: ({ random }) => {
        const bg = pick(random, [
          contact.blush,
          contact.ground,
          contact.ground,
        ]);
        const rot = random() < 0.5 ? 0 : 90;
        const fg =
          bg === contact.blush
            ? contact.terracotta
            : pick(random, [contact.terracotta, contact.ink]);
        return {
          shape: "halves",
          rot,
          bg,
          fg,
          fg2: bg === contact.blush ? contact.ink : contact.terracotta,
        };
      },
    },
    {
      name: "Pairs",
      tile: ({ random }) => {
        const bg = pick(random, [
          contact.ground,
          contact.ground,
          contact.blush,
        ]);
        return {
          shape: "pair",
          rot: random() < 0.5 ? 0 : 90,
          bg,
          fg: contact.terracotta,
          fg2:
            bg === contact.blush
              ? contact.ink
              : pick(random, [contact.ink, contact.yellow]),
        };
      },
    },
  ],
  // The empty state; marks replace it once visitors leave some (spec §9).
  community: [bauhaus],
  notFound: [
    {
      name: "Missing",
      tile: ({ random }) => {
        const x = random();
        if (x < 0.22) {
          return {
            shape: "hole",
            rot: 0,
            bg: notFound.ground,
            fg: notFound.stone,
          };
        }
        if (x < 0.31) {
          return {
            shape: "xmark",
            rot: 0,
            bg: notFound.ground,
            fg: pick(random, [notFound.red, notFound.ink]),
          };
        }
        const shape = pick(random, [
          "qdisc",
          "qdisc",
          "half",
          "tri",
          "dot",
          "qring",
          "halves",
        ] as const);
        return {
          shape,
          rot: quarterTurn(random),
          bg: notFound.ground,
          fg: x > 0.62 ? notFound.red : notFound.ink,
          fg2: notFound.ink,
        };
      },
    },
  ],
};

export function buildPattern(
  page: SceneId,
  pattern: number,
  grid: Grid,
  cells: readonly Cell[],
  seed: number,
): PlacedTile[] {
  const { tile } = PATTERNS[page][pattern];
  const random = createRandom(seed);
  const blocks = new Map<string, Tile>();
  return cells.map(({ row, col }) => ({
    ...tile({ row, col, random, blocks, grid }),
    row,
    col,
  }));
}

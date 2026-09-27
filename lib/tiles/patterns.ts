import { panelRect } from "./grid";
import {
  contactColors as contact,
  cvColors as cv,
  dryftColors as dryft,
  educationColors as education,
  indexColors as index,
  musicColors as music,
  writingColors as writing,
} from "./palettes";
import { createRandom, pick, pickOther, quarterTurn } from "./random";
import type {
  Cell,
  Grid,
  PageId,
  Pattern,
  PatternInput,
  PlacedTile,
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

const RING_TURNS = [
  [180, 270],
  [90, 0],
];

const WAVE_BANDS = [
  education.ground,
  education.cream,
  education.yellow,
  education.ochre,
  education.yellow,
  education.cream,
];

function waveBand(row: number) {
  return WAVE_BANDS[((row % 6) + 6) % 6];
}

const bauhaus: Pattern = {
  name: "Bauhaus",
  tile: ({ random }) => {
    const colors = [
      index.red,
      index.blue,
      index.yellow,
      index.sage,
      index.ink,
      index.ground,
      index.pink,
    ];
    const bg = pick(random, colors);
    const fg = pickOther(random, colors, bg);
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

export const PATTERNS: Record<PageId, readonly Pattern[]> = {
  index: [
    bauhaus,
    {
      name: "Rings",
      tile: (input) => {
        const { row, col, random } = input;
        const block = blockTile(input, () => {
          const bg = pick(random, [
            index.ground,
            index.ground,
            index.ink,
            index.pink,
          ]);
          const fg = pickOther(
            random,
            [
              index.red,
              index.blue,
              index.yellow,
              index.sage,
              index.pink,
              index.ink,
            ],
            bg,
          );
          return { shape: "qdisc", rot: random() < 0.3 ? 90 : 0, bg, fg };
        });
        return { ...block, rot: RING_TURNS[row % 2][col % 2] + block.rot };
      },
    },
    {
      name: "Petals",
      tile: ({ row, col }) => {
        const colors = [index.blue, index.red, index.yellow, index.sage];
        return {
          shape: "leaf",
          rot: ((row + col) % 2) * 90,
          bg: row % 2 ? index.ground : index.pink,
          fg: colors[((row >> 1) + (col >> 1)) % 4],
        };
      },
    },
  ],
  education: [
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
      name: "Waves",
      tile: ({ row, col }) => {
        const up = col % 2 === 1;
        return {
          shape: "half",
          rot: up ? 180 : 0,
          bg: waveBand(row),
          fg: waveBand(up ? row + 1 : row - 1),
        };
      },
    },
    {
      name: "Steps",
      tile: ({ row, col }) => ({
        shape: "lshape",
        rot: ((row + col) % 4) * 90,
        bg: row % 2 ? education.cream : education.ground,
        fg: education.ink,
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
      name: "Stripes",
      tile: ({ row, col }) => {
        const dark = (row >> 1) % 2 === 1;
        return {
          shape: "stripes",
          rot: ((row + col) % 2) * 90,
          bg: dark ? dryft.deep : dryft.blue,
          fg: dark ? dryft.blue : dryft.ground,
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
          bg: colors[(col + row) % 5],
          fg: colors[(col + row + 1) % 5],
          fg2: colors[(col + row + 2) % 5],
        };
      },
    },
    {
      name: "Arcs",
      tile: ({ random }) => {
        const bg = random() < 0.35 ? writing.sage : writing.ground;
        const rot = quarterTurn(random);
        const fg =
          bg === writing.sage
            ? writing.forest
            : pick(random, [writing.forest, writing.ink, writing.ink]);
        return { shape: "qring", rot, bg, fg };
      },
    },
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
      name: "Chevrons",
      tile: ({ row, col }) => {
        const odd = row % 2 === 1;
        const colors = odd
          ? [music.tangerine, music.rust, music.peach]
          : [music.ink, music.tangerine, music.peach];
        return {
          shape: "chev",
          rot: odd ? 180 : 0,
          bg: odd ? music.ink : music.ground,
          fg: colors[(col + row) % 3],
        };
      },
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
      name: "Frames",
      tile: (input) => {
        const block = blockTile(input, () => {
          const x = input.random();
          const [bg, fg] =
            x < 0.35
              ? [cv.paper, cv.black]
              : x < 0.7
                ? [cv.chartreuse, cv.black]
                : [cv.black, cv.chartreuse];
          return { shape: "frame", rot: 0, bg, fg };
        });
        return { ...block, rot: quarterTurn(input.random) };
      },
    },
    {
      name: "Moons",
      tile: ({ row, col }) => {
        const dark = ((row >> 1) + (col >> 1)) % 2 === 1;
        return {
          shape: "moon",
          rot: ((row + col) % 4) * 90,
          bg: dark ? cv.black : cv.white,
          fg: dark ? cv.chartreuse : cv.black,
        };
      },
    },
  ],
  contact: [
    {
      name: "Pulse",
      tile: ({ row, col, grid }) => {
        const panel = panelRect(grid);
        return {
          shape: "dot",
          rot: 0,
          bg: (row + col) % 2 ? contact.ground : contact.blush,
          fg: contact.terracotta,
          pulseDistance: Math.hypot(
            col - (panel.col + panel.cols / 2),
            row - (panel.row + panel.rows / 2),
          ),
        };
      },
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
      name: "Confetti",
      tile: ({ random }) => {
        const bg = pick(random, [
          contact.ground,
          contact.ground,
          contact.blush,
        ]);
        const fg = pickOther(
          random,
          [contact.terracotta, contact.blush, contact.ink, contact.yellow],
          bg,
        );
        const shape = pick(random, [
          "dots4",
          "diamond",
          "half",
          "dot",
        ] as const);
        return { shape, rot: quarterTurn(random), bg, fg, fg2: bg };
      },
    },
  ],
  // The empty state; marks replace it once visitors leave some (spec §9).
  community: [bauhaus],
};

export function buildPattern(
  page: PageId,
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

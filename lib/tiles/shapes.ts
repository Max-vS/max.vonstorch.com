export type Shape = { fill?: string; fill2?: string; stroke?: string };

// Motifs from the design in a 120×120 box: `fill` takes the tile's fg, `fill2` its fg2, `stroke` its fg.
export const SHAPES = {
  qdisc: { fill: "M0 0H120A120 120 0 0 1 0 120Z" },
  half: { fill: "M0 0H120A60 60 0 0 1 0 0Z" },
  halves: {
    fill: "M0 0H120A60 60 0 0 1 0 0Z",
    fill2: "M0 120H120A60 60 0 0 0 0 120Z",
  },
  dot: { fill: "M14 60a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z" },
  tri: { fill: "M0 0L120 0L0 120Z" },
  qring: { fill: "M100 0A100 100 0 0 1 0 100L0 62A62 62 0 0 0 62 0Z" },
  leaf: { fill: "M0 120A120 120 0 0 1 120 0A120 120 0 0 1 0 120Z" },
  arc: { stroke: "M60 0A60 60 0 0 1 0 60M120 60A60 60 0 0 0 60 120" },
  lshape: { fill: "M0 0H44V76H120V120H0Z" },
  wedge: {
    fill: "M0 0H120A120 120 0 0 1 0 120Z",
    fill2: "M0 0H60A60 60 0 0 1 0 60Z",
  },
  stripes: {
    fill: "M0 0L30 0L0 30ZM60 0L90 0L0 90L0 60ZM120 0L120 30L30 120L0 120ZM120 60L120 90L90 120L60 120Z",
  },
  ring: {
    fill: "M10 60a50 50 0 1 0 100 0a50 50 0 1 0 -100 0ZM28 60a32 32 0 1 0 64 0a32 32 0 1 0 -64 0Z",
    fill2: "M46 60a14 14 0 1 0 28 0a14 14 0 1 0 -28 0Z",
  },
  cross: { fill: "M48 16h24v32h32v24h-32v32h-24v-32h-32v-24h32z" },
  squares: { fill: "M14 14h92v92h-92z", fill2: "M38 38h44v44h-44z" },
  split: {
    fill: "M60 12A48 48 0 0 0 60 108Z",
    fill2: "M60 12A48 48 0 0 1 60 108Z",
  },
  offdot: { fill: "M9 34a25 25 0 1 0 50 0a25 25 0 1 0 -50 0Z" },
  chev: { fill: "M0 0H40L100 60L40 120H0L60 60Z" },
  pin: {
    fill: "M0 0H60L60 60ZM120 0V60L60 60ZM120 120H60L60 60ZM0 120V60L60 60Z",
  },
  frame: {
    fill: "M0 0H120V24H24V120H0ZM48 48H120V72H72V120H48ZM96 96H120V120H96Z",
  },
  moon: { fill: "M75 10A50 50 0 1 0 75 110A72.5 72.5 0 0 1 75 10Z" },
  dots4: {
    fill: "M13 30a17 17 0 1 0 34 0a17 17 0 1 0 -34 0ZM73 30a17 17 0 1 0 34 0a17 17 0 1 0 -34 0ZM13 90a17 17 0 1 0 34 0a17 17 0 1 0 -34 0ZM73 90a17 17 0 1 0 34 0a17 17 0 1 0 -34 0Z",
  },
  diamond: {
    fill: "M60 8L112 60L60 112L8 60Z",
    fill2: "M60 36L84 60L60 84L36 60Z",
  },
  none: {},
} satisfies Record<string, Shape>;

export type ShapeKey = keyof typeof SHAPES;

// A quarter turn would not show on these, so idle flips their colors instead.
export const SYMMETRIC_SHAPES: ReadonlySet<ShapeKey> = new Set([
  "dot",
  "ring",
  "squares",
  "cross",
  "diamond",
  "dots4",
  "pin",
]);

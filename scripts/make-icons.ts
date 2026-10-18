// `bun scripts/make-icons.ts` writes app/favicon.ico, app/icon.png and app/apple-icon.png; commit them.
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import { tilePaths } from "@/components/tiles/tile-paths";
import { indexColors } from "@/lib/tiles/palettes";

const { ink, ground, red, blue, yellow } = indexColors;

// Design "F5 · Leaf": four quarter discs, read row by row.
const LEAF = [
  { bg: blue, fg: yellow, rot: 180 },
  { bg: red, fg: ground, rot: 0 },
  { bg: ink, fg: red, rot: 0 },
  { bg: yellow, fg: ink, rot: 180 },
];

async function png(size: number) {
  const leaf = h(
    "svg",
    { width: size, height: size, viewBox: "0 0 240 240" },
    LEAF.map(({ bg, fg, rot }, i) =>
      h(
        "g",
        {
          key: i,
          transform: `translate(${(i % 2) * 120} ${Math.floor(i / 2) * 120}) rotate(${rot} 60 60)`,
        },
        h("rect", { width: 120, height: 120, fill: bg }),
        tilePaths({ shape: "qdisc", fg }),
      ),
    ),
  );
  const image = new ImageResponse(
    h("div", { style: { display: "flex" } }, leaf),
    { width: size, height: size },
  );
  return Buffer.from(await image.arrayBuffer());
}

function ico(png: Buffer, size: number) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, png]);
}

await writeFile("app/favicon.ico", ico(await png(48), 48));
await writeFile("app/icon.png", await png(512));
await writeFile("app/apple-icon.png", await png(180));

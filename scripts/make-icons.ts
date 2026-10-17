// `bun scripts/make-icons.ts` writes app/favicon.ico, app/icon.png and app/apple-icon.png; commit them.
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import { tilePaths } from "@/components/tiles/tile-paths";
import { indexColors } from "@/lib/tiles/palettes";

async function png(size: number) {
  const tile = h(
    "svg",
    { width: size, height: size, viewBox: "0 0 120 120" },
    h("rect", { width: 120, height: 120, fill: indexColors.ink }),
    tilePaths({ shape: "qdisc", fg: indexColors.red }),
  );
  const image = new ImageResponse(
    h("div", { style: { display: "flex" } }, tile),
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

// Run once with `bun scripts/make-icons.ts` and commit the app/favicon.ico, app/icon.png and app/apple-icon.png it writes.
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import { tilePaths } from "@/components/tiles/tile-paths";
import { indexColors } from "@/lib/tiles/palettes";

// next/og already renders the share images, so the icons need no image library either.
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

// An ICO can hold a PNG as is, behind a 6-byte header (type 1, one image) and a 16-byte entry (width, height, 1 plane, 32 bits per pixel, PNG size and offset).
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

// Google Search asks for a favicon of at least 48 px.
await writeFile("app/favicon.ico", ico(await png(48), 48));
await writeFile("app/icon.png", await png(512));
await writeFile("app/apple-icon.png", await png(180));

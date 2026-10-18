import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { SitePage } from "@/content/site";
import { titleColors } from "@/lib/tiles/palettes";
import { buildPattern } from "@/lib/tiles/patterns";
import type { Cell, Grid } from "@/lib/tiles/types";
import { tilePaths } from "./tiles/tile-paths";

export const shareImageSize = { width: 1200, height: 630 };

// Familjen Grotesk Bold, SIL Open Font License 1.1 (lib/fonts/OFL.txt).
const font = await readFile(
  join(process.cwd(), "lib/fonts/familjen-grotesk-bold.ttf"),
);

const TILE = 105;
const PX = TILE / 90;
const COLS = Math.ceil(shareImageSize.width / TILE);
const ROWS = Math.ceil(shareImageSize.height / TILE);
const CUT_X = COLS * TILE - shareImageSize.width;
const CUT_Y = ROWS * TILE - shareImageSize.height;
const GRID: Grid = {
  mobile: false,
  cols: COLS,
  rows: ROWS,
  titleCols: 8,
  titleRows: 3,
  firstFullRow: CUT_Y > 0 ? 1 : 0,
  firstFullCol: CUT_X > 0 ? 1 : 0,
};
const CELLS: Cell[] = Array.from({ length: ROWS * COLS }, (_, index) => ({
  row: Math.floor(index / COLS),
  col: index % COLS,
}));
const SEED = 1;

const BLOCK_WIDTH = GRID.titleCols * TILE - CUT_X;
const BLOCK_HEIGHT = GRID.titleRows * TILE - CUT_Y;
const PADDING_X = 30 * PX;
const PADDING_Y = 26 * PX;
const KICKER_SIZE = 22;
const TITLE_WIDTH = BLOCK_WIDTH - 2 * PADDING_X;
const TITLE_HEIGHT = BLOCK_HEIGHT - 2 * PADDING_Y - 2 * KICKER_SIZE;

function titleSize(title: string, designSize: number) {
  const longestWord = Math.max(...title.split(" ").map(({ length }) => length));
  return Math.min(
    designSize * PX,
    TITLE_WIDTH / (0.55 * longestWord),
    Math.sqrt((TITLE_WIDTH * TITLE_HEIGHT) / (0.7 * title.length)),
  );
}

type ShareImagePage = Pick<SitePage, "id" | "kicker" | "title">;

export function shareImageAlt({ kicker, title }: ShareImagePage) {
  return kicker ? `${title}, ${kicker}` : title;
}

export function shareImage({ id, kicker, title }: ShareImagePage) {
  const colors = titleColors[id];
  const { width, height } = shareImageSize;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "Familjen Grotesk",
      }}
    >
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {buildPattern(id, 0, GRID, CELLS, SEED).map((tile) => (
          <g
            key={`${tile.row}-${tile.col}`}
            transform={`translate(${tile.col * TILE - CUT_X} ${tile.row * TILE - CUT_Y}) scale(${TILE / 120}) rotate(${tile.rot} 60 60)`}
          >
            <rect width={120} height={120} fill={tile.bg} />
            {tilePaths(tile)}
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: kicker ? "space-between" : "flex-end",
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          overflow: "hidden",
          backgroundColor: colors.bg,
          color: colors.fg,
        }}
      >
        {kicker ? (
          <div
            style={{
              fontSize: KICKER_SIZE,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontSize: titleSize(title, id === "index" ? 104 : 132),
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    {
      ...shareImageSize,
      fonts: [
        { name: "Familjen Grotesk", data: font, weight: 700, style: "normal" },
      ],
    },
  );
}

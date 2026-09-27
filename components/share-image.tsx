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

// Larger than on screen, so the title still reads in a small link preview.
const TILE = 105;
// The design's sizes are in pixels at a 90 px tile.
const PX = TILE / 90;
const COLS = Math.ceil(shareImageSize.width / TILE);
const ROWS = Math.ceil(shareImageSize.height / TILE);
// As on screen, the grid is anchored bottom right, so the cut tiles are at the left and top.
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
// A fixed seed gives a page the same pattern on every build.
const SEED = 1;

const BLOCK_WIDTH = GRID.titleCols * TILE - CUT_X;
const BLOCK_HEIGHT = GRID.titleRows * TILE - CUT_Y;
const PADDING_X = 30 * PX;
const PADDING_Y = 26 * PX;
// Bigger than the design's 12 px, which would not read in a link preview.
const KICKER_SIZE = 22;
// The room for the title: the block minus its padding and the kicker's line and gap.
const TITLE_WIDTH = BLOCK_WIDTH - 2 * PADDING_X;
const TITLE_HEIGHT = BLOCK_HEIGHT - 2 * PADDING_Y - 2 * KICKER_SIZE;

// The renderer wraps text but never shrinks it, so a long post title gets a smaller size from its length.
function titleSize(title: string, designSize: number) {
  const longestWord = Math.max(...title.split(" ").map(({ length }) => length));
  return Math.min(
    designSize * PX,
    // The longest word stays on one line, at about 0.55 em per character.
    TITLE_WIDTH / (0.55 * longestWord),
    // All lines fit, at about 0.7 em² per character with word wrap.
    Math.sqrt((TITLE_WIDTH * TITLE_HEIGHT) / (0.7 * title.length)),
  );
}

type ShareImagePage = Pick<SitePage, "id" | "kicker" | "title">;

/** The image's words; the pattern behind them is decoration. */
export function shareImageAlt({ kicker, title }: ShareImagePage) {
  return `${title} — ${kicker}`;
}

/** A page's title block over its first pattern, as on the desktop site. */
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
          justifyContent: "space-between",
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          overflow: "hidden",
          backgroundColor: colors.bg,
          color: colors.fg,
        }}
      >
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

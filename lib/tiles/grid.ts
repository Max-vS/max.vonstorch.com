import { MOTIF_SIDE } from "./motif";
import type { Cell, Grid } from "./types";

export type GridMetrics = Grid & {
  tile: number;
  titleWidth: number;
  titleHeight: number;
  indicatorWidth: number;
};

type Rect = Cell & { rows: number; cols: number };

// measureGrid and setGridVariables use no outside names: the root layout inlines their source as the pre-paint script.
export function measureGrid(
  width: number,
  height: number,
  pixelRatio: number,
): GridMetrics {
  const mobile = width < 640;
  const fluid = mobile
    ? width / 6
    : Math.min(120, Math.max(64, Math.min(width / 16, height / 10)));
  // Chrome places a tile's box at device pixels but its SVG at whole CSS pixels, so only a size whole in both leaves no hairlines (the closest within 10 px, else whole CSS pixels).
  const whole = Math.ceil(fluid - 1e-9);
  const tile =
    Array.from({ length: 10 }, (_, step) => whole + step).find((size) =>
      Number.isInteger(Math.round(size * pixelRatio * 1000) / 1000),
    ) ?? whole;
  // The epsilon stops float error from adding a track when the tile divides the length exactly.
  const cols = mobile ? 6 : Math.ceil(width / tile - 1e-9);
  const rows = Math.ceil(height / tile - 1e-9);
  const cutX = cols * tile - width;
  const cutY = rows * tile - height;
  // A track more than half cut joins the title block and indicator, so they end on a tile edge without losing most of a tile.
  const extraCol = cutX > tile / 2 ? 1 : 0;
  const titleCols = (mobile ? 5 : 8) + extraCol;
  const titleRows = cutY > tile / 2 ? 4 : 3;
  return {
    mobile,
    cols,
    rows,
    titleCols,
    titleRows,
    // A cut under half a pixel does not show, so that track still counts as full.
    firstFullRow: cutY > 0.5 ? 1 : 0,
    firstFullCol: cutX > 0.5 ? 1 : 0,
    tile,
    titleWidth: titleCols * tile - cutX,
    titleHeight: titleRows * tile - cutY,
    indicatorWidth: (3 + extraCol) * tile - cutX,
  };
}

export function setGridVariables({
  tile,
  cols,
  rows,
  titleWidth,
  titleHeight,
  indicatorWidth,
}: GridMetrics) {
  const { style } = document.documentElement;
  style.setProperty("--tile", `${tile}px`);
  style.setProperty("--cols", `${cols}`);
  style.setProperty("--rows", `${rows}`);
  style.setProperty("--title-width", `${titleWidth}px`);
  style.setProperty("--title-height", `${titleHeight}px`);
  style.setProperty("--indicator-width", `${indicatorWidth}px`);
}

function titleRect({ titleCols, titleRows }: Grid): Rect {
  return { row: 0, col: 0, rows: titleRows, cols: titleCols };
}

// The Panel component sizes itself in CSS with the same cell counts.
export function panelRect(grid: Grid): Rect {
  const rows = grid.mobile ? 6 : 4;
  return { row: grid.rows - rows, col: grid.cols - 5, rows, cols: 5 };
}

function contains(rect: Rect, { row, col }: Cell) {
  return (
    row >= rect.row &&
    row < rect.row + rect.rows &&
    col >= rect.col &&
    col < rect.col + rect.cols
  );
}

function overlaps(a: Rect, b: Rect) {
  return (
    a.row < b.row + b.rows &&
    b.row < a.row + a.rows &&
    a.col < b.col + b.cols &&
    b.col < a.col + a.cols
  );
}

/** `behindTitle` keeps the cells under the title block, for a page where it can slide away. */
export function tileCells(grid: Grid, behindTitle = false): Cell[] {
  const title = titleRect(grid);
  const panel = panelRect(grid);
  const cells: Cell[] = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const cell = { row, col };
      if (contains(panel, cell)) continue;
      if (!behindTitle && contains(title, cell)) continue;
      cells.push(cell);
    }
  }
  return cells;
}

/** The first fully visible 4×4 area that the panel and, unless it slid away, the title block leave free. */
export function masterBlock(grid: Grid, titleAway: boolean): Cell | null {
  const panel = panelRect(grid);
  const title = titleRect(grid);
  for (let row = grid.firstFullRow; row + MOTIF_SIDE <= grid.rows; row++) {
    for (let col = grid.firstFullCol; col + MOTIF_SIDE <= grid.cols; col++) {
      const block = { row, col, rows: MOTIF_SIDE, cols: MOTIF_SIDE };
      if (overlaps(block, panel)) continue;
      if (!titleAway && overlaps(block, title)) continue;
      return { row, col };
    }
  }
  return null;
}

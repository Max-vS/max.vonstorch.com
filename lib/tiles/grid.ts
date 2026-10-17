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
export function measureGrid(width: number, height: number): GridMetrics {
  const mobile = width < 640;
  const fluid = mobile
    ? width / 6
    : Math.min(120, Math.max(64, Math.min(width / 16, height / 10)));
  const tile = Math.ceil(fluid - 1e-9);
  const cols = mobile ? 6 : Math.ceil(width / tile - 1e-9);
  const rows = Math.ceil(height / tile - 1e-9);
  const cutX = cols * tile - width;
  const cutY = rows * tile - height;
  const extraCol = cutX > tile / 2 ? 1 : 0;
  const titleCols = (mobile ? 5 : 8) + extraCol;
  const titleRows = cutY > tile / 2 ? 4 : 3;
  return {
    mobile,
    cols,
    rows,
    titleCols,
    titleRows,
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

// Must match the Panel sizes in components/tiles/panel.tsx; paint mode's panel fits its content, at most these rows.
export function panelRect(grid: Grid, painting = false): Rect {
  const rows = painting
    ? Math.min(grid.mobile ? 9 : 8, grid.rows - grid.firstFullRow - MOTIF_SIDE)
    : grid.mobile
      ? 6
      : 4;
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

export function masterBlock(grid: Grid, titleAway: boolean): Cell | null {
  const panel = panelRect(grid, true);
  const title = titleRect(grid);
  let best: Cell | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let row = grid.firstFullRow; row + MOTIF_SIDE <= grid.rows; row++) {
    for (let col = grid.firstFullCol; col + MOTIF_SIDE <= grid.cols; col++) {
      const block = { row, col, rows: MOTIF_SIDE, cols: MOTIF_SIDE };
      if (overlaps(block, panel)) continue;
      if (!titleAway && overlaps(block, title)) continue;
      const distance = Math.hypot(
        row + MOTIF_SIDE / 2 - grid.rows / 2,
        col + MOTIF_SIDE / 2 - grid.cols / 2,
      );
      if (distance < bestDistance) {
        best = { row, col };
        bestDistance = distance;
      }
    }
  }
  return best;
}

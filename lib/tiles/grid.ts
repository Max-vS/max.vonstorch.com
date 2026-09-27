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
  const tile = mobile
    ? width / 6
    : Math.min(120, Math.max(64, Math.min(width / 16, height / 10)));
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

function isCovered(grid: Grid, cell: Cell) {
  return contains(titleRect(grid), cell) || contains(panelRect(grid), cell);
}

export function tileCells(grid: Grid): Cell[] {
  const cells: Cell[] = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (!isCovered(grid, { row, col })) cells.push({ row, col });
    }
  }
  return cells;
}

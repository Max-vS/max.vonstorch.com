import { useSyncExternalStore } from "react";
import { measureGrid, setGridVariables } from "@/lib/tiles/grid";
import type { Grid } from "@/lib/tiles/types";

let current: Grid | null = null;

function subscribe(onChange: () => void) {
  function resize() {
    setGridVariables(measureGrid(window.innerWidth, window.innerHeight));
    onChange();
  }
  resize();
  window.addEventListener("resize", resize);
  return () => window.removeEventListener("resize", resize);
}

function getGrid() {
  const {
    mobile,
    cols,
    rows,
    titleCols,
    titleRows,
    firstFullRow,
    firstFullCol,
  } = measureGrid(window.innerWidth, window.innerHeight);
  if (
    current?.mobile !== mobile ||
    current.cols !== cols ||
    current.rows !== rows ||
    current.titleCols !== titleCols ||
    current.titleRows !== titleRows ||
    current.firstFullRow !== firstFullRow ||
    current.firstFullCol !== firstFullCol
  ) {
    current = {
      mobile,
      cols,
      rows,
      titleCols,
      titleRows,
      firstFullRow,
      firstFullCol,
    };
  }
  return current;
}

export function useGrid() {
  return useSyncExternalStore(subscribe, getGrid, () => null);
}

import { useSyncExternalStore } from "react";
import { measureGrid, setGridVariables } from "@/lib/tiles/grid";
import type { Grid } from "@/lib/tiles/types";

let current: Grid | null = null;

function subscribe(onChange: () => void) {
  function resize() {
    setGridVariables(measureGrid(window.innerWidth, window.innerHeight));
    onChange();
  }
  // The window may have changed since the pre-paint script ran.
  resize();
  window.addEventListener("resize", resize);
  return () => window.removeEventListener("resize", resize);
}

// A new object only when the cell layout changes, so a resize that only scales the tiles keeps the pattern.
function getGrid() {
  const { mobile, cols, rows, titleCols, titleRows } = measureGrid(
    window.innerWidth,
    window.innerHeight,
  );
  if (
    current?.mobile !== mobile ||
    current.cols !== cols ||
    current.rows !== rows ||
    current.titleCols !== titleCols ||
    current.titleRows !== titleRows
  ) {
    current = { mobile, cols, rows, titleCols, titleRows };
  }
  return current;
}

export function useGrid() {
  return useSyncExternalStore(subscribe, getGrid, () => null);
}

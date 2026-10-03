import { useSyncExternalStore } from "react";
import { measureGrid, setGridVariables } from "@/lib/tiles/grid";
import type { Grid } from "@/lib/tiles/types";

let current: Grid | null = null;

function measure() {
  return measureGrid(
    window.innerWidth,
    window.innerHeight,
    window.devicePixelRatio,
  );
}

function subscribe(onChange: () => void) {
  let pixelRatio: MediaQueryList | null = null;
  function update() {
    // A move to a screen with another pixel ratio fires no resize event, only this query.
    pixelRatio?.removeEventListener("change", update);
    pixelRatio = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    pixelRatio.addEventListener("change", update);
    setGridVariables(measure());
    onChange();
  }
  // The window may have changed since the pre-paint script ran.
  update();
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("resize", update);
    pixelRatio?.removeEventListener("change", update);
  };
}

// A new object only when the cell layout changes, so a resize that only scales the tiles keeps the pattern.
function getGrid() {
  const {
    mobile,
    cols,
    rows,
    titleCols,
    titleRows,
    firstFullRow,
    firstFullCol,
  } = measure();
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

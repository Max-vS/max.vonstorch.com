import { createContext, use, useEffect } from "react";
import type { Tile } from "@/lib/tiles/types";
import type { Direction } from "./use-pattern-input";
import type { Corner } from "./use-tile-engine";

export type TileScene =
  | {
      mode: "browse";
      /** A new key flips the tiles over in a wave from `from`. */
      key: string;
      from: Corner;
      /** Repeats over the grid; null shows the page's own pattern. */
      motif: readonly Tile[] | null;
      /** The indicator text; null hides the indicator. */
      label: string | null;
      /** Wheel, swipe and arrow keys call it; null turns them off. */
      step: ((direction: Direction) => void) | null;
    }
  | {
      mode: "paint";
      motif: readonly Tile[];
      label: string;
      /** Gets the motif index (0–15) of the tile a visitor clicks or taps. */
      paint: (index: number) => void;
    };

export const TileSceneContext = createContext<
  (scene: TileScene | null) => void
>(() => {});

/** Lets a page drive the grid while it is mounted. */
export function useTileScene(scene: TileScene) {
  const setScene = use(TileSceneContext);
  useEffect(() => {
    setScene(scene);
    return () => setScene(null);
  }, [setScene, scene]);
}

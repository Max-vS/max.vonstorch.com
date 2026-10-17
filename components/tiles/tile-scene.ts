import { createContext, type ReactNode, use, useEffect } from "react";
import type { Tile } from "@/lib/tiles/types";
import type { Direction } from "./use-pattern-input";
import type { Corner } from "./use-tile-engine";

export type TileScene =
  | {
      mode: "browse";
      key: string;
      from: Corner;
      motif: readonly Tile[] | null;
      label: string | null;
      step: ((direction: Direction) => void) | null;
      action: ReactNode;
    }
  | {
      mode: "paint";
      motif: readonly Tile[];
      label: string;
      paint: (index: number) => void;
    };

export const TileSceneContext = createContext<
  (scene: TileScene | null) => void
>(() => {});

export function useTileScene(scene: TileScene) {
  const setScene = use(TileSceneContext);
  useEffect(() => {
    setScene(scene);
    return () => setScene(null);
  }, [setScene, scene]);
}

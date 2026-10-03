import { useCallback } from "react";
import { RIPPLE_KEYFRAMES, RIPPLE_TIMING } from "@/lib/tiles/motion";
import type { TileView } from "./tile-engine";
import { tilePaths } from "./tile-paths";

export function Tile({ tile, index }: { tile: TileView; index: number }) {
  const { rippleDelay } = tile;
  // Web Animations, not a CSS animation: React listens for `animationiteration` on the root, and that listener makes Chrome update every CSS animation on the main thread each frame.
  const ripple = useCallback(
    (element: HTMLElement | null) => {
      if (
        !element ||
        rippleDelay === undefined ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const animation = element.animate(RIPPLE_KEYFRAMES, {
        ...RIPPLE_TIMING,
        delay: rippleDelay,
      });
      return () => animation.cancel();
    },
    [rippleDelay],
  );
  return (
    <div
      data-tile={index}
      data-instant={tile.instant || undefined}
      className="group overflow-hidden transition-transform duration-260 ease-flip motion-reduce:transition-none"
      style={{
        gridRow: tile.row + 1,
        gridColumn: tile.col + 1,
        backgroundColor: tile.bg,
        transform: tile.folded ? "scaleX(0)" : undefined,
      }}
    >
      {/* Rotation and scale sit on an HTML element, because Chrome runs transitions and animations of SVG elements on the main thread. */}
      <div
        ref={ripple}
        className="size-full transition-transform duration-700 ease-turn group-data-instant:transition-none motion-reduce:transition-none"
        style={{ transform: `rotate(${tile.rot}deg)`, scale: tile.scale }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="block size-full"
        >
          {tilePaths(tile)}
        </svg>
      </div>
    </div>
  );
}

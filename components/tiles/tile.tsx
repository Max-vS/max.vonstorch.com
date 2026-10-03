import type { TileView } from "./tile-engine";
import { tilePaths } from "./tile-paths";

export function Tile({ tile, index }: { tile: TileView; index: number }) {
  return (
    <div
      data-tile={index}
      className="overflow-hidden transition-transform duration-260 ease-flip motion-reduce:transition-none"
      style={{
        gridRow: tile.row + 1,
        gridColumn: tile.col + 1,
        backgroundColor: tile.bg,
        transform: tile.folded ? "scaleX(0)" : undefined,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className="block size-full transition-transform duration-700 ease-turn motion-reduce:transition-none"
        style={{ transform: `rotate(${tile.rot}deg)` }}
      >
        <g
          className="origin-[60px_60px] transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={
            tile.scale === undefined
              ? undefined
              : { transform: `scale(${tile.scale})` }
          }
        >
          {tilePaths(tile)}
        </g>
      </svg>
    </div>
  );
}

import { SHAPES, type Shape } from "@/lib/tiles/shapes";
import type { TileView } from "./tile-engine";

export function Tile({ tile, index }: { tile: TileView; index: number }) {
  const shape: Shape = SHAPES[tile.shape];
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
          {shape.fill && (
            <path d={shape.fill} fill={tile.fg} fillRule="evenodd" />
          )}
          {shape.fill2 && (
            <path
              d={shape.fill2}
              fill={tile.fg2 ?? tile.fg}
              fillRule="evenodd"
            />
          )}
          {shape.stroke && (
            <path
              d={shape.stroke}
              fill="none"
              stroke={tile.fg}
              strokeWidth={16}
            />
          )}
        </g>
      </svg>
    </div>
  );
}

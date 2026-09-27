import { buildMotif, MOTIF_SIDE } from "@/lib/tiles/motif";
import { SHAPES, type Shape } from "@/lib/tiles/shapes";
import type { Tile } from "@/lib/tiles/types";

const TILE = 120;
// Spec §9: the motif shown 2×2, so the owner sees how it repeats.
const SIDE = MOTIF_SIDE * 2;
const CELLS = Array.from({ length: SIDE * SIDE }, (_, i) => ({
  row: Math.floor(i / SIDE),
  col: i % SIDE,
}));

export function MarkPreview({
  tiles,
  className,
}: {
  tiles: readonly Tile[];
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${SIDE * TILE} ${SIDE * TILE}`}
      className={className}
    >
      {buildMotif(tiles, CELLS, { row: 0, col: 0 }).map((tile) => {
        const shape: Shape = SHAPES[tile.shape];
        return (
          <g
            key={`${tile.row}-${tile.col}`}
            transform={`translate(${tile.col * TILE} ${tile.row * TILE}) rotate(${tile.rot} 60 60)`}
          >
            <rect width={TILE} height={TILE} fill={tile.bg} />
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
        );
      })}
    </svg>
  );
}

import { shapePaths } from "@/lib/tiles/shapes";
import type { Tile } from "@/lib/tiles/types";

/** The motif's paths in the 120×120 box; a plain function, because next/og accepts no components inside an <svg>. */
export function tilePaths({
  shape,
  fg,
  fg2,
}: Pick<Tile, "shape" | "fg" | "fg2">) {
  const { fill, fill2, stroke } = shapePaths(shape);
  return [
    fill && <path key="fill" d={fill} fill={fg} fillRule="evenodd" />,
    fill2 && <path key="fill2" d={fill2} fill={fg2 ?? fg} fillRule="evenodd" />,
    stroke && (
      <path key="stroke" d={stroke} fill="none" stroke={fg} strokeWidth={16} />
    ),
  ];
}

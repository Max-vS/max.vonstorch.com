import { cn } from "cn";
import { useRef } from "react";
import { Tile } from "./tile";
import type { TileView } from "./tile-engine";

function tileIndex(target: EventTarget | null) {
  const tile =
    target instanceof Element
      ? target.closest<HTMLElement>("[data-tile]")
      : null;
  return tile ? Number(tile.dataset.tile) : null;
}

export function TileGrid({
  tiles,
  onTurn,
  onHover,
  onPaint,
}: {
  tiles: readonly TileView[];
  onTurn: (index: number) => void;
  onHover?: (index: number) => void;
  onPaint?: (index: number) => void;
}) {
  // Read at pointerdown: Safari reports a tap's click with pointerType "mouse".
  const touch = useRef(false);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute right-0 bottom-0 grid grid-cols-[repeat(var(--cols),var(--tile))] grid-rows-[repeat(var(--rows),var(--tile))]",
        onPaint && "cursor-crosshair",
      )}
      onPointerDown={(event) => {
        touch.current = event.pointerType === "touch";
      }}
      onPointerOver={(event) => {
        if (!onHover || event.pointerType === "touch") return;
        const index = tileIndex(event.target);
        if (index !== null && index !== tileIndex(event.relatedTarget)) {
          onHover(index);
        }
      }}
      onClick={(event) => {
        const index = tileIndex(event.target);
        if (index === null) return;
        if (onPaint) onPaint(index);
        else if (touch.current || !onHover) onTurn(index);
      }}
    >
      {tiles.map((tile, index) => (
        <Tile key={`${tile.row}-${tile.col}`} tile={tile} index={index} />
      ))}
    </div>
  );
}

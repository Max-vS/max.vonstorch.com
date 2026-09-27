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
}: {
  tiles: readonly TileView[];
  onTurn: (index: number) => void;
}) {
  return (
    // One delegated handler pair for all tiles: mouse and pen turn a tile on hover, touch on tap.
    <div
      aria-hidden="true"
      className="absolute right-0 bottom-0 grid grid-cols-[repeat(var(--cols),var(--tile))] grid-rows-[repeat(var(--rows),var(--tile))]"
      onPointerOver={(event) => {
        if (event.pointerType === "touch") return;
        const index = tileIndex(event.target);
        if (index !== null && index !== tileIndex(event.relatedTarget)) {
          onTurn(index);
        }
      }}
      onClick={(event) => {
        const { nativeEvent } = event;
        if (
          nativeEvent instanceof PointerEvent &&
          nativeEvent.pointerType !== "touch"
        ) {
          return;
        }
        const index = tileIndex(event.target);
        if (index !== null) onTurn(index);
      }}
    >
      {tiles.map((tile, index) => (
        <Tile key={`${tile.row}-${tile.col}`} tile={tile} index={index} />
      ))}
    </div>
  );
}

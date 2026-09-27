import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { community } from "@/content/site";
import { MOTIF_SIDE } from "@/lib/tiles/motif";
import type { Cell } from "@/lib/tiles/types";

const INDEXES = Array.from({ length: MOTIF_SIDE * MOTIF_SIDE }, (_, i) => i);

const MOVES: Partial<Record<string, Cell>> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
};

/** The outlined 4×4 tiles where the motif starts; one tab stop, so arrow keys move and Enter or Space paints. */
export function MasterBlock({
  at,
  onPaint,
}: {
  at: Cell;
  onPaint: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const group = useRef<HTMLFieldSetElement>(null);

  // The button that opened paint mode is gone, so focus lands where painting starts.
  useEffect(() => {
    group.current?.querySelector("button")?.focus();
  }, []);

  function move(event: KeyboardEvent, index: number) {
    const step = MOVES[event.key];
    if (!step) return;
    event.preventDefault();
    const row = Math.floor(index / MOTIF_SIDE) + step.row;
    const col = (index % MOTIF_SIDE) + step.col;
    if (row < 0 || row >= MOTIF_SIDE || col < 0 || col >= MOTIF_SIDE) return;
    group.current?.querySelectorAll("button")[row * MOTIF_SIDE + col]?.focus();
  }

  return (
    // The tile grid's tracks, so the block sits exactly on its sixteen tiles.
    <div className="pointer-events-none absolute right-0 bottom-0 grid grid-cols-[repeat(var(--cols),var(--tile))] grid-rows-[repeat(var(--rows),var(--tile))]">
      <fieldset
        ref={group}
        className="pointer-events-auto grid grid-cols-4 grid-rows-4 shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_4px_var(--color-ground)]"
        style={{
          gridRow: `${at.row + 1} / span ${MOTIF_SIDE}`,
          gridColumn: `${at.col + 1} / span ${MOTIF_SIDE}`,
        }}
      >
        <legend className="sr-only">{community.paintArea}</legend>
        {INDEXES.map((index) => (
          <button
            key={index}
            type="button"
            tabIndex={index === active ? 0 : -1}
            aria-label={community.paintCell(
              Math.floor(index / MOTIF_SIDE) + 1,
              (index % MOTIF_SIDE) + 1,
            )}
            onClick={() => onPaint(index)}
            onKeyDown={(event) => move(event, index)}
            onFocus={() => setActive(index)}
            className="cursor-crosshair outline-none focus-visible:shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_5px_var(--color-ground)]"
          />
        ))}
      </fieldset>
    </div>
  );
}

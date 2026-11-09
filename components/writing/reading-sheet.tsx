import { cn } from "cn";
import type { ReactNode } from "react";
import type { Grid } from "@/lib/tiles/types";

const FLIP_MS = 340;

export function ReadingSheet({
  open,
  grid,
  children,
}: {
  open: boolean;
  grid: Grid | null;
  children: ReactNode;
}) {
  const step = grid?.mobile ? 30 : 26;
  const last = grid ? grid.rows + grid.cols - 2 : 0;
  return (
    <>
      {grid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 grid grid-cols-[repeat(var(--cols),var(--tile))] grid-rows-[repeat(var(--rows),var(--tile))]"
        >
          {Array.from({ length: grid.rows * grid.cols }, (_, index) => {
            const row = Math.floor(index / grid.cols);
            const col = index % grid.cols;
            const diagonal = row + col;
            return (
              <div
                key={`${row}-${col}`}
                className="bg-ground transition-transform duration-340 ease-turn motion-reduce:transition-none"
                style={{
                  transform: open ? undefined : "scaleX(0)",
                  transitionDelay: `${(open ? last - diagonal : diagonal) * step}ms`,
                }}
              />
            );
          })}
        </div>
      ) : open ? (
        // Before the grid is measured (server render), plain paper stands in for the tiles.
        <div className="absolute inset-0 bg-ground" />
      ) : null}
      <div
        inert={!open}
        className={cn(
          "absolute inset-0 transition-opacity duration-450 motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        // Halfway through the wave, so the text is in as the last tile lands.
        style={{
          transitionDelay: open
            ? `${(last * step) / 2 + FLIP_MS}ms`
            : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
}

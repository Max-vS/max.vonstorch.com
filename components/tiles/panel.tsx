import { cn } from "cn";
import type { ReactNode } from "react";

export type PanelSize = "small" | "list" | "article";

// Anchored bottom right, so a new size grows the panel up and to the left; heights stay lengths so CSS can interpolate them.
const SIZES: Record<PanelSize, string> = {
  small:
    "h-[calc(6*var(--tile))] w-[calc(5*var(--tile))] sm:h-[calc(4*var(--tile))]",
  list: "h-[calc(100%-var(--title-height))] w-full sm:h-full sm:w-[calc(5*var(--tile))]",
  article:
    "h-[calc(100%-var(--title-height))] w-full sm:h-full sm:w-[calc(100%-var(--title-width))]",
};

export function Panel({
  size = "small",
  children,
}: {
  size?: PanelSize;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute right-0 bottom-0 flex flex-col gap-10 overflow-hidden bg-ground px-18 pt-16 pb-18 sm:gap-14 sm:px-30 sm:py-26 motion-safe:[transition:width_750ms_var(--ease-turn),height_750ms_var(--ease-turn)]",
        SIZES[size],
      )}
    >
      {children}
    </div>
  );
}

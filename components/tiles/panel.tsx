import { cn } from "cn";
import { type ReactNode, useLayoutEffect, useRef } from "react";

export type PanelSize = "small" | "list" | "article" | "paint";

// Anchored bottom right, so a new size grows the panel up and to the left; heights stay lengths so CSS can interpolate them.
const SIZES: Record<PanelSize, string> = {
  small:
    "h-[calc(6*var(--tile))] w-[calc(5*var(--tile))] sm:h-[calc(4*var(--tile))]",
  list: "h-[calc(100%-var(--title-height))] w-full sm:h-full sm:w-[calc(5*var(--tile))]",
  article:
    "h-[calc(100%-var(--title-height))] w-full sm:h-full sm:w-[calc(100%-var(--title-width))]",
  // As low as its content allows, but on a tile edge; the 0px fallback is a length, so the first height still animates.
  paint:
    "h-[round(up,var(--content-height,0px),var(--tile))] w-[calc(5*var(--tile))] justify-end",
};

export function Panel({
  size = "small",
  children,
}: {
  size?: PanelSize;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const fit = size === "paint";

  // The content sits at the bottom at its own height, so it reaches from the first child's top down to the panel's bottom.
  useLayoutEffect(() => {
    const element = panel.current;
    if (!fit || !element) return;
    const observer = new ResizeObserver(() => {
      const top = element.firstElementChild?.getBoundingClientRect().top ?? 0;
      const height =
        element.getBoundingClientRect().bottom -
        top +
        Number.parseFloat(getComputedStyle(element).paddingTop);
      element.style.setProperty("--content-height", `${height}px`);
    });
    for (const child of element.children) observer.observe(child);
    return () => observer.disconnect();
  }, [fit]);

  return (
    <div
      ref={panel}
      className={cn(
        "absolute right-0 bottom-0 flex flex-col gap-10 overflow-hidden bg-ground px-18 pt-16 pb-18 sm:gap-14 sm:px-30 sm:py-26 motion-safe:[transition:width_750ms_var(--ease-turn),height_750ms_var(--ease-turn)]",
        SIZES[size],
      )}
    >
      {children}
    </div>
  );
}

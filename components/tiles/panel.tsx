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
  // One tile more than its content needs, on a tile edge, so the buttons have room; the 0px fallback is a length, so the first height still animates.
  paint:
    "h-[calc(round(up,var(--content-height,0px),var(--tile))+var(--tile))] w-[calc(5*var(--tile))]",
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

  // Only the [data-panel-fill] element takes the spare height or gives way, so swapping its height for its content's gives the panel's natural height.
  useLayoutEffect(() => {
    const element = panel.current;
    const fill = element?.querySelector("[data-panel-fill]");
    const content = fill?.firstElementChild;
    if (!fit || !element || !fill || !content) return;
    const observer = new ResizeObserver(() => {
      const height =
        element.getBoundingClientRect().height -
        fill.getBoundingClientRect().height +
        content.getBoundingClientRect().height;
      element.style.setProperty("--content-height", `${height}px`);
    });
    observer.observe(fill);
    observer.observe(content);
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

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
  // As low as its content allows, but on a tile edge; the rest of the top tile goes above the content, so the content rides the top edge as on the other pages. The 0px fallback is a length, so the first height still animates.
  paint:
    "h-(--fit) w-[calc(5*var(--tile))] [--fit:round(up,var(--content-height,0px),var(--tile))] *:first:mt-[calc(var(--fit)-var(--content-height,0px))] *:first:motion-safe:[transition:margin-top_750ms_var(--ease-turn)]",
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

  // The children keep their own height, so the content reaches from the first child's top to the last child's bottom; the first child's margin is the remainder and stays out.
  useLayoutEffect(() => {
    const element = panel.current;
    if (!fit || !element) return;
    const observer = new ResizeObserver(() => {
      const top = element.firstElementChild?.getBoundingClientRect().top ?? 0;
      const bottom =
        element.lastElementChild?.getBoundingClientRect().bottom ?? 0;
      const { paddingTop, paddingBottom } = getComputedStyle(element);
      const height =
        bottom -
        top +
        Number.parseFloat(paddingTop) +
        Number.parseFloat(paddingBottom);
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

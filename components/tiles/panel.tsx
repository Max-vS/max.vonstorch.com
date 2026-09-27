import type { ReactNode } from "react";

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute right-0 bottom-0 flex h-[calc(6*var(--tile))] w-[calc(5*var(--tile))] flex-col gap-10 overflow-hidden bg-ground px-18 pt-16 pb-18 sm:h-[calc(4*var(--tile))] sm:gap-14 sm:px-30 sm:py-26">
      {children}
    </div>
  );
}

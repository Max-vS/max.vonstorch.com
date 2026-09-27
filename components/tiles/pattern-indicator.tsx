import { cn } from "cn";

export function PatternIndicator({
  names,
  current,
  onSelect,
}: {
  names: readonly string[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    // Sits in the panel on mobile; on desktop it is pinned to the bottom-left cells, as in the design.
    <div className="flex items-center gap-10 sm:fixed sm:bottom-0 sm:left-0 sm:h-(--tile) sm:w-(--indicator-width) sm:gap-16 sm:bg-ground sm:px-30">
      <div className="flex flex-col gap-3 sm:gap-4">
        {names.map((name, index) => (
          <button
            key={name}
            type="button"
            aria-label={`${name} pattern`}
            aria-pressed={index === current}
            onClick={() => onSelect(index)}
            className={cn(
              "relative w-3 rounded-full [transition:height_450ms_var(--ease-turn),background-color_300ms] before:absolute before:-inset-x-8 before:-inset-y-2 sm:w-4",
              index === current
                ? "h-16 bg-ink sm:h-22"
                : "h-6 bg-[#c9c4ba] sm:h-8",
            )}
          />
        ))}
      </div>
      <p
        aria-live="polite"
        className="flex flex-col gap-2 font-mono text-[length:--spacing(10)] tracking-[0.06em] sm:gap-3 sm:text-[length:--spacing(11)]"
      >
        <span className="uppercase">{names[current]}</span>
        <span className="text-muted sm:hidden">SWIPE TO CHANGE</span>
        <span className="hidden text-muted sm:inline">SCROLL TO CHANGE</span>
      </p>
    </div>
  );
}

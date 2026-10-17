import { cn } from "cn";

const HINTS = {
  change: { mobile: "SWIPE TO CHANGE", desktop: "SCROLL TO CHANGE" },
  browse: { mobile: "SWIPE TO BROWSE", desktop: "SCROLL TO BROWSE" },
  paint: { mobile: "TAP TILES TO PAINT", desktop: "CLICK TILES TO PAINT" },
};

export function PatternIndicator({
  label,
  hint,
  live,
  ticks,
  className,
}: {
  className?: string;
  label: string;
  hint: keyof typeof HINTS;
  live: boolean;
  ticks?: {
    names: readonly string[];
    current: number;
    onSelect: (index: number) => void;
  };
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-10 sm:fixed sm:bottom-0 sm:left-0 sm:h-(--tile) sm:w-(--indicator-width) sm:gap-16 sm:bg-ground sm:px-30",
        className,
      )}
    >
      {ticks ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {ticks.names.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-label={`${name} pattern`}
              aria-pressed={index === ticks.current}
              onClick={() => ticks.onSelect(index)}
              className={cn(
                "relative w-3 rounded-full [transition:height_450ms_var(--ease-turn),background-color_300ms] before:absolute before:-inset-x-8 before:-inset-y-2 sm:w-4",
                index === ticks.current
                  ? "h-16 bg-ink sm:h-22"
                  : "h-6 bg-[#c9c4ba] sm:h-8",
              )}
            />
          ))}
        </div>
      ) : null}
      <p
        aria-live={live ? "polite" : undefined}
        className="caption flex flex-col gap-2 sm:gap-3"
      >
        <span>{label}</span>
        <span className="text-muted sm:hidden">{HINTS[hint].mobile}</span>
        <span className="hidden text-muted sm:inline">
          {HINTS[hint].desktop}
        </span>
      </p>
    </div>
  );
}

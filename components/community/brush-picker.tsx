import { cn } from "cn";
import type { ReactNode } from "react";
import { labelText } from "@/components/ui/label";
import { community } from "@/content/site";
import {
  BRUSH_COLORS,
  BRUSH_SHAPES,
  type BrushColor,
  type BrushShape,
} from "@/lib/schemas/mark";
import { SHAPES, type Shape } from "@/lib/tiles/shapes";

export type Brush = { shape: BrushShape; fg: BrushColor; bg: BrushColor };

// The design's caption column; the name and note fields line up with it too.
export const captionWidth = "w-48 shrink-0 sm:w-70";
export const captionIndent = "pl-48 sm:pl-70";

const swatch =
  "block size-20 border border-ink/30 peer-checked:shadow-[0_0_0_2px_var(--color-ground),0_0_0_3.5px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-ink peer-focus-visible:outline-offset-4 sm:size-22";

export function BrushPicker({
  brush,
  onChange,
}: {
  brush: Brush;
  onChange: (brush: Brush) => void;
}) {
  return (
    <>
      <BrushRow legend={community.brush.shape} className="gap-4 sm:gap-6">
        {BRUSH_SHAPES.map((shape) => (
          <Choice
            key={shape}
            name="brush-shape"
            label={community.shapes[shape]}
            checked={brush.shape === shape}
            onSelect={() => onChange({ ...brush, shape })}
          >
            <span className="block size-26 rounded-[--spacing(6)] border-[1.5px] border-ink/20 bg-ground p-4 peer-checked:border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-ink peer-focus-visible:outline-offset-2 sm:size-32">
              <ShapeIcon shape={shape} />
            </span>
          </Choice>
        ))}
      </BrushRow>
      <BrushRow legend={community.brush.colour} className="gap-6 sm:gap-8">
        {BRUSH_COLORS.map((color) => (
          <Choice
            key={color}
            name="brush-colour"
            label={community.colours[color]}
            checked={brush.fg === color}
            onSelect={() => onChange({ ...brush, fg: color })}
          >
            <span
              className={cn(swatch, "rounded-full")}
              style={{ backgroundColor: color }}
            />
          </Choice>
        ))}
      </BrushRow>
      <BrushRow legend={community.brush.ground} className="gap-6 sm:gap-8">
        {BRUSH_COLORS.map((color) => (
          <Choice
            key={color}
            name="brush-ground"
            label={community.colours[color]}
            checked={brush.bg === color}
            onSelect={() => onChange({ ...brush, bg: color })}
          >
            <span
              className={cn(swatch, "rounded-[--spacing(4)]")}
              style={{ backgroundColor: color }}
            />
          </Choice>
        ))}
      </BrushRow>
    </>
  );
}

function BrushRow({
  legend,
  className,
  children,
}: {
  legend: string;
  className: string;
  children: ReactNode;
}) {
  return (
    // A legend cannot be laid out in a row, so screen readers get it and sighted visitors get the same word as a caption.
    <fieldset className="flex items-center">
      <legend className="sr-only">{legend}</legend>
      <span aria-hidden="true" className={cn(labelText, captionWidth)}>
        {legend}
      </span>
      <div className={cn("flex items-center", className)}>{children}</div>
    </fieldset>
  );
}

function Choice({
  name,
  label,
  checked,
  onSelect,
  children,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      {children}
      <span className="sr-only">{label}</span>
    </label>
  );
}

function ShapeIcon({ shape }: { shape: BrushShape }) {
  const { fill, fill2, stroke }: Shape = SHAPES[shape];
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className="block size-full">
      {fill && <path d={fill} className="fill-ink" fillRule="evenodd" />}
      {fill2 && (
        <path
          d={fill2}
          className="fill-ink"
          fillOpacity={0.5}
          fillRule="evenodd"
        />
      )}
      {stroke && (
        <path d={stroke} fill="none" className="stroke-ink" strokeWidth={16} />
      )}
    </svg>
  );
}

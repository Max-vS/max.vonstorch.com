"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitMark } from "@/app/(tiles)/community/actions";
import { useTileScene } from "@/components/tiles/tile-scene";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { community } from "@/content/site";
import {
  MARK_NAME_MAX,
  MARK_NOTE_MAX,
  type MarkTile,
  MOTIF_TILES,
  markSubmissionSchema,
} from "@/lib/schemas/mark";
import {
  type Brush,
  BrushPicker,
  captionIndent,
  captionWidth,
} from "./brush-picker";
import type { OwnMark } from "./own-mark";

// Spec §9: an empty motif, and the design's default brush.
const EMPTY_MOTIF: MarkTile[] = Array.from({ length: MOTIF_TILES }, () => ({
  shape: "none",
  rot: 0,
  fg: "#1D1D1B",
  bg: "#EFEBE4",
}));
const DEFAULT_BRUSH: Brush = { shape: "qdisc", fg: "#E2573B", bg: "#EFEBE4" };

const QUARTER_TURN = { 0: 90, 90: 180, 180: 270, 270: 0 } as const;

function paintTile(tile: MarkTile, brush: Brush): MarkTile {
  const same =
    tile.shape === brush.shape && tile.fg === brush.fg && tile.bg === brush.bg;
  return same
    ? { ...tile, rot: QUARTER_TURN[tile.rot] }
    : { ...tile, ...brush };
}

export function MarkPainter({
  onCancel,
  onSent,
}: {
  onCancel: () => void;
  onSent: (mark: OwnMark) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(markSubmissionSchema),
    defaultValues: { name: "", note: "", tiles: EMPTY_MOTIF },
  });
  const tiles = useWatch({ control, name: "tiles" });
  const note = useWatch({ control, name: "note" });
  const [brush, setBrush] = useState(DEFAULT_BRUSH);
  // The shell calls the `paint` of the last committed scene, which can be a render old, so it reads the brush from here.
  const latestBrush = useRef(brush);
  const [sending, startTransition] = useTransition();

  function changeBrush(next: Brush) {
    latestBrush.current = next;
    setBrush(next);
  }

  useTileScene({
    mode: "paint",
    motif: tiles,
    label: community.yourMark,
    paint: (index) => {
      const current = getValues("tiles");
      setValue(
        "tiles",
        current.with(index, paintTile(current[index], latestBrush.current)),
        // A stroke always leaves a painted tile, so validating only ever clears "Paint at least one tile.".
        { shouldValidate: true },
      );
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (sending) return;
    startTransition(async () => {
      const result = await submitMark(values).catch(() => null);
      if (result?.ok) {
        onSent({
          id: result.id,
          name: values.name || null,
          note: values.note,
          tiles: values.tiles,
          date: new Date().toISOString(),
        });
      } else if (result && "fieldErrors" in result) {
        for (const field of ["name", "note", "tiles"] as const) {
          const message = result.fieldErrors[field]?.[0];
          if (message) setError(field, { message });
        }
      } else {
        setError("root.server", {
          message:
            result?.error === "too_many" ? community.tooMany : community.failed,
        });
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-8 sm:gap-10"
    >
      <BrushPicker brush={brush} onChange={changeBrush} />
      <Field>
        <div className="flex items-baseline">
          <Label htmlFor="mark-name" className={captionWidth}>
            {community.name}
          </Label>
          <Input
            id="mark-name"
            placeholder={community.namePlaceholder}
            maxLength={MARK_NAME_MAX}
            autoComplete="nickname"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby="mark-name-error"
            {...register("name")}
          />
        </div>
        <FieldError id="mark-name-error" className={captionIndent}>
          {errors.name?.message}
        </FieldError>
      </Field>
      <Field>
        <div className="flex items-start">
          <Label htmlFor="mark-note" className={cn(captionWidth, "pt-10")}>
            {community.note}
          </Label>
          <Textarea
            id="mark-note"
            rows={2}
            placeholder={community.notePlaceholder}
            maxLength={MARK_NOTE_MAX}
            aria-invalid={errors.note ? true : undefined}
            aria-describedby="mark-note-left mark-note-error"
            {...register("note")}
          />
        </div>
        <FieldError id="mark-note-error" className={captionIndent}>
          {errors.note?.message}
        </FieldError>
      </Field>
      <FieldError>
        {errors.tiles?.message ?? errors.root?.server?.message}
      </FieldError>
      <div className="flex items-center gap-14">
        {/* aria-disabled, not disabled: a disabled button drops the keyboard focus of the visitor who pressed it. */}
        <Button type="submit" aria-disabled={sending}>
          {sending ? community.sending : community.submit}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {community.cancel}
        </Button>
        <p
          id="mark-note-left"
          className="ml-auto font-mono text-[length:--spacing(10)] text-muted sm:text-[length:--spacing(11)]"
        >
          {MARK_NOTE_MAX - note.length}
          <span className="sr-only"> {community.noteLeft}</span>
        </p>
      </div>
    </form>
  );
}

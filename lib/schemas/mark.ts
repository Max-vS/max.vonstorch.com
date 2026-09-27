// Shared by the mark form and the submit action, so it must stay free of server imports.
import * as z from "zod";
import { MOTIF_SIDE } from "@/lib/tiles/motif";

export const MARK_NAME_MAX = 40;
export const MARK_NOTE_MAX = 140;
export const MOTIF_TILES = MOTIF_SIDE * MOTIF_SIDE;

export const BRUSH_SHAPES = [
  "qdisc",
  "half",
  "tri",
  "dot",
  "qring",
  "leaf",
  "squares",
  "arc",
] as const;
export const TILE_SHAPES = [...BRUSH_SHAPES, "none"] as const;
export const TILE_ROTATIONS = [0, 90, 180, 270] as const;
export const BRUSH_COLORS = [
  "#E2573B",
  "#2F4FD8",
  "#F2C14E",
  "#9DB39A",
  "#1D1D1B",
  "#E9B8A6",
  "#EFEBE4",
] as const;

export const markTileSchema = z.object({
  shape: z.enum(TILE_SHAPES),
  rot: z.literal(TILE_ROTATIONS),
  fg: z.enum(BRUSH_COLORS),
  bg: z.enum(BRUSH_COLORS),
});

export const markSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .max(MARK_NAME_MAX, `Use ${MARK_NAME_MAX} characters or fewer.`)
    .optional(),
  note: z
    .string()
    .trim()
    .min(1, "Write a short note.")
    .max(MARK_NOTE_MAX, `Use ${MARK_NOTE_MAX} characters or fewer.`),
  tiles: z
    .array(markTileSchema)
    .length(MOTIF_TILES)
    .refine(
      (tiles) => tiles.some((tile) => tile.shape !== "none"),
      "Paint at least one tile.",
    ),
});

export type BrushShape = (typeof BRUSH_SHAPES)[number];
export type BrushColor = (typeof BRUSH_COLORS)[number];
export type MarkTile = z.infer<typeof markTileSchema>;
export type MarkSubmission = z.infer<typeof markSubmissionSchema>;

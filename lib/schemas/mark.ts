// Shared by the mark form and the submit action, so it must stay free of server imports.
import * as z from "zod";
import { MOTIF_SIDE } from "@/lib/tiles/motif";

export const MARK_NAME_MAX = 40;
export const MARK_NOTE_MAX = 140;
export const MOTIF_TILES = MOTIF_SIDE * MOTIF_SIDE;

// Every tile shape the site's patterns use.
export const BRUSH_SHAPES = [
  "qdisc",
  "half",
  "halves",
  "dot",
  "tri",
  "qring",
  "leaf",
  "arc",
  "lshape",
  "wedge",
  "ring",
  "cross",
  "squares",
  "split",
  "offdot",
  "pin",
  "dots4",
  "halfsq",
  "pair",
  "hole",
  "xmark",
] as const;
export const TILE_SHAPES = [...BRUSH_SHAPES, "none"] as const;
export const TILE_ROTATIONS = [0, 90, 180, 270] as const;
// The design's brush colours, with the Projects lavender in place of the pink.
export const BRUSH_COLORS = [
  "#1D1D1B",
  "#EFEBE4",
  "#FFFFFF",
  "#E2573B",
  "#FF6A13",
  "#9C3A12",
  "#D9A08B",
  "#F7C7A6",
  "#F2C14E",
  "#F6DC97",
  "#C7F03A",
  "#9DB39A",
  "#8FA98A",
  "#33503A",
  "#2F4FD8",
  "#1F3DFF",
  "#B5BAEC",
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

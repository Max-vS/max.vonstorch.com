import { useSyncExternalStore } from "react";
import * as z from "zod";
import {
  MARK_NAME_MAX,
  MARK_NOTE_MAX,
  MOTIF_TILES,
  markTileSchema,
} from "@/lib/schemas/mark";

const KEY = "community:own-mark";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// The browser can hold anything under the key, so it is parsed like any other input.
const ownMarkSchema = z.object({
  id: z.string(),
  name: z.string().max(MARK_NAME_MAX).nullable(),
  note: z.string().max(MARK_NOTE_MAX),
  tiles: z.array(markTileSchema).length(MOTIF_TILES),
  date: z.iso.datetime(),
});

export type OwnMark = z.infer<typeof ownMarkSchema>;

const listeners = new Set<() => void>();
let snapshot: { raw: string | null; mark: OwnMark | null } = {
  raw: null,
  mark: null,
};

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null) {
  if (!raw) return null;
  try {
    const mark = ownMarkSchema.parse(JSON.parse(raw));
    return Date.now() - Date.parse(mark.date) < MAX_AGE_MS ? mark : null;
  } catch {
    return null;
  }
}

function write(raw: string | null) {
  try {
    if (raw === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, raw);
  } catch {
    // Storage can be off (private mode); the mark then just does not show as pending.
  }
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Parsed once per stored value, so React gets the same object until the value changes.
function getSnapshot() {
  const raw = read();
  if (raw !== snapshot.raw) snapshot = { raw, mark: parse(raw) };
  return snapshot.mark;
}

/** The visitor's last mark, until it is approved or 30 days old (spec §9). */
export function useOwnMark() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function saveOwnMark(mark: OwnMark) {
  write(JSON.stringify(mark));
}

export function clearOwnMark() {
  write(null);
}

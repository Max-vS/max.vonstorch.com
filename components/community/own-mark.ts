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
  } catch {}
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

function getSnapshot() {
  const raw = read();
  if (raw !== snapshot.raw) snapshot = { raw, mark: parse(raw) };
  return snapshot.mark;
}

export function useOwnMark() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function saveOwnMark(mark: OwnMark) {
  write(JSON.stringify(mark));
}

export function clearOwnMark() {
  write(null);
}

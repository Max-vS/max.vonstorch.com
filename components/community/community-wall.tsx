"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { PanelText } from "@/components/tiles/panel-text";
import { type TileScene, useTileScene } from "@/components/tiles/tile-scene";
import type { Direction } from "@/components/tiles/use-pattern-input";
import type { Corner } from "@/components/tiles/use-tile-engine";
import { Button } from "@/components/ui/button";
import { community } from "@/content/site";
import type { MarkTile } from "@/lib/schemas/mark";
import { MarkPainter } from "./mark-painter";
import { clearOwnMark, saveOwnMark, useOwnMark } from "./own-mark";

export type Mark = {
  id: string;
  name: string | null;
  note: string;
  tiles: MarkTile[];
  createdAt: string;
};

export type MarksPage = { marks: Mark[]; total: number };

type Entry = {
  id: string;
  name: string | null;
  note: string;
  tiles: readonly MarkTile[];
  // Null for the visitor's own mark, which still waits for approval.
  date: string | null;
};

// UTC, so the server and the browser print the same day and hydration matches.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function CommunityWall({ first }: { first: MarksPage }) {
  const [marks, setMarks] = useState(first.marks);
  const [total, setTotal] = useState(first.total);
  const [nextPage, setNextPage] = useState(1);
  const loading = useRef(false);
  const [view, setView] = useState<{ index: number; from: Corner }>({
    index: 0,
    from: "top-left",
  });
  const [painting, setPainting] = useState(false);
  const [thanked, setThanked] = useState(false);
  const [leftPaintMode, setLeftPaintMode] = useState(false);

  const own = useOwnMark();
  const ownApproved = own !== null && marks.some(({ id }) => id === own.id);
  const pending = own && !ownApproved ? own : null;

  // Left in storage, an approved mark would show as pending again once newer marks push it off the first page.
  useEffect(() => {
    if (ownApproved) clearOwnMark();
  }, [ownApproved]);

  const entries: Entry[] = [
    ...(pending ? [{ ...pending, date: null }] : []),
    ...marks.map((mark) => ({
      ...mark,
      date: dateFormat.format(new Date(mark.createdAt)),
    })),
  ];
  const count = total + (pending ? 1 : 0);
  const allLoaded = marks.length >= total;
  const index = Math.max(0, Math.min(view.index, entries.length - 1));

  async function loadMore() {
    if (loading.current) return;
    loading.current = true;
    try {
      const response = await fetch(`/api/marks/${nextPage}`);
      if (!response.ok) return;
      const page: MarksPage = await response.json();
      // A mark approved since the last page shifts the list by one, so the same mark can come twice.
      setMarks((current) => [
        ...current,
        ...page.marks.filter(
          (mark) => !current.some(({ id }) => id === mark.id),
        ),
      ]);
      setTotal(page.total);
      setNextPage((current) => current + 1);
    } catch {
      // Browsing stops at the last loaded mark, and the next step there tries again.
    } finally {
      loading.current = false;
    }
  }

  function step(direction: Direction) {
    let next = index + direction;
    if (next < 0 || next >= entries.length) {
      // Wrapping around needs every mark; until then the list only grows at its end.
      if (!allLoaded) {
        if (next >= entries.length) loadMore();
        return;
      }
      next = (next + entries.length) % entries.length;
    }
    if (next === entries.length - 1 && !allLoaded) loadMore();
    setView({ index: next, from: direction > 0 ? "top-left" : "bottom-right" });
    setThanked(false);
  }

  function leavePaintMode(next: { index: number; from: Corner }) {
    setPainting(false);
    setLeftPaintMode(true);
    setView(next);
  }

  const start = (
    <StartButton
      focus={leftPaintMode}
      onClick={() => {
        // Cleared now, so the next thanks is a change the live region announces.
        setThanked(false);
        setPainting(true);
      }}
    />
  );
  const entry = entries.at(index);

  return (
    <>
      {/* Stays mounted across paint mode, so the thanks is announced although the form is gone. */}
      <p aria-live="polite" className="sr-only">
        {thanked ? community.thanksStatus : ""}
      </p>
      {painting ? (
        <MarkPainter
          onCancel={() => leavePaintMode({ index, from: "bottom-right" })}
          onSent={(mark) => {
            saveOwnMark(mark);
            leavePaintMode({ index: 0, from: "top-left" });
            setThanked(true);
          }}
        />
      ) : !entry ? (
        // Spec §9: the empty wall shows the Index "Bauhaus" pattern.
        <Scene
          scene={{
            mode: "browse",
            key: "empty",
            from: view.from,
            motif: null,
            label: null,
            step: null,
          }}
        >
          <PanelText>{community.empty}</PanelText>
          {start}
        </Scene>
      ) : (
        <Scene
          scene={{
            mode: "browse",
            key: entry.id,
            from: view.from,
            motif: entry.tiles,
            label: community.position(index + 1, count),
            step: count > 1 ? step : null,
          }}
        >
          {/* Arrow keys change the mark, so screen readers hear the new one. */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex flex-col gap-10 sm:gap-14"
          >
            <p className="font-mono text-[length:--spacing(10)] text-muted tracking-[0.06em] sm:text-[length:--spacing(11)]">
              {thanked && !entry.date
                ? community.thanks
                : community.count(index + 1, count)}
              {" · "}
              {entry.date ?? community.waiting}
            </p>
            <p className="font-medium text-[length:--spacing(15)] leading-[1.3] sm:text-[length:--spacing(19)] sm:leading-[1.32]">
              “{entry.note}”
            </p>
            <p className="text-[length:--spacing(13)] text-muted sm:text-[length:--spacing(15)]">
              — {entry.name ?? community.anonymous}
            </p>
          </div>
          {start}
        </Scene>
      )}
    </>
  );
}

function Scene({ scene, children }: { scene: TileScene; children: ReactNode }) {
  useTileScene(scene);
  return children;
}

/** `focus` takes focus on mount: back from paint mode, the button that was clicked is gone. */
function StartButton({
  focus,
  onClick,
}: {
  focus: boolean;
  onClick: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (focus) button.current?.focus();
  }, [focus]);
  return (
    <Button ref={button} className="self-start" onClick={onClick}>
      {community.start}
    </Button>
  );
}

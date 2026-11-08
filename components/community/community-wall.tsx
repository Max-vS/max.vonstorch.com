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
  date: string | null;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function CommunityWall({ first }: { first: MarksPage }) {
  const [marks, setMarks] = useState(first.marks);
  const [total, setTotal] = useState(first.total);
  const [nextPage, setNextPage] = useState<number | null>(1);
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
  const allLoaded = nextPage === null || marks.length >= total;
  const count = allLoaded ? entries.length : total + (pending ? 1 : 0);
  const index = Math.max(0, Math.min(view.index, entries.length - 1));

  async function loadMore() {
    if (loading.current || nextPage === null) return;
    loading.current = true;
    try {
      const response = await fetch(`/api/marks/${nextPage}`);
      if (!response.ok) return;
      const page: MarksPage = await response.json();
      setMarks((current) => [
        ...current,
        ...page.marks.filter(
          (mark) => !current.some(({ id }) => id === mark.id),
        ),
      ]);
      setTotal(page.total);
      setNextPage(page.marks.length > 0 ? nextPage + 1 : null);
    } catch {
    } finally {
      loading.current = false;
    }
  }

  function step(direction: Direction) {
    let next = index + direction;
    if (next < 0 || next >= entries.length) {
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
        setThanked(false);
        setPainting(true);
      }}
    />
  );
  const entry = entries.at(index);

  return (
    <>
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
        <Scene
          scene={{
            mode: "browse",
            key: "empty",
            from: view.from,
            motif: null,
            label: null,
            step: null,
            action: start,
          }}
        >
          <PanelText>{community.empty}</PanelText>
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
            action: start,
          }}
        >
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex flex-col gap-8 sm:gap-10"
          >
            <div className="flex items-baseline justify-between gap-14">
              <PanelText>“{entry.note}”</PanelText>
              <p className="caption shrink-0 text-muted normal-case">
                {entry.date ?? (thanked ? community.thanks : null)}
              </p>
            </div>
            <p className="text-[length:--spacing(13)] text-muted sm:text-[length:--spacing(15)]">
              {entry.name ?? community.anonymous}
            </p>
          </div>
        </Scene>
      )}
    </>
  );
}

function Scene({ scene, children }: { scene: TileScene; children: ReactNode }) {
  useTileScene(scene);
  return children;
}

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
    <Button ref={button} onClick={onClick}>
      {community.start}
    </Button>
  );
}

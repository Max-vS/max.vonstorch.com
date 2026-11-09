"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./team-timeline.module.css";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const ROLE_WORDS = ["workers", "check", "lead", "helper"];
const END_LABEL = "26 Oct · main unlocked";

const pad = (n: number) => String(n).padStart(2, "0");
const number = (n: number) => Math.round(n).toLocaleString("en-US");
const tokens = (n: number) =>
  n >= 1e9
    ? `${(n / 1e9).toFixed(1)}B`
    : n >= 1e6
      ? `${Math.round(n / 1e6)}M`
      : number(n);

function clock(t0: number, at: number) {
  const d = new Date((t0 + at) * 1000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

function scrollParent(element: HTMLElement) {
  for (
    let parent = element.parentElement;
    parent;
    parent = parent.parentElement
  ) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) return parent;
  }
  return null;
}

export function TimelineHud({
  t0,
  end,
  slot,
  phases,
  hud,
  slots,
}: {
  t0: number;
  end: number;
  slot: number;
  phases: [string, number][];
  hud: [number, number, number][];
  slots: number[][];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<number | null>(0);
  const [tip, setTip] = useState<{ x: number; y: number; slot: number } | null>(
    null,
  );

  useEffect(() => {
    const figure = ref.current?.closest("figure");
    const line = figure?.querySelector<HTMLElement>("[data-line]");
    const scroller = figure && scrollParent(figure);
    if (!line || !scroller) return;
    const built =
      CSS.supports("animation-timeline: view()") &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rows: { top: number; height: number; from: number; to: number }[] = [];
    const measure = () => {
      rows = [...line.querySelectorAll<HTMLElement>("[data-from]")].map(
        (row) => ({
          top: row.offsetTop,
          height: row.offsetHeight,
          from: Number(row.dataset.from),
          to: Number(row.dataset.to),
        }),
      );
    };
    const timeAt = (y: number) => {
      for (const row of rows) {
        if (y < row.top) return row.from;
        if (y < row.top + row.height)
          return row.from + ((row.to - row.from) * (y - row.top)) / row.height;
      }
      return end;
    };
    // The line's tip: 60% down the reading sheet's scroll box, as in the CSS view timelines.
    const tipY = () =>
      scroller.getBoundingClientRect().top +
      scroller.clientHeight * 0.6 -
      line.getBoundingClientRect().top;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = tipY();
      setNow(y >= line.offsetHeight - 1 ? null : timeAt(Math.max(0, y)));
      setTip(null);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = line.getBoundingClientRect();
      const y = event.clientY - box.top;
      const lineX =
        (line.querySelector<HTMLElement>("[data-spine]")?.offsetLeft ?? 0) - 4;
      if (
        event.clientX - box.left >= lineX ||
        (built && y > tipY()) ||
        (event.target as Element).closest("[data-card]")
      ) {
        setTip(null);
        return;
      }
      setTip({
        x: event.clientX,
        y: event.clientY,
        slot: Math.min(slots.length - 1, Math.floor(timeAt(y) / slot)),
      });
    };
    const onLeave = () => setTip(null);

    measure();
    update();
    const observer = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    observer.observe(line);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    line.addEventListener("pointermove", onMove);
    line.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      line.removeEventListener("pointermove", onMove);
      line.removeEventListener("pointerleave", onLeave);
    };
  }, [end, slot, slots.length]);

  const at = now ?? end;
  const k = Math.min(hud.length - 2, Math.floor(at / slot));
  const part = now === null ? 1 : Math.min(1, at / slot - k);
  const [started, used, usd] = hud[k].map(
    (v, i) => v + (hud[k + 1][i] - v) * part,
  );
  const phase =
    phases.findLast(([, start]) => start <= at)?.[0] ?? phases[0][0];
  const rise = (d: number) => ({ "--d": `${d}px` }) as CSSProperties;

  const s = tip ? slots[tip.slot] : null;
  return (
    <>
      <div ref={ref} className={styles.hud}>
        <span className={`${styles.when} ${styles.rise}`} style={rise(60)}>
          <b>{now === null ? END_LABEL : clock(t0, at)}</b>
          <span className={styles.phase}>{phase}</span>
        </span>
        <div className={styles.stats}>
          <span className={styles.rise} style={rise(40)}>
            <b>{number(Math.floor(started))}</b> agents
          </span>
          <span className={styles.rise} style={rise(50)}>
            <b>{tokens(used)}</b> tokens
          </span>
          <span className={styles.rise} style={rise(60)}>
            <b>${number(usd)}</b> API
          </span>
        </div>
        <i className={styles.rule} />
      </div>
      {tip && s ? (
        <div
          className={styles.tooltip}
          style={{
            left: Math.min(window.innerWidth - 315, tip.x + 16),
            top: tip.y + 16,
          }}
        >
          <b>{clock(t0, tip.slot * slot)} + 3 h</b>
          <br />
          {s[0]} agents at work
          {s[0]
            ? ` (${s
                .slice(1, 5)
                .map((n, role) => (n ? `${n} ${ROLE_WORDS[role]}` : ""))
                .filter(Boolean)
                .join(", ")})`
            : ""}{" "}
          · {s[5]} bugs found
          <br />
          checks: {s[6]} passed, {s[7]} failed
          {s[8] ? `, ${s[8]} unclear` : ""}
        </div>
      ) : null}
    </>
  );
}

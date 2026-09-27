import {
  type TouchEvent,
  useEffect,
  useEffectEvent,
  useRef,
  type WheelEvent,
} from "react";

export type Direction = 1 | -1;

const WHEEL_THRESHOLD = 70;
const WHEEL_RESET_MS = 260;
const SWIPE_THRESHOLD = 50;
const LOCK_MS = 1150;

const KEY_DIRECTIONS: Partial<Record<string, Direction>> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.matches("input, textarea, select"))
  );
}

// Wheel, swipe and arrow keys step through the patterns, with a lock so one gesture changes one pattern.
export function usePatternInput({
  step,
  isBusy,
  enabled,
}: {
  step: (direction: Direction) => void;
  isBusy: () => boolean;
  enabled: boolean;
}) {
  const lockedUntil = useRef(0);
  const wheel = useRef({ total: 0, at: 0 });
  const touchY = useRef<number | null>(null);

  function locked(now: number) {
    return !enabled || isBusy() || now < lockedUntil.current;
  }

  function change(direction: Direction, now: number) {
    lockedUntil.current = now + LOCK_MS;
    step(direction);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.key];
    if (
      !direction ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isEditable(event.target)
    ) {
      return;
    }
    const now = performance.now();
    if (!locked(now)) change(direction, now);
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return {
    onWheel(event: WheelEvent) {
      const now = performance.now();
      if (locked(now)) {
        wheel.current.total = 0;
        return;
      }
      if (now - wheel.current.at > WHEEL_RESET_MS) wheel.current.total = 0;
      wheel.current.at = now;
      wheel.current.total += event.deltaY;
      if (Math.abs(wheel.current.total) < WHEEL_THRESHOLD) return;
      const direction = wheel.current.total > 0 ? 1 : -1;
      wheel.current.total = 0;
      change(direction, now);
    },
    onTouchStart(event: TouchEvent) {
      touchY.current = event.touches[0].clientY;
    },
    onTouchEnd(event: TouchEvent) {
      const startY = touchY.current;
      touchY.current = null;
      if (startY === null) return;
      const distance = startY - event.changedTouches[0].clientY;
      const now = performance.now();
      if (Math.abs(distance) > SWIPE_THRESHOLD && !locked(now)) {
        change(distance > 0 ? 1 : -1, now);
      }
    },
  };
}

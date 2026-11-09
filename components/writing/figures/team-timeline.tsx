import type { CSSProperties } from "react";
import styles from "./team-timeline.module.css";
import { TimelineHud } from "./timeline-hud";

export type TimelineData = {
  t0: number;
  end: number;
  slot: number;
  phases: [name: string, at: number][];
  agents: [role: number, start: number, end: number, segments: number[]][];
  bugs: number[];
  runs: [at: number, ok: number][];
  slots: number[][];
  hud: [started: number, tokens: number, usd: number][];
  cards: {
    at: number;
    dated: boolean;
    title: string;
    text: string;
    tag: string;
  }[];
};

const DAY = 86400;
const BIN = 600;
const MARK = 1800;
const NEAR = 300;
const COL = 3;
const GAP = 10;
const BAND = [2, 0, 1, 3];
const ROLES = ["Workers", "Check", "Lead", "Helper"];
const ROLE_COLORS = [
  "var(--color-chart-blue)",
  "var(--color-chart-ochre)",
  "var(--color-ink)",
  "var(--faint)",
];
const CHECK_COLORS: Record<number, string> = {
  1: "var(--color-chart-green)",
  0: "var(--color-chart-red)",
  2: "var(--faint)",
};
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

type Row = {
  from: number;
  to: number;
  card: TimelineData["cards"][number] | null;
};
type Bar = {
  x: number;
  from: number;
  to: number;
  color: string;
  span?: boolean;
};

function date(t0: number, at: number, time = false) {
  const d = new Date((t0 + at) * 1000);
  const day = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  if (!time) return day;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${day} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

// A mark takes the first column free at its start, so a burst spreads out sideways.
function columns(
  starts: number[],
  ends: number[],
  free: (end: number, start: number) => boolean,
) {
  const taken: number[] = [];
  const cols = starts.map((start, i) => {
    let col = taken.findIndex((end) => free(end, start));
    if (col < 0) col = taken.push(0) - 1;
    taken[col] = ends[i];
    return col;
  });
  return { cols, count: taken.length };
}

function at(row: Row, t: number) {
  return `${(((t - row.from) / (row.to - row.from)) * 100).toFixed(3)}%`;
}

// Bars cut to the row, in minutes from its start; the slice stretches to the row's height.
function Slice({
  row,
  bars,
  width,
  className,
}: {
  row: Row;
  bars: Bar[];
  width: number;
  className: string;
}) {
  const paths = new Map<string, string>();
  for (const bar of bars) {
    const from = Math.round((Math.max(bar.from, row.from) - row.from) / 60);
    const to = Math.round((Math.min(bar.to, row.to) - row.from) / 60);
    if (to <= from) continue;
    const key = `${bar.span ? "span" : "mark"} ${bar.color}`;
    paths.set(key, `${paths.get(key) ?? ""}M${bar.x} ${from}v${to - from}`);
  }
  return (
    <svg
      aria-hidden="true"
      className={`${styles.slice} ${className}`}
      viewBox={`0 0 ${width} ${Math.round((row.to - row.from) / 60)}`}
      preserveAspectRatio="none"
    >
      {[...paths].map(([key, d]) => {
        const [kind, color] = key.split(" ");
        return <path key={key} className={styles[kind]} stroke={color} d={d} />;
      })}
    </svg>
  );
}

export function TeamTimeline({ data }: { data: TimelineData }) {
  const agents = [...data.agents].sort((a, b) => a[1] - b[1]);
  const bands = [0, 1, 2, 3].map((role) => {
    const own = agents.filter(([r]) => r === role);
    return {
      own,
      ...columns(
        own.map((a) => a[1]),
        own.map((a) => a[2]),
        (end, start) => end < start - 1,
      ),
    };
  });
  const width = bands.reduce((sum, band) => sum + band.count * COL, 3 * GAP);
  const right: number[] = [];
  let x = width;
  for (const role of BAND) {
    right[role] = x;
    x -= bands[role].count * COL + GAP;
  }
  const agentBars: Bar[] = bands.flatMap(({ own, cols }, role) =>
    own.flatMap(([, start, end, segments], i) => {
      const bx = right[role] - (cols[i] + 0.5) * COL;
      const marks: Bar[] = [];
      for (let j = 0; j < segments.length; j += 2) {
        marks.push({
          x: bx,
          from: segments[j] * BIN,
          to: (segments[j + 1] + 1) * BIN,
          color: ROLE_COLORS[role],
        });
      }
      return [
        {
          x: bx,
          from: start * BIN,
          to: (end + 1) * BIN,
          color: ROLE_COLORS[role],
          span: true,
        },
        ...marks,
      ];
    }),
  );

  const bugs = columns(
    data.bugs,
    data.bugs.map((t) => t + MARK),
    (end, start) => end <= start - NEAR,
  );
  const bugWidth = bugs.count * COL;
  const bugBars: Bar[] = data.bugs.map((t, i) => ({
    x: bugWidth - (bugs.cols[i] + 0.5) * COL,
    from: t,
    to: t + MARK,
    color: "var(--color-chart-red)",
  }));

  const checks = columns(
    data.runs.map(([t]) => t),
    data.runs.map(([t]) => t + MARK),
    (end, start) => end <= start - NEAR,
  );
  const checkWidth = checks.count * COL;
  const checkBars: Bar[] = data.runs.map(([t, ok], i) => ({
    x: (checks.cols[i] + 0.5) * COL,
    from: t,
    to: t + MARK,
    color: CHECK_COLORS[ok],
  }));

  const bounds = [0, ...data.cards.map((card) => card.at), data.end];
  const rows: Row[] = bounds.slice(1).map((to, k) => ({
    from: bounds[k],
    to,
    card: k ? data.cards[k - 1] : null,
  }));
  const rowOf = (t: number) => rows.find((row) => t >= row.from && t < row.to);
  const days = Array.from(
    { length: Math.ceil(data.end / DAY) },
    (_, d) => d * DAY,
  );

  const vars = {
    "--vw": `${width}px`,
    "--bug-ratio": bugWidth / width,
    "--ck-ratio": checkWidth / width,
  } as CSSProperties;
  const lane = (role: number) => {
    const center = right[role] - (bands[role].count * COL) / 2;
    return {
      right: `calc(100% - var(--x) + var(--gap-l) + var(--agents-w) * ${((width - center) / width).toFixed(3)})`,
      translate: "50% 0",
      "--d": `${BAND.indexOf(role) * 15}px`,
    } as CSSProperties;
  };
  const swatch = (color: string) => <i style={{ background: color }} />;

  return (
    <figure
      className={styles.root}
      style={vars}
      aria-label="The forty days on one vertical timeline: one line per agent by role, bugs found and checks beside the line, every finding and decision as a card"
    >
      <div className={styles.head}>
        <TimelineHud
          t0={data.t0}
          end={data.end}
          slot={data.slot}
          phases={data.phases}
          hud={data.hud}
          slots={data.slots}
        />
        <div className={styles.lanes}>
          <span
            className={`${styles.rise} ${styles.desktop}`}
            style={
              {
                right:
                  "calc(100% - var(--x) + var(--gap-l) + var(--agents-w) + 14px)",
                "--d": "60px",
              } as CSSProperties
            }
          >
            {swatch("var(--color-chart-red)")}Bugs
          </span>
          {BAND.map((role) => (
            <span
              key={role}
              className={`${styles.rise} ${styles.desktop}`}
              style={lane(role)}
            >
              {swatch(ROLE_COLORS[role])}
              {ROLES[role]}
            </span>
          ))}
          <span
            className={`${styles.rise} ${styles.desktop}`}
            style={
              {
                left: "calc(var(--x) + var(--ck-l))",
                "--d": "10px",
              } as CSSProperties
            }
          >
            {swatch("var(--color-chart-green)")}Passed&nbsp;&nbsp;
            {swatch("var(--color-chart-red)")}Failed
          </span>
          <span
            className={`${styles.rise} ${styles.desktop}`}
            style={{ left: "var(--cd-l)", "--d": "30px" } as CSSProperties}
          >
            Insight
          </span>
          <span
            className={`${styles.rise} ${styles.mobile}`}
            style={{ left: 0 }}
          >
            {BAND.map((role) => (
              <span key={role}>
                {swatch(ROLE_COLORS[role])}
                {ROLES[role]}&nbsp;&nbsp;
              </span>
            ))}
          </span>
          <span
            className={`${styles.rise} ${styles.mobile} ${styles.second}`}
            style={{ left: 0 }}
          >
            {swatch("var(--color-chart-green)")}Check passed&nbsp;&nbsp;
            {swatch("var(--color-chart-red)")}failed
          </span>
          <i className={styles.rule} />
        </div>
      </div>
      <div className={styles.line} data-line>
        <div className={styles.cue} aria-hidden="true">
          <span>Scroll</span>
          <div className={styles.track} />
          <i className={styles.ball} />
        </div>
        <div className={styles.spine} data-spine />
        <i className={styles.tip} aria-hidden="true" />
        <div className={styles.start}>
          <span className={styles.phaseName}>{data.phases[0][0]}</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.from}
            className={`${styles.row} ${row.card ? styles.carded : ""}`}
            style={{ "--days": (row.to - row.from) / DAY } as CSSProperties}
            data-from={row.from}
            data-to={row.to}
          >
            <Slice
              row={row}
              bars={agentBars}
              width={width}
              className={styles.agents}
            />
            <Slice
              row={row}
              bars={bugBars}
              width={bugWidth}
              className={styles.bugs}
            />
            <Slice
              row={row}
              bars={checkBars}
              width={checkWidth}
              className={styles.checks}
            />
            {days
              .filter((t) => rowOf(t) === row)
              .map((t) => (
                <div key={t} aria-hidden="true">
                  <span
                    className={`${styles.day} ${new Date((data.t0 + t) * 1000).getUTCDay() === 1 ? styles.monday : ""}`}
                    style={{ top: at(row, t) }}
                  >
                    {date(data.t0, t)}
                  </span>
                  <i className={styles.tick} style={{ top: at(row, t) }} />
                </div>
              ))}
            {data.phases.slice(1).map(([name, t]) =>
              rowOf(t) === row ? (
                <div
                  key={name}
                  className={styles.phaseMark}
                  style={{ top: at(row, t) }}
                >
                  <span className={styles.phaseName}>{name}</span>
                </div>
              ) : null,
            )}
            {row.card ? (
              <>
                <i
                  className={`${styles.node} ${row.card.tag === "incident" ? styles.incident : ""}`}
                />
                <i className={styles.link} />
                <div
                  className={`${styles.card} ${row.card.tag === "incident" ? styles.incident : ""}`}
                  data-card
                >
                  <span className={styles.cardMeta}>
                    {date(data.t0, row.card.at, !row.card.dated)} ·{" "}
                    {row.card.tag}
                  </span>
                  <p className={styles.cardTitle}>
                    <span className={styles.number}>
                      {data.cards.indexOf(row.card) + 1}
                    </span>
                    {row.card.title}
                  </p>
                  <p className={styles.cardText}>{row.card.text}</p>
                </div>
              </>
            ) : null}
          </div>
        ))}
        <div className={styles.end} />
      </div>
    </figure>
  );
}

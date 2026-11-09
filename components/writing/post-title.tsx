// A whole word like "+282,006" or "−247,355": a diff stat, colored as on GitHub.
const STAT = /(?<=^|\s)([+−-]\d[\d,]*)(?=\s|$)/;

export function PostTitle({ title }: { title: string }) {
  return title.split(STAT).map((part) =>
    STAT.test(part) ? (
      <span
        key={part}
        className={part.startsWith("+") ? "text-chart-green" : "text-chart-red"}
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

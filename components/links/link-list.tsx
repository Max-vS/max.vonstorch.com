import { existsSync } from "node:fs";
import { join } from "node:path";
import { PanelControl } from "@/components/tiles/panel-control";
import { links, panelControls } from "@/content/site";

const CARD_ROWS = 2;

/** "https://www.example.com/" as "example.com". */
function domain(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

/** The CV download, then the liked links: the first two, or with `all` every one. */
export function LinkList({ all = false }: { all?: boolean }) {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));
  const rows = all ? links.liked : links.liked.slice(0, CARD_ROWS);
  return (
    <>
      {hasCv ? (
        <a
          href={links.cv.href}
          download
          className="flex min-h-38 shrink-0 items-center justify-between bg-links-black px-16 font-mono text-[length:--spacing(10)] text-links-chartreuse uppercase tracking-[0.06em] transition-colors duration-200 hover:bg-ink hover:text-ground sm:min-h-44 sm:text-[length:--spacing(11)]"
        >
          <span>{links.cv.label}</span>
          <span>{links.cv.format}</span>
        </a>
      ) : null}
      <ul className="min-h-0 flex-1 overflow-y-auto border-ink border-t-[1.5px]">
        {rows.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="row-nudge flex items-baseline gap-12 border-ink/18 border-b py-9 sm:py-7"
            >
              <span className="truncate font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
                {link.label}
              </span>
              <span className="truncate text-[length:--spacing(12)] text-muted sm:text-[length:--spacing(14)]">
                {domain(link.href)}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {links.liked.length > CARD_ROWS ? (
        <PanelControl href={all ? "/links" : "/links/all"}>
          {all ? panelControls.less : panelControls.more}
        </PanelControl>
      ) : null}
    </>
  );
}

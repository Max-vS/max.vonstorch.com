import { existsSync } from "node:fs";
import { join } from "node:path";
import { PanelControl } from "@/components/tiles/panel-control";
import { ListRow } from "@/components/ui/list-row";
import { links, panelControls } from "@/content/site";

const CARD_ROWS = 2;

function domain(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

export function LinkList({ all = false }: { all?: boolean }) {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));
  const rows = all ? links.liked : links.liked.slice(0, CARD_ROWS);
  return (
    <>
      {hasCv ? (
        <a
          href={links.cv.href}
          className="caption flex min-h-38 shrink-0 items-center justify-between bg-links-black px-16 text-links-chartreuse transition-colors duration-200 hover:bg-ink hover:text-ground sm:min-h-44"
        >
          <span>{links.cv.label}</span>
          <span>{links.cv.format}</span>
        </a>
      ) : null}
      <ul className="min-h-0 flex-1 overflow-y-auto border-ink border-t-[1.5px]">
        {rows.map((link) => (
          <li key={link.href}>
            <ListRow
              href={link.href}
              title={link.label}
              sub={domain(link.href)}
            />
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

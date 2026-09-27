import { existsSync } from "node:fs";
import { join } from "node:path";
import { PanelText } from "@/components/tiles/panel-text";
import { cv, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.cv);

export default function CvPage() {
  const hasPdf = existsSync(join(process.cwd(), "public", "cv.pdf"));
  return (
    <>
      <PanelText>{cv.body}</PanelText>
      {hasPdf ? (
        <div className="flex items-center gap-14">
          <a
            href={cv.download.href}
            download
            className="inline-flex min-h-40 items-center rounded-full border-[1.5px] border-ink bg-ink px-18 font-mono text-[length:--spacing(10)] text-ground tracking-[0.06em] sm:text-[length:--spacing(11)]"
          >
            {cv.download.label}
          </a>
          <span className="font-mono text-[length:--spacing(9)] text-muted tracking-[0.04em] sm:text-[length:--spacing(10)]">
            {cv.download.updated}
          </span>
        </div>
      ) : null}
    </>
  );
}

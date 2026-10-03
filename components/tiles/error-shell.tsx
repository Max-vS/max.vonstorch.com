"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { textLinkVariants } from "@/components/ui/text-link";
import { errors } from "@/content/site";
import { PageNav } from "./page-nav";
import { Panel } from "./panel";
import { TitleBlock } from "./title-block";
import { useGrid } from "./use-grid";

/** The tile shell's title block and panel without the tiles, because the tile engine may be what failed. */
export function ErrorShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  // Without the tile shell, nothing else resizes the blocks with the window.
  useGrid();
  return (
    <div className="fixed inset-0 overflow-hidden [--spacing:calc(var(--tile)/65)] sm:[--spacing:calc(var(--tile)/90)]">
      <TitleBlock page={{ id: "index", kicker, title }} away={false} />
      <Panel>
        <main className="flex flex-col items-start gap-10 sm:gap-14">
          {children}
          <Link href="/" className={textLinkVariants({ variant: "action" })}>
            {errors.home}
          </Link>
        </main>
        <div className="mt-auto">
          <PageNav />
        </div>
      </Panel>
    </div>
  );
}

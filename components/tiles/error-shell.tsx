"use client";

import type { ReactNode } from "react";
import { PageNav } from "./page-nav";
import { Panel } from "./panel";
import { TitleBlock } from "./title-block";
import { useGrid } from "./use-grid";

export function ErrorShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  // Nothing else resizes the blocks with the window here.
  useGrid();
  return (
    <div className="fixed inset-0 overflow-hidden">
      <TitleBlock page={{ id: "index", kicker, title }} away={false} />
      <Panel>
        <main className="flex flex-col items-start gap-10 sm:gap-14">
          {children}
        </main>
        <div className="mt-auto">
          <PageNav />
        </div>
      </Panel>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PanelText } from "@/components/tiles/panel-text";
import { TileShell } from "@/components/tiles/tile-shell";
import { textLinkVariants } from "@/components/ui/text-link";
import { errors } from "@/content/site";

export const metadata: Metadata = { title: errors.notFound.title };

// Outside the (tiles) layout, so it brings its own shell with the 404 pattern.
export default function NotFound() {
  return (
    <TileShell page={{ id: "notFound", ...errors.notFound }}>
      <PanelText>{errors.notFound.body}</PanelText>
      <Link href="/" className={textLinkVariants({ variant: "action" })}>
        {errors.home}
      </Link>
    </TileShell>
  );
}

import { TileShell } from "@/components/tiles/tile-shell";

export default function TilesLayout({ children }: LayoutProps<"/">) {
  return <TileShell>{children}</TileShell>;
}

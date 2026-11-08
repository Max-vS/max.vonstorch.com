import { TileShell } from "@/components/tiles/tile-shell";

export default function TilesLayout({ children, reader }: LayoutProps<"/">) {
  return <TileShell reader={reader}>{children}</TileShell>;
}

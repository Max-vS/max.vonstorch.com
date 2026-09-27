import { PanelText } from "@/components/tiles/panel-text";
import { music, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(pages.music);

export default function MusicPage() {
  return <PanelText>{music.fallback}</PanelText>;
}

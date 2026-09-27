import { Fragment } from "react";
import { PanelText } from "@/components/tiles/panel-text";
import { TextLink } from "@/components/ui/text-link";
import { music, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { getTopTracks } from "@/lib/queries/spotify";

export const metadata = pageMetadata(pages.music);

export default async function MusicPage() {
  const tracks = await getTopTracks();
  if (tracks.length === 0) return <PanelText>{music.fallback}</PanelText>;
  return (
    <PanelText>
      {music.intro}{" "}
      {tracks.map((track, index) => (
        <Fragment key={track.url}>
          {index > 0 ? " · " : null}
          <TextLink href={track.url} target="_blank" rel="noopener">
            {track.title} — {track.artist}
          </TextLink>
        </Fragment>
      ))}
      .
    </PanelText>
  );
}

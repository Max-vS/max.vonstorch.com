import Image from "next/image";
import { PanelText } from "@/components/tiles/panel-text";
import { music, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { getTopTracks } from "@/lib/queries/spotify";

export const metadata = pageMetadata(pages.music);

export default async function MusicPage() {
  const tracks = await getTopTracks();
  if (tracks.length === 0) return <PanelText>{music.fallback}</PanelText>;
  return (
    <>
      <PanelText>{music.heading}</PanelText>
      <ul className="flex flex-col divide-y divide-ink/18">
        {tracks.map((track) => (
          <li key={track.url}>
            <a
              href={track.url}
              target="_blank"
              rel="noopener"
              className="row-nudge grid grid-cols-[--spacing(44)_minmax(0,1fr)] items-center gap-x-14 py-4 sm:py-6"
            >
              {track.cover ? (
                <Image
                  src={track.cover}
                  alt={track.album}
                  width={64}
                  height={64}
                  sizes="64px"
                  className="size-44 object-cover"
                />
              ) : (
                <span className="size-44 bg-ink" />
              )}
              {/* Trimmed to cap height and baseline, so centering leaves the same space above the title and below the artist; clipped only sideways, because the trim would cut off descenders. */}
              <span className="flex min-w-0 flex-col gap-7 sm:gap-9 [&>*]:[text-box:trim-both_cap_alphabetic]">
                <span className="overflow-x-clip text-ellipsis whitespace-nowrap font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
                  {track.title}
                </span>
                <span className="overflow-x-clip text-ellipsis whitespace-nowrap text-[length:--spacing(12)] text-muted sm:text-[length:--spacing(14)]">
                  {track.artist}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

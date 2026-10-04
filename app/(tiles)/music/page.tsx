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
    <ul className="flex flex-col divide-y divide-ink/18">
      {tracks.map((track) => (
        <li key={track.url}>
          <a
            href={track.url}
            target="_blank"
            rel="noopener"
            className="grid grid-cols-[--spacing(44)_minmax(0,1fr)_auto] items-center gap-x-14 py-9 [transition:padding_300ms_cubic-bezier(0.19,0.8,0.12,1)] hover:pl-8 sm:py-7"
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
            <span className="flex min-w-0 flex-col gap-2">
              <span className="truncate font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
                {track.title}
              </span>
              <span className="truncate text-[length:--spacing(12)] text-muted sm:text-[length:--spacing(14)]">
                {track.artist}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="font-mono text-[length:--spacing(10)] text-muted sm:text-[length:--spacing(11)]"
            >
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

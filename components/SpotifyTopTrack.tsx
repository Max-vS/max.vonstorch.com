import Image from "next/image";
import { getTopTracks } from "@/lib/spotify";

interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
}

export async function SpotifyTopTrack() {
  const tracks = await getTopTracks();

  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {tracks.map((track: Track) => (
        <a
          key={track.url}
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 hover:opacity-80 transition-opacity"
        >
          {track.albumArt && (
            <Image
              src={track.albumArt}
              alt={track.album}
              width={40}
              height={40}
              className="w-10 h-10 object-cover"
              unoptimized
            />
          )}
          <div className="flex flex-col justify-center min-w-0">
            <div className="text-sm font-medium truncate">{track.title}</div>
            <div className="text-xs opacity-70 truncate">{track.artist}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

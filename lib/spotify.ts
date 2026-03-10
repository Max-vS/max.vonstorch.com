import "server-only";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN || "",
    }),
    next: { revalidate: 3600 }, // Cache access token for 1 hour
  });

  return response.json();
}

export async function getTopTracks() {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=3",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 43200 }, // Cache for 12 hours
      },
    );

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items.map(
        (track: {
          name: string;
          artists: { name: string }[];
          album: { name: string; images: { url: string }[] };
          external_urls: { spotify: string };
        }) => ({
          title: track.name,
          artist: track.artists
            .map((artist: { name: string }) => artist.name)
            .join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          url: track.external_urls.spotify,
        }),
      );
    }

    return [];
  } catch (error) {
    console.error("Spotify API error:", error);
    return [];
  }
}

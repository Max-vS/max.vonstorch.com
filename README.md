# max.vonstorch.com

Personal website built with Next.js, featuring custom ASCII art, WebGL shaders, and real-time integrations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Typography**: Helvetica Neue (custom fonts)
- **Runtime**: Bun
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics
- **Database**: Upstash Redis (view counter)

## Features

- Custom ASCII art animations
- WebGL shader background effects
- Spotify "Now Playing" integration
- Real-time view counter
- Grain effect overlay
- Fully responsive design

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun dev

# Lint & format
bun lint
bun format
```

## Environment Variables

Required environment variables (see `.env.local`):

- `SPOTIFY_CLIENT_ID` - Spotify API client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify API client secret
- `SPOTIFY_REFRESH_TOKEN` - Spotify refresh token
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token

## License

© 2026 Max von Storch. All rights reserved.

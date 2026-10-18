# max.vonstorch.com

The personal site of Max von Storch: one screen of Bauhaus tiles with eight pages (Index, Education, Projects, Writing, Music, Links, Contact, Community), articles that open in the Writing panel, a community wall of visitor patterns that the owner approves, and the owner's top Spotify tracks.

## Stack

- Next.js 16.4 (App Router, Cache Components, Turbopack), React 19.3 with the React Compiler, TypeScript 7
- Tailwind CSS 4, MDX through `@next/mdx`, Shiki
- Neon Postgres with Drizzle, Better Auth (GitHub sign-in for the owner only, Spotify link)
- Vercel (Node 24, Fluid compute, BotID, Web Analytics)
- Bun 1.3 as the package manager, Biome, lefthook

## Security

- Only the owner signs in: a GitHub account must carry the verified `OWNER_EMAIL`, checked before a user exists and again on every `/admin` request and action. Spotify only links to the owner's account; it never signs in.
- Visitor patterns: BotID, Zod on the server, 3 per IP and hour (the IP stored as a daily HMAC), at most 50 pending, nothing public until the owner approves it.
- Every response carries `frame-ancestors 'none'`, `nosniff`, a referrer policy and a permissions policy; Vercel adds HSTS. The database connection verifies Neon's certificate.

## Local development

Needs Node 24 and Bun 1.3.

```bash
bun install
cp .env.example .env.development.local   # then fill in the values
bun run db:mig                            # migrate the Neon dev branch
bun run dev
```

The dev server listens on http://127.0.0.1:3000, not `localhost`: Spotify accepts only HTTPS or `127.0.0.1` redirect URIs, and the auth cookies must live on the same host as the OAuth callbacks.

Locally, the database is the Neon `dev` branch of `personal-db` (pooled and direct URL from the Neon console or the Neon MCP). Reset it from `main` in Neon when you want fresh data. A production build needs the same env: `bun --env-file=.env.development.local run build`.

## Scripts

| Script | Does |
|---|---|
| `bun run dev` | Dev server on http://127.0.0.1:3000 |
| `bun run build` / `bun run start` | Production build / server |
| `bun run lint` / `bun run format` | Biome check / format |
| `bun run typecheck` | Route types, then `tsc` |
| `bun run db:gen` | New SQL migration in `drizzle/` from `lib/db/schema.ts` (commit it) |
| `bun run db:mig` | Apply migrations (Vercel runs it before every build) |
| `bun run auth:gen` | Regenerate the Better Auth tables in `lib/db/schema/auth.ts` |

## Editing content

- **Texts and links:** `content/site.ts`. Every page text, kicker and link lives there.
- **Posts:** one `content/writing/<slug>.mdx` per post, with frontmatter `title`, `date` (`YYYY-MM-DD`), `summary` (the lede), optional `updated`, and optional `url` for a post on another site (listed and linked, no page here). A wrong field fails the build. The slugs `archive` and `feed.xml` are taken. Keep at least one local post.
- **Links:** put your CV at `public/cv.pdf`; the Links page lists it first while the file exists. Add more links in `links.liked` in `content/site.ts`.
- **Favicons:** `bun scripts/make-icons.ts` writes `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png`; commit them.

## Deployment

`main` deploys to production; every other branch gets a preview. The build command in `vercel.json` runs the migrations first.

| Variable | Production | Preview | Development |
|---|---|---|---|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon integration (`main` branch) | Neon `dev` branch, set by hand | Neon `dev` branch |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | a different value | a different value |
| `BETTER_AUTH_URL` | `https://max.vonstorch.com` | not set (taken from the request) | `http://127.0.0.1:3000` |
| `OWNER_EMAIL` | your verified GitHub email | same | same |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | production app | production app | local app |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Spotify app | same | same |
| `IP_HASH_SECRET` | `openssl rand -base64 32` | own value | own value |

- A GitHub OAuth app allows one callback URL, so production (`https://max.vonstorch.com/api/auth/callback/github`) and local development (`http://127.0.0.1:3000/api/auth/callback/github`) each have their own app. Owner sign-in works only on production and locally, not on preview URLs.
- The Spotify app lists both redirect URIs (`…/api/auth/callback/spotify` on both hosts); its owner needs Spotify Premium. The link expires after 6 months, then use Reconnect on `/admin`.
- Vercel project: "Automatically expose System Environment Variables" on, Node.js 24.x, Web Analytics on. The old site is tagged `v1`.

## Still open

1. Sign in on `/admin` and connect Spotify.
2. Vercel: delete the old Upstash KV and Blob stores; their env vars are already gone.
3. Google Search Console: add a Domain property for `vonstorch.com`, verified with a DNS TXT record at IONOS on the apex (`max` is a CNAME, so it cannot hold the TXT record). Submit `https://max.vonstorch.com/sitemap.xml`, then URL Inspection → Request indexing for `/` and `/writing`. Then import the site into Bing Webmaster Tools.
4. Profile links: set `https://max.vonstorch.com` as the website on GitHub, LinkedIn and X, with the same name "Max von Storch" everywhere.
5. Content: the X handle (`X_PROFILE_URL_TODO` in `content/site.ts`), the CV at `public/cv.pdf`, more posts in `content/writing/`, and optionally a real photo for the structured data (`Person.image`).

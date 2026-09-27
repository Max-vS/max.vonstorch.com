# max.vonstorch.com

The personal site of Max von Storch: one screen of Bauhaus tiles with eight pages (Index, Education, Projects, Writing, Music, CV, Contact, Community), articles in a plain reading layout, a community wall of visitor marks that the owner approves, and the owner's top Spotify tracks.

Design spec: `docs/superpowers/specs/2026-09-27-tile-site-design.md`. Design files: `docs/design/tile-system/`.

## Stack

- Next.js 16.3 (App Router, Cache Components, Turbopack), React 19.3 with the React Compiler, TypeScript 7
- Tailwind CSS 4, MDX through `@next/mdx`, Shiki
- Neon Postgres with Drizzle, Better Auth (GitHub sign-in for the owner only, Spotify link)
- Vercel (Node 24, Fluid compute, BotID, Web Analytics)
- Bun 1.3 as the package manager, Biome, lefthook

## Local development

Needs Node 24 and Bun 1.3.

```bash
bun install
cp .env.example .env.development.local   # then fill in the values
bun run db:local                          # local Postgres (PGlite) on 127.0.0.1:5433; keep it running
bun run db:mig                            # in a second terminal
bun run dev -- -H 127.0.0.1
```

Open http://127.0.0.1:3000, not `localhost`: Spotify accepts only HTTPS or `127.0.0.1` redirect URIs.

For PGlite, both database URLs are `postgres://postgres:postgres@127.0.0.1:5433/postgres?sslmode=disable`. A production build needs the same env: `bun --env-file=.env.development.local run build`.

## Scripts

| Script | Does |
|---|---|
| `bun run dev` | Dev server |
| `bun run build` / `bun run start` | Production build / server |
| `bun run lint` / `bun run format` | Biome check / format |
| `bun run typecheck` | Route types, then `tsc` |
| `bun run db:gen` | New SQL migration in `drizzle/` from `lib/db/schema.ts` (commit it) |
| `bun run db:mig` | Apply migrations (Vercel runs it before every build) |
| `bun run db:local` | Local PGlite database |
| `bun run auth:gen` | Regenerate the Better Auth tables in `lib/db/schema/auth.ts` |

## Editing content

- **Texts and links:** `content/site.ts`. Every page text, kicker and link lives there.
- **Posts:** one `content/writing/<slug>.mdx` per post, with frontmatter `title`, `date` (`YYYY-MM-DD`), `summary`, optional `updated`, and optional `url` for a post on another site (listed and linked, no page here). A wrong field fails the build. The slugs `archive` and `feed.xml` are taken. Keep at least one local post.
- **CV:** put the file at `public/cv.pdf` and set the month in `cv.download.updated` in `content/site.ts`. The download button shows only while the file exists.
- **Favicons:** `bun scripts/make-icons.ts` writes `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png`; commit them.

## Setup before launch

Accounts and settings for the owner, in order.

1. **Neon:** add Neon from the Vercel Marketplace (Free plan, region `iad1` like the functions) for Production and Preview. Neon Auth off. In the integration, turn on Preview branching and "Resource must be active before deployment".
2. **GitHub OAuth apps:** one app allows one callback URL, so create two:
   - production: `https://max.vonstorch.com/api/auth/callback/github`
   - local: `http://127.0.0.1:3000/api/auth/callback/github`

   Owner sign-in works only on production and locally, not on preview URLs.
3. **Spotify app:** redirect URIs `https://max.vonstorch.com/api/auth/callback/spotify` and `http://127.0.0.1:3000/api/auth/callback/spotify`. The app owner needs Spotify Premium. After launch, connect Spotify on `/admin`; the link expires after 6 months, then use Reconnect.
4. **Env vars** in Vercel (Development values go in `.env.development.local`):

   | Variable | Production | Preview | Development |
   |---|---|---|---|
   | `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon integration | Neon integration (own branch per preview) | PGlite or your own Neon branch |
   | `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | a different value | a different value |
   | `BETTER_AUTH_URL` | `https://max.vonstorch.com` | not set (taken from the request) | `http://127.0.0.1:3000` |
   | `OWNER_EMAIL` | your verified GitHub email | same | same |
   | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | production app | production app | local app |
   | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Spotify app | same | same |
   | `IP_HASH_SECRET` | `openssl rand -base64 32` | own value | own value |

5. **Vercel project settings:** turn on "Automatically expose System Environment Variables" (auth trusts only the deployment's own hosts). Reset the Install and Build Command overrides to the default; `vercel.json` sets the build command (migrations, then `next build`). Keep Node.js 24.x and Web Analytics on.
6. **Git hooks:** after the merge, run `bunx lefthook install` once in the main checkout.
7. **Tag the old site:** `git tag v1 origin/main && git push origin v1`.
8. **Check the preview by hand:** admin gate (signed out, no admin page or action works), mark rate limit, BotID, text contrast.
9. **Merge** `personal-website` into `main`. The production build runs the migrations.
10. **Clean up:** delete the old Upstash and Blob stores and the env vars `KV_*`, `REDIS_URL`, `BLOB_READ_WRITE_TOKEN` and `SPOTIFY_REFRESH_TOKEN`.
11. **Google Search Console:** add a Domain property for `vonstorch.com`, verified with a DNS TXT record at IONOS on the apex (`max` is a CNAME, so it cannot hold the TXT record). Submit `https://max.vonstorch.com/sitemap.xml`, then URL Inspection → Request indexing for `/` and `/writing`.
12. **Bing Webmaster Tools:** import the site from Search Console.
13. **Profile links:** set `https://max.vonstorch.com` as the website on GitHub, LinkedIn and X, with the same name "Max von Storch" everywhere.
14. **Content still open:**
    - X handle: set `X_PROFILE_URL_TODO` in `content/site.ts`; Contact and the home page's structured data pick it up.
    - CV: `public/cv.pdf` and its month.
    - Real posts to replace `content/writing/sample-post.mdx`.
    - Optional: a real photo for the structured data (`Person.image`).

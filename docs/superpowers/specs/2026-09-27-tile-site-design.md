# max.vonstorch.com v2 — Tile System: design spec

- **Date:** 2026-09-27
- **Status:** implemented on `personal-website` (2026-09-27). §22 lists what changed during implementation; where it disagrees with an earlier section, §22 wins.
- **Branch:** `personal-website`
- **Design source:** Claude Design canvas "Personal Website" — https://claude.ai/artifact/WpPUEUFrEoAV1bd9JfJMnJ — round 5, item 23 ("Tile System")
- **Research:** `docs/superpowers/research/2026-09-27-*.md` (exact commands, config snippets and sources for every decision below)

---

## 1. Goal and success criteria

Replace the current site with the tile-system design: one screen, a grid of Bauhaus tiles, eight pages, a community wall, live Spotify tracks and articles.

The work is done when:

1. The site looks and moves like design #23 on desktop and on mobile.
2. All 8 pages have their own URL, server-rendered text and correct metadata.
3. A visitor can paint and submit a mark on desktop and on mobile. No mark is public before the owner approves it.
4. The Music page shows the owner's live top 3 Spotify tracks.
5. Google can index every page. The home page title contains "Max von Storch".
6. The Vercel build passes (it includes the type check) and Biome reports no errors.

## 2. Scope

**In v1**

- 8 tile pages: Index, Education, Projects, Writing, Music, CV, Contact, Community
- Article pages and an "All posts" page in a plain reading layout
- Community marks with owner approval on `/admin`
- Owner login (Better Auth), Spotify connection on `/admin`
- SEO basics: metadata, structured data, share images, sitemap, robots, RSS, favicons

**Not in v1**

- Visitor accounts. Visitors never log in. Later comments stay anonymous and moderated; later likes are one per browser.
- Comments, likes, post stats (the Postgres schema leaves room for them)
- Email alerts for new marks (`/admin` shows the pending count)
- shadcn/ui, a headless UI library, an animation library (add later only when a design needs them)
- A test suite (owner decision). Checks: Biome, the type check in `next build`, and a manual check of each step on the Vercel preview.
- The final article-page design (the owner designs it later in Claude Design; it then replaces the plain reading layout)

## 3. Design source

The design files are in `docs/design/tile-system/`. They are the source of truth for shapes, colors, patterns, sizes, timings and easings. Port values exactly unless this spec says otherwise.

| File | Content |
|---|---|
| `Truchet.dc.html` | Desktop tile system (1440×900, 16×10 tiles of 90 px) — the main reference |
| `MobileTiles.dc.html` | Mobile tile system (390×910, 6×14 tiles of 65 px) |
| `TileLibrary.dc.html` | Final pattern set: 7 pages × 3 patterns |
| `CVPalettes.dc.html` | CV palette options; option B (chartreuse `#C7F03A` + `#111111`) is the one in use |

Key values from the files:

- **Fonts:** Familjen Grotesk (400–700) for text, JetBrains Mono (400, 500) for small labels
- **Colors:** ground `#EFEBE4`, ink `#1D1D1B`; Projects uses Dryft blue `#1F3DFF` (the design's `dryftBlue` default)
- **Desktop reference layout:** title block 8×3 tiles (top left), panel 5×4 tiles (bottom right), pattern indicator 3×1 tiles (bottom left)
- **Mobile reference layout:** title block 5×3 tiles (top left), panel 5×6 tiles (bottom right)
- **Timings:** tile flip 260 ms (swap at 270 ms), turn 700 ms, scale 500 ms, title color 600 ms; wave delay 45 ms × distance from the start corner; idle turn every 450–950 ms; wheel threshold 70 with a 1150 ms lock; swipe threshold 50 px. Easings as in the `tt-*` CSS classes of the design.

| Page | Title color | Patterns (1 · 2 · 3) |
|---|---|---|
| Index | `#1D1D1B` | Bauhaus · Rings · Petals |
| Education | `#F2C14E` | Routes · Waves · Steps |
| Projects | `#1F3DFF` | Wedges · Stripes · Machine |
| Writing | `#33503A` | Squares · Arcs · Triangles |
| Music | `#FF6A13` | Records · Dots · Chevrons |
| CV | `#C7F03A` | Pinwheel · Frames · Moons |
| Contact | `#E2573B` | Pulse · Speech · Confetti |
| Community | `#E9B8A6` | visitor marks |

## 4. Decisions

| Topic | Decision | Reason |
|---|---|---|
| Repo | Keep this repo; build on `personal-website`; tag the old site `v1` | Vercel project, domain and history stay; previews per push |
| Framework | Next.js 16 App Router | Already set up; a persistent layout keeps the grid alive across pages |
| Tile engine | React + SVG, logic as pure TypeScript, CSS transitions | Idiomatic; the React Compiler re-renders only changed tiles |
| Grid fit | Scale + fill (see §5) | Keeps the design's composition on every screen, no bars |
| Pages | 8 real routes, one shared layout | Back button, shareable links, SEO |
| Articles | MDX in the repo, own pages; external posts are listed and linked | Owner wants to publish mostly on this site |
| Article layout | Plain reading layout now; owner's Claude Design later | The tile design has no article page |
| Database | Neon Postgres (Vercel Marketplace) + Drizzle | Likes, comments and stats are planned later |
| Auth | Better Auth, self-hosted, owner only | Owner's choice; tables live in the same database |
| Forms | React Hook Form + Zod | Nothing is clearly better today (TanStack Form v2 is alpha, Conform's API is experimental) |
| UI library | None; about 5 own components | The design is custom; the admin page is small |
| Animation library | None | The design uses CSS transitions only; React 19.3 `<ViewTransition>` covers page effects |
| Community marks | 4×4 repeating motif; paint on desktop and mobile | Every mark fills every screen |
| Tests | None (owner decision) | See §2 |
| Versions | Always the newest version that is compatible with the rest of the stack | Owner rule |

## 5. Layout and grid

**Tile size (desktop, width ≥ 640 px):** `tile = clamp(64 px, min(width / 16, height / 10), 120 px)`. At least 16×10 tiles always fit. Extra space gets more tiles (`cols = ceil(width / tile)`, `rows = ceil(height / tile)`).

**Tile size (mobile, width < 640 px):** `tile = width / 6`, `cols = 6`, `rows = ceil(height / tile)`.

**Anchor:** the grid aligns to the bottom-right corner. Cut tiles fall at the top and left edges, mostly behind the title block.

| Element | Desktop | Mobile |
|---|---|---|
| Title block | top left; 8 tiles wide and 3 tiles high, minus the cut tile at the left and top edge | top left; 5×3 tiles minus the top cut |
| Panel | bottom right; 5×4 tiles | bottom right; 5×6 tiles |
| Pattern indicator | bottom left; 3×1 tiles (minus the left cut) | inside the panel, as in the design |

**No layout shift:** a tiny inline script in `<head>` computes `--tile`, `--cols`, `--rows`, `--cut-x` and `--cut-y` before the first paint and sets them on `<html>`. CSS positions the title block, panel and indicator from these variables. A resize listener updates them. Without JavaScript, a CSS `clamp()` fallback places the blocks approximately.

**Text** in the title block and panel scales with `--tile` (design sizes ÷ 90 px on desktop, ÷ 65 px on mobile).

## 6. Routes and structure

```
app/
  layout.tsx                    root: fonts, metadata base, Analytics, inline grid script
  (tiles)/layout.tsx            TileShell: grid + title block + panel frame + nav (persistent)
  (tiles)/page.tsx              /            Index
  (tiles)/education/page.tsx    /education
  (tiles)/projects/page.tsx     /projects
  (tiles)/writing/page.tsx      /writing     3 newest posts
  (tiles)/music/page.tsx        /music
  (tiles)/cv/page.tsx           /cv
  (tiles)/contact/page.tsx      /contact
  (tiles)/community/page.tsx    /community
  (reading)/layout.tsx          plain reading layout
  (reading)/writing/[slug]/page.tsx     article
  (reading)/writing/archive/page.tsx    "All posts"
  (reading)/writing/feed.xml/route.ts   RSS
  admin/layout.tsx              simple layout in site fonts and colors, noindex
  admin/page.tsx                /admin        pending + approved marks, Spotify status
  admin/login/page.tsx          /admin/login
  api/auth/[...all]/route.ts    Better Auth handler
  sitemap.ts, robots.ts, favicon.ico, icon.png, apple-icon.png
  not-found.tsx, error.tsx, global-error.tsx
components/        tiles/ (TileShell, TileGrid, Tile, TitleBlock, Panel, PageNav, PatternIndicator),
                   community/ (MarkBrowser, MarkPainter, BrushControls, MarkForm), ui/ (Button, TextField, TextArea, RadioSwatch)
lib/tiles/         shapes.ts, palettes.ts, patterns.ts, random.ts, grid.ts, motion.ts, types.ts
content/           site.ts (all page texts and links), writing.ts (post list + frontmatter schema), writing/*.mdx
db/                schema/ (marks.ts, auth.ts), index.ts (getDb), drizzle/ (generated SQL migrations)
auth/              auth.ts (config), auth-client.ts, dal.ts (requireOwner, server-only)
actions/           community.ts (submitMark), admin.ts (approveMark, deleteMark)
lib/               spotify.ts, marks.ts (queries), ip-hash.ts, metadata.ts (page metadata helper)
scripts/           seed-owner.ts, make-icons.ts
public/            cv.pdf (later)
docs/              design/, superpowers/
```

**How a page renders:** the `(tiles)` layout is a client shell that stays mounted. It reads the path, picks the page's palette and pattern, and runs the transition. Each `page.tsx` renders only its panel content on the server; the shell places it in the panel frame. The title block (kicker + H1) comes from `content/site.ts`, so every page has exactly one H1 in the server HTML. The nav uses real `<Link>` elements.

**First load:** the server sends the title block, panel and nav. The tiles are not server-rendered (the server does not know the window size, and random patterns would cause a hydration mismatch). After mount, the tiles ripple in from the corner.

## 7. Tile engine

**Modules** (pure TypeScript; no React inside):

| Module | Job |
|---|---|
| `shapes.ts` | The design's 38 motifs as SVG path data in a 120×120 box (`a`, `b`, `st` layers) |
| `palettes.ts` | Page colors (`I`, `TH`, `W`, `MU`, `CT`, CV and Dryft sets from the design) |
| `patterns.ts` | 21 pattern functions `(row, col, rng, state) → TileSpec`, ported 1:1 from the design |
| `random.ts` | Seeded random number generator (so a pattern can be repeated) |
| `grid.ts` | Tile size, cols, rows and cuts from the window size (§5) |
| `motion.ts` | Wave delays, flip schedule, idle-turn picks, pulse values |

**Behavior (as in the design):**

- Page change: each page starts with its first pattern; tiles flip in a wave from the top-left corner; the title color fades.
- Wheel (desktop) or vertical swipe (mobile): next / previous pattern of the page (it wraps around). The wave starts at the top-left for "next" and at the bottom-right for "previous".
- Hover (desktop) or tap (mobile) on a tile: it turns 90°; each direct neighbor turns with a 35 % chance.
- Idle: every 450–950 ms one random tile turns (or flips colors, for symmetric shapes). Not on Community.
- Contact "Pulse": dots scale in a wave.
- Reduced motion: no waves, no idle turns, no hover turns; patterns change at once.

**Additions (not in the design):**

- Arrow keys change the pattern; the pattern marks at the bottom left are buttons.
- The animation loop pauses when the tab is hidden.
- Tiles are `aria-hidden` and not focusable (except the 4×4 paint block in paint mode, §9).

**Rendering:** `TileGrid` renders one `Tile` per cell as an SVG. The React Compiler memoizes tiles; CSS transitions do the motion. One `requestAnimationFrame` loop runs only while something moves.

## 8. Pages and content

All texts and links live in `content/site.ts`. There is no CMS.

| Page | Kicker | Panel content |
|---|---|---|
| Index | FOUNDING ENGINEER · SAN FRANCISCO | H1 "Max von Storch". "Currently founding engineer at Dryft, building AI for manufacturing." |
| Education | Computer Science & Philosophy | "Computer science at TU Munich, CSEE and UC Berkeley. Philosophy at HFPH." (no link) |
| Projects | DRYFT & SIDE PROJECTS | "Founding engineer at Dryft, building AI for manufacturing." + "Rémi.fr · OpenEU · curava" (links below) + "dryft.ai ↗" |
| Writing | NOTES & ESSAYS | The 3 newest posts (title + date, each a link) + "All posts →" (`/writing/archive`) |
| Music | WHAT I LISTEN TO (proposed) | "My top 3 tracks lately: …" (title — artist, each links to Spotify); fallback line on error |
| CV | Résumé · one page | "Experience, education and skills on one page." + "DOWNLOAD CV · PDF ↓" and "UPDATED [MONTH YYYY]" — shown only when `public/cv.pdf` exists |
| Contact | Because it is and always will be about people | "GitHub · LinkedIn · X" (links; no email) |
| Community | Leave your mark | See §9 |

**Links from the old site:** Rémi.fr → https://www.xn--rmi-bma.fr/ · OpenEU → https://openeu.csee.tech/ · curava → https://www.curava.eu/ · Dryft → https://dryft.ai · GitHub → https://github.com/Max-vS · LinkedIn → https://www.linkedin.com/in/maxvonstorch/

**Writing:** one sample post from the design's placeholders (`content/writing/sample-post.mdx`). The build needs at least one local post.

**Content checklist (owner):**

- [ ] X handle (Contact, JSON-LD `sameAs`)
- [ ] Music kicker — confirm "WHAT I LISTEN TO" or give another
- [ ] CV PDF and its "updated" month (later)
- [ ] Real posts to replace the sample post (later)
- [ ] Optional: a Spotify profile link for Music; a real photo for the JSON-LD `Person.image`

## 9. Community

**Mark format:** one 4×4 motif of 16 tiles. Each tile: `{ shape, rot, fg, bg }`.

- `shape`: one of the 8 brush motifs of the design (`qdisc`, `half`, `tri`, `dot`, `qring`, `leaf`, `squares`, `arc`) or `none`
- `rot`: 0, 90, 180 or 270
- `fg`, `bg`: one of the 7 brush colors of the design (`#E2573B`, `#2F4FD8`, `#F2C14E`, `#9DB39A`, `#1D1D1B`, `#E9B8A6`, `#EFEBE4`)

The motif repeats over the whole grid from an origin cell (r0, c0): cell (row, col) shows motif tile ((row − r0) mod 4, (col − c0) mod 4). In browse mode the origin is the grid's first full cell. In paint mode the origin is the top-left cell of the master block (see Paint, step 4).

**Browse (desktop and mobile):** `/community` shows approved marks, newest first. Wheel, swipe or arrow keys move between marks (tile wave on each change). The panel shows "MARK n / N · date", the note in quotes, "— name", and "LEAVE YOUR MARK".

**Paint:**

1. "Leave your mark" starts paint mode. The grid shows an empty motif (shape `none`, ground `#EFEBE4` on all tiles). The default brush is `qdisc`, color `#E2573B`, ground `#EFEBE4` (as in the design).
2. The panel shows the brush: shape (8 radio buttons), color (7), ground (7), name (optional, max 40), note (required, max 140, with a live counter), Submit, Cancel.
3. A click or tap on any tile paints its motif cell with the brush; all copies update. A second click on a tile that already has the same brush turns it 90°.
4. The master block is the first fully visible 4×4 area that the title block and panel do not cover. It is outlined, and it is the motif origin. In paint mode it is focusable: arrow keys move, Enter or Space paints. On mobile the title block slides away in paint mode, so such an area always exists.

**Submit (Server Action `submitMark`):**

1. Vercel BotID check (`checkBotId()`); reject bots.
2. Zod validation with the shared schema: name ≤ 40 (trimmed, optional), note 1–140 (trimmed), exactly 16 tiles, only allowed values, at least 1 painted tile.
3. Rate limit in SQL: at most 3 marks per IP hash per rolling hour; if 50 or more marks are pending, reply "try again later".
4. Insert with `status = 'pending'`. Return the id.

The form uses React Hook Form with the same Zod schema (`import * as z from "zod"`). Rules for the React Compiler: use `useWatch` / `useFormState` (not `watch()` / context `formState`); after success, show a thank-you state instead of `reset()`; call the action inside `startTransition`. Server field errors map back with `setError`.

**Own pending mark:** after submit, the browser stores the mark in `localStorage` (id, tiles, name, note, date) and shows it first, labeled "Waiting for approval", until the approved list contains its id or 30 days pass.

**IP hash:** `HMAC-SHA256(IP_HASH_SECRET, ip + UTC date)`. No raw IP is stored. The hash changes every day.

**Admin (`/admin`):**

- Login at `/admin/login` (§10). Every admin page and every admin action calls `requireOwner()`.
- Pending marks (oldest first) as small previews (the motif shown 2×2) with name, note, date, Approve and Delete.
- Approved marks (newest first, 50 per page) with Delete.
- Pending count at the top. Spotify status with "Connect" / "Reconnect" (§11).
- `approveMark(id)`: `UPDATE marks SET status = 'approved', approved_at = now() WHERE id = $1 AND status = 'pending'`. `deleteMark(id)`: `DELETE`. Both call `updateTag('marks')`.
- Buttons are plain `<form action>` elements with a `useFormStatus` pending state (no form library).

**Caching:** approved marks are read in a `'use cache'` function with `cacheTag('marks')` and a long `cacheLife`. The page loads the 24 newest; browsing further loads the next 24 from a cached route. The database is read only after a change.

**Empty state:** "Be the first to leave your mark." over the Index "Bauhaus" pattern.

## 10. Auth (Better Auth, owner only)

- Self-hosted `better-auth` with the Drizzle adapter (provider `pg`). Tables: generated with `bun x auth@latest generate --output db/schema/auth.ts`, then migrated with drizzle-kit. Do not run `auth init` (it writes `.env` and assumes SQLite) and do not use `auth migrate` (Kysely only). Do not use Neon Auth (older Better Auth, beta SDK, no sign-up or rate-limit controls).
- Email + password with `emailAndPassword.disableSignUp: true`. `scripts/seed-owner.ts` creates the owner once (a second, temporary instance with sign-up on, public APIs only).
- `user.validateUserInfo` allows only `OWNER_EMAIL`.
- Sign-in from the browser with `authClient.signIn.email` (the HTTP handler runs the rate limit and origin check; a direct `auth.api.signInEmail` call in a Server Action would skip both). The login form uses React Hook Form + Zod.
- Rate limit: enabled with `storage: "database"` (memory storage does not work across Vercel instances); sign-in at most 5 per 15 minutes.
- `baseURL.allowedHosts`: built from `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_BRANCH_URL`, `VERCEL_URL`, plus `localhost:3000` and `127.0.0.1:3000`. Needs the Vercel setting "Automatically expose System Environment Variables".
- `BETTER_AUTH_SECRET` (≥ 32 characters) for each environment; `BETTER_AUTH_URL` for production and development only.
- Default secure cookies; `cookieCache` off. `server-only` is imported in `auth/dal.ts`, not in `auth/auth.ts` (the CLI must load that file).
- No `proxy.ts` in v1: session checks happen in pages (inside `<Suspense>`) and in every Server Action.
- Since Better Auth 1.7.3, auth requests fail when the database schema does not match. Migrations run in every build (§16).

## 11. Music (Spotify)

- Spotify is a Better Auth social provider (scope `user-top-read`) with `encryptOAuthTokens`, `accountLinking.trustedProviders: ["spotify"]`, `allowDifferentEmails` and `disableImplicitLinking`. The owner links it on `/admin` with `authClient.linkSocial({ provider: "spotify" })`.
- `getTopTracks()` in `lib/spotify.ts`: `'use cache'`, `cacheTag('spotify')`, `cacheLife('hours')`. It gets the token with `auth.api.getAccessToken` for the owner (Better Auth refreshes and rotates it), calls `GET /v1/me/top/tracks?time_range=short_term&limit=3`, checks `res.ok`, and handles 429. On any error it sets `cacheLife('minutes')` and returns `[]`; the panel then shows "Spotify is quiet right now." A Spotify error never fails the build.
- `/admin` shows the status: connected, or "Reconnect" when the refresh fails.
- Spotify rules (2026): refresh tokens expire 6 months after authorization; the app owner needs Premium (the owner has it); redirect URIs must use HTTPS or `127.0.0.1` (not `localhost`). So local development runs on `http://127.0.0.1:3000`.
- Redirect URIs in the Spotify app: `https://max.vonstorch.com/api/auth/callback/spotify` and `http://127.0.0.1:3000/api/auth/callback/spotify`. Preview deployments cannot connect Spotify and show the fallback line.

## 12. Writing (MDX)

- Official `@next/mdx` with Turbopack. remark/rehype plugins are passed as strings with JSON options (Turbopack cannot take functions). `mdx-components.tsx` is required.
- Plugins: `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`, `@shikijs/rehype` (dual theme with `light-dark()`), `rehype-mdx-import-media` (images through `next/image`).
- `content/writing.ts` lists posts with `import.meta.glob('./writing/*.mdx', { eager: true })`. The glob must stay inside `content/` (a `../` pattern returns nothing in Next 16.3.6). Frontmatter schema (Zod): `title`, `date`, `summary`, optional `updated`, optional `url` (external post: listed and linked, no page). A bad field fails the build.
- `/writing/[slug]`: `generateStaticParams` (at least one post) + `generateMetadata`. No `dynamicParams` / `dynamic` exports (Cache Components rejects them). The slugs `archive` and `feed.xml` are reserved; the post list schema rejects them.
- Prose styles: `@plugin "@tailwindcss/typography"` plus a `prose-site` utility with the site colors and fonts.
- RSS: hand-written route handler at `/writing/feed.xml`; linked with `alternates.types` in the metadata.
- Biome does not lint or format `.mdx` files.

## 13. SEO

On the site:

- `metadataBase: new URL("https://max.vonstorch.com")`; title template `"%s | Max von Storch"`; the home page uses `title.absolute: "Max von Storch — Founding engineer at Dryft"`.
- Each page sets its own description and `alternates.canonical` through one helper in `lib/metadata.ts`. The root layout sets no canonical (children would inherit it).
- Metadata is static (no cookies, headers or search params), so it is in `<head>`.
- One H1 per page (the title block).
- JSON-LD on `/`: `WebSite` (name "Max von Storch", alternateName "MvS") and `ProfilePage` with a `Person` as `mainEntity` (name, jobTitle, worksFor Dryft, alumniOf, url, `sameAs`: GitHub, LinkedIn, X; `image` only with a real photo). Each post: `BlogPosting` with `author.url` = home page.
- Share images: one `next/og` template, one `opengraph-image.tsx` per page (page palette, a fixed pattern, the title).
- `sitemap.ts`: the 8 pages (no `lastModified`) and all local posts (`updated ?? date`). No `priority` / `changefreq`.
- `robots.ts`: allow all, disallow `/admin` and `/api/`, list the sitemap. Admin pages also set `robots: { index: false }`.
- Favicons: `favicon.ico` (48 px), `icon.png`, `apple-icon.png`, made once from a tile motif by `scripts/make-icons.ts` (Google does not show SVG favicons).
- Fonts through `next/font` (small woff2 subsets). The old site loads 1.15 MB of fonts.
- Host redirect: `maxvonstorchcom.vercel.app` → `https://max.vonstorch.com` (308, in `vercel.json`).

Off-site steps (owner):

1. Now: Google Search Console Domain property for `vonstorch.com`, verified with a DNS TXT record at IONOS (not on `max.`, which is a CNAME); submit the sitemap.
2. Now: add `https://max.vonstorch.com` as the website on GitHub (empty today), LinkedIn and X; same name everywhere.
3. Now: Bing Webmaster Tools — import the site from Search Console.
4. After launch: submit the new sitemap; URL Inspection → Request indexing for `/` and `/writing`.

## 14. Accessibility

- Tiles are decoration (`aria-hidden`). All content is in the title block, panel and nav: real headings, links and buttons; visible focus styles.
- Keyboard: Tab through nav and panel; arrow keys change the pattern; paint mode as in §9.
- Brush pickers are native radio groups with labels. Form fields have labels and error text.
- Reduced motion as in §7. `lang="en"`.
- Text contrast is checked by hand for every title color and panel text before launch.

## 15. Errors and fallbacks

| Case | Behavior |
|---|---|
| Spotify fails | Music panel: "Spotify is quiet right now." Cached for minutes, then retried |
| Database fails | Community: "Marks cannot load right now." Submit shows a form error |
| Rate limit / pending cap | Form error: "Too many marks right now. Try again later." |
| Bot detected | Form error without details |
| Unknown page | `not-found.tsx` in tile style ("404" in the title block) |
| Other errors | `error.tsx` / `global-error.tsx` in tile style |
| Unknown post slug | Cache Components serves the not-found UI with `noindex` (status 200); acceptable in v1 |

Monitoring: Vercel logs and Vercel Analytics only.

## 16. Data model (Drizzle, Postgres)

`marks`:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, primary key | generated in the database |
| `name` | varchar(40), null | |
| `note` | varchar(140), not null | |
| `tiles` | jsonb, not null | 16 tiles (§9) |
| `status` | enum `mark_status` (`pending`, `approved`), not null, default `pending` | |
| `created_at` | timestamptz, not null, default now() | |
| `approved_at` | timestamptz, null | |
| `ip_hash` | text, not null | daily HMAC (§9) |

Indexes: `(status, approved_at DESC NULLS FIRST)`, `(status, created_at)`, `(ip_hash, created_at)`. (Drizzle: use `.desc().nullsFirst()`, otherwise `ORDER BY … DESC` does not use the index.)

Better Auth tables (`user`, `session`, `account`, `verification`, `rateLimit`) come from `auth generate` into `db/schema/auth.ts`.

**Driver:** `pg` `Pool` + `drizzle-orm/node-postgres` + `attachDatabasePool` from `@vercel/functions`, on the pooled `DATABASE_URL` (Neon and Vercel both recommend TCP pooling on Fluid compute). Lazy init with a plain `getDb()` function, no `Proxy` wrapper. Use `sslmode=verify-full`.

**Migrations:** `drizzle-kit generate` locally → commit the SQL in `db/drizzle/` → `drizzle-kit migrate` runs in the Vercel build before `next build`. Never `push` to a shared database. `drizzle.config.ts` loads env files with `@next/env` and sets `schemaFilter: ["public"]`. Changes follow expand/contract (build-time migrations cannot roll back).

**Environments:** production uses the main Neon branch; each preview deployment gets its own Neon branch (Vercel integration "Preview branching"); local development uses the owner's own Neon `dev` branch in `.env.development.local`.

## 17. Platform, env and deploy

- **Vercel:** Hobby plan, Fluid compute, Node 24 (`"engines": { "node": "24.x" }`; Vercel runs 24, 22 and 20 only). Bun 1.4.2 is the package manager only; the app runs on Node.
- **`vercel.json`:** `buildCommand: "bun run db:migrate && bun run build"` and the host redirect (§13). Reset the dashboard install/build overrides to auto-detect.
- **Neon:** `bunx vercel@latest integration add neon --name max-vonstorch-db --plan free_v3 -m region=iad1 -m auth=false -e production -e preview --no-env-pull` (check first that `free_v3` is the Neon Free plan); in the dashboard turn on Preview branching and "Resource must be active before deployment". Free plan limits: 100 compute hours a month and 10 branches — cache all reads and delete merged preview branches.
- **BotID:** Basic mode (free on Hobby); `withBotId` in `next.config.ts`, `initBotId` in `instrumentation-client.ts` for the Community submit path.
- **Analytics:** `@vercel/analytics` 2.x `<Analytics />` in the root layout. No Speed Insights (Hobby shows only one score).

| Env var | Environments | Source |
|---|---|---|
| `DATABASE_URL` | production, preview (Neon integration); development (own `dev` branch) | Neon |
| `BETTER_AUTH_SECRET` | each environment, different values | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | production, development | fixed URLs |
| `OWNER_EMAIL` | all | owner |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | all | existing Spotify app |
| `IP_HASH_SECRET` | all | `openssl rand -base64 32` |

Remove after launch: `KV_*`, `REDIS_URL`, `BLOB_READ_WRITE_TOKEN`, `SPOTIFY_REFRESH_TOKEN`; the Upstash and Blob stores.

**Agent files:** commit `AGENTS.md` and `CLAUDE.md` (Next.js writes a managed block into them) and a `.mcp.json` with `next-devtools-mcp`.

**Launch:**

1. Tag the old site on `main` as `v1`.
2. Build on `personal-website`; check each step on its Vercel preview.
3. Check by hand: admin gate (logged out: no admin page, no admin action works), rate limit, BotID, contrast.
4. Merge to `main` → production.
5. Remove the old env vars and stores; submit the new sitemap (§13).

## 18. Stack and versions (npm, 2026-09-26)

| Area | Packages |
|---|---|
| Core | `next` 16.3.6 (→ 16.3.7, due 2026-09-30), `react` / `react-dom` 19.3.0, `babel-plugin-react-compiler` 1.0.0, `typescript` 7.0.2, `@types/node` 24, `server-only` |
| Styling | `tailwindcss` + `@tailwindcss/postcss` 4.3.3, `@tailwindcss/typography` 0.5.20, `cn` 0.4.0 |
| Content | `@next/mdx` 16.3.6, `@mdx-js/loader` 3.1.1, `remark-gfm` 4.0.1, `remark-frontmatter` 5.0.0, `remark-mdx-frontmatter` 6.0.0, `@shikijs/rehype` 4.4.3, `rehype-mdx-import-media` 1.4.0, `@types/mdx` |
| Data | `drizzle-orm` + `drizzle-kit` 1.0.0-rc.4 (exact pin; the Drizzle docs install the RC), `pg` 8.23.0, `@types/pg`, `@vercel/functions` 3.9.9, `@next/env` 16.3.6 |
| Auth | `better-auth` 1.7.6 (+ its Drizzle adapter, same version) |
| Forms | `react-hook-form` 7.89.0 (v8 is beta and breaks the resolver), `@hookform/resolvers` 5.9.1, `zod` 4.6.5 |
| Platform | `botid` 1.5.11, `@vercel/analytics` 2.0.1, Vercel CLI 60.1.3 |
| Tooling | `@biomejs/biome` 2.5.14 (exact), `lefthook` 2.1.14 |
| Remove | `@upstash/redis`, `@vercel/blob`, `radix-ui`, `lucide-react`, `dotenv`, `clsx`, `tailwind-merge` |

**Config notes:**

- `next.config.ts`: `reactCompiler: true`, `typedRoutes: true`, `cacheComponents: true`, MDX (`pageExtensions` + `withMDX`), `withBotId`.
- Scripts: `typecheck` = `next typegen && tsc --noEmit`; `db:generate`, `db:migrate`, `seed:owner`.
- Biome: `"preset": "recommended"` (not the deprecated `rules.recommended`), Tailwind directives on in the CSS parser, `useSortedClasses` (nursery, `fix: "safe"`, functions `cn`), `useReactCompiler` (nursery); ignore `.next`, `db/drizzle`, `public/**/*.svg`. The `test` domain is not needed.
- lefthook pre-commit: `biome check --write --no-errors-on-unmatched --files-ignore-unknown=true` on staged files, re-stage fixes.
- Tailwind: `@import "tailwindcss"`, `@theme inline` maps the `next/font` variables; `@plugin "@tailwindcss/typography"`. Tailwind 4.2+ uses `inset-s-*` / `inset-e-*` instead of `start-*` / `end-*`.
- TypeScript 7: `baseUrl` is removed; the Next.js editor plugin does not run with TS 7 (fallback TS 6.0.3 if this blocks work).
- Zod: `import * as z from "zod"` (smaller bundle); Zod 4 API (`z.flattenError`), not the Zod 3 code in the Next.js forms guide.

## 19. Setup sequence

1. Local tools: Node 24 LTS, `bun upgrade` (1.4.2), `vercel upgrade` (60.1.3).
2. After PR #2 (security hotfix) is merged: `git tag v1 origin/main` (old site).
3. Scaffold in a temp folder: `bunx create-next-app@latest site --ts --tailwind --biome --app --no-src-dir --react-compiler --import-alias "@/*" --use-bun --agents-md --empty --disable-git`. Move the result into the repo and remove the old app code. Then update the pinned versions (React 19.3, TS 7, `@types/node` 24, Biome 2.5.14 + `bunx biome migrate --write`).
4. Tooling: Biome config, lefthook, `.vscode` settings, `cn`.
5. Tile engine (`lib/tiles`), shell and the 8 pages with static content.
6. Writing (MDX), reading layout, RSS.
7. Neon + Drizzle + Better Auth + `/admin` (seed the owner).
8. Community (browse, paint, submit, approve).
9. Spotify.
10. SEO (metadata, JSON-LD, share images, favicons, sitemap, robots), accessibility pass, error pages.
11. Deploy checks and launch (§17).

The implementation plan breaks these steps into tasks.

## 20. Changes from the design

1. The grid scales and fills any window (the design has two fixed frames).
2. Arrow keys and clickable pattern marks change the pattern; the animation pauses in hidden tabs.
3. Community marks are 4×4 repeating motifs, and visitors can paint on mobile (the design: free canvas, browse-only on mobile).
4. An empty state replaces the sample marks; a mark needs at least one painted tile; arrow keys browse marks.
5. Music says "lately" (Spotify's shortest range is about 4 weeks), not "this week".
6. Education has no link; Contact has no email; Projects lists the side projects from the old site.
7. "All posts" opens `/writing/archive` in the reading layout.
8. The CV download is hidden until the PDF exists.
9. Fallback lines for Spotify and database errors.

## 21. Risks and follow-ups

| Risk | Plan |
|---|---|
| Vercel's build image may still use Bun 1.3, which cannot read a Bun 1.4 lockfile | Check "bun install v1.4.x" in the first build log; fallback install command `npx -y bun@1.4.2 install --frozen-lockfile` |
| Drizzle 1.0 is a release candidate | Exact pin; fallback 0.45.3 |
| `import.meta.glob` is new and had a bug in 16.3.6 | Keep the glob inside `content/`; fallback: read files with `fs` |
| Neon free plan limits | Cache all reads; delete merged preview branches |
| Spotify token expires every 6 months | "Reconnect" on `/admin` |
| No test suite | Manual checks before launch (§17) |
| React Hook Form + React Compiler edge cases | Follow the rules in §9 |
| `cn` 0.4.0 is new | Fallback: `clsx` + `tailwind-merge` |
| Next.js 16.3.7 security release on 2026-09-30 | Upgrade the new site and the live site when it is out |

## 22. Changes during implementation

These decisions were made while building. They replace the matching parts of the sections above.

| Topic | Built | Instead of | Why |
|---|---|---|---|
| Bun | 1.3.x as package manager (`bun.lock` v1) | 1.4.2 | Vercel's build image runs Bun 1.3.14 and cannot read a Bun 1.4 lockfile ("latest compatible" rule) |
| Git hooks | `lefthook.yml` committed; run `bunx lefthook install` once after the merge | automatic install | The hooks folder is shared by all worktrees and the old site on `main` |
| Owner login (§10) | GitHub OAuth only. The first sign-in creates the owner; `validateUserInfo` allows only a **verified** `OWNER_EMAIL`. Default Better Auth rate limit (database storage). OAuth errors land on `/admin/login` | email + password, seed script | Owner decision; no password to leak or guess |
| GitHub apps | Two OAuth apps (production and local), one callback URL each | — | A GitHub OAuth app allows one callback URL |
| Spotify (§11) | Linked to the owner with `authClient.linkSocial`; Spotify can never sign in or create a user (`disableImplicitLinking`, link-only exception in `validateUserInfo`); tokens encrypted; code in `lib/queries/spotify.ts`; `baseURL.fallback = BETTER_AUTH_URL` | `lib/spotify.ts` | Biome allows database access only in `lib/queries` / `lib/mutations`; Better Auth 1.7.6 needs the fallback to read a token without a request |
| Local database | PGlite (`bun run db:local`, 127.0.0.1:5433) | own Neon `dev` branch | Works without any account |
| Migrations | `DATABASE_URL_UNPOOLED` for drizzle-kit | pooled URL | Neon recommends the direct URL for DDL |
| Code layout (§6) | `lib/auth/*`, `lib/db/*`, `lib/queries/*`, `lib/mutations/*`, `lib/schemas/*`, `drizzle/`; Server Actions next to their pages (`app/(tiles)/community/actions.ts`, `app/admin/actions.ts`) | `auth/`, `db/`, `actions/` | Matches the owner's open-eu project |
| Grid (§5) | The title block and indicator round to the nearest tile boundary (+1 column/row when the cut is more than half a tile); the head script sets `--title-width`, `--title-height`, `--indicator-width` | fixed 8×3 minus the cut | Avoids a title block that loses almost a whole tile |
| Titles | H1 size = `min(design size, 100cqi / 4.7)`; mobile page titles are 61.5 design px | 68 px | "Community" must fit the mobile title block |
| Grey text | `#6B665E` | `#8A857C` | 4.5:1 contrast |
| Community (§9) | The browser keeps only the visitor's last own mark; more marks load from `/api/marks/[page]`; pages drive the grid through `useTileScene`; on a small desktop window without a free 4×4 area the title block also slides away | — | Simpler state; one small typed channel between pages and the shell |
| Unknown post slug | Reading-style "Post not found" (status 200, `noindex`) | tile-style 404 | Next renders it inside the reading layout |
| Analytics | `@vercel/analytics` 2.x, plain `<Analytics />` | — | As in §17 |
| Tests | None; checks are Biome, the type check, the build and manual browser checks | — | Owner decision |

**Still open for the owner:** X handle, Music kicker confirmation, CV PDF and month, real posts; all launch steps are in `README.md`.

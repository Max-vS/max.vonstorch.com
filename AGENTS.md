<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Comments

A comment carries what the code cannot: constraint, tradeoff, alternative rejected and why. One sentence, at the line that made the choice.

Comments should be concise, precise and simple in language unless the topic requires complexity.

When the pull is to narrate what the code does, rename the thing instead.

# Project

- Spec: `docs/superpowers/specs/2026-09-27-tile-site-design.md`. Design source of truth: `docs/design/tile-system/`.
- No test suite. Verify with `bun run lint`, `bun run build` and the browser.
- Add no code the spec does not need.

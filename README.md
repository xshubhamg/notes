# Notes sync (Obsidian → portfolio)

Copy these files into your **Obsidian notes GitHub repo** (not this portfolio repo).

## Layout in the notes repo

```txt
notes/
  publish/                 # public markdown only
    example-note.md
  notes-index.json         # generated manifest
  scripts/
    generate-index.ts      # copy from notes-sync/generate-index.ts
  .github/workflows/
    publish-notes.yml      # copy from notes-sync/.github/workflows/
```

## Note frontmatter

```yaml
---
title: Example Note
description: Short summary for the notes list.
date: 2026-05-15
tags: [nextjs, obsidian]
published: true
slug: example-note
---
```

Only files with `published: true` (and not `draft: true`) are included.

## Portfolio env

```env
NOTES_INDEX_URL=https://raw.githubusercontent.com/xshubhamg/notes/main/notes-index.json
NOTES_REVALIDATE_SECRET=your-random-secret
```

## Notes repo secrets

- `NOTES_REVALIDATE_SECRET` — same as portfolio
- `PORTFOLIO_REVALIDATE_URL` (optional) — defaults to `https://xshubhamg.site/api/revalidate-notes`

## Local test

```bash
bun run notes-sync/generate-index.ts
```

Run from the notes repo root after copying the script to `scripts/generate-index.ts`.

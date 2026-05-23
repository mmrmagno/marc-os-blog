---
title: "Hello, world — rebuilding marc-os from scratch"
description: "Why I tore the old blog down and what the new infra looks like."
pubDate: 2026-05-23
tags: ["meta", "astro", "infra"]
draft: false
---

After staring at the old marc-os stack — React SPA + Node API + MongoDB —
for one too many `docker compose pull` cycles, I decided to nuke it.

The new site is **boring on purpose**. Here's the diff:

| Before                       | After                          |
|------------------------------|--------------------------------|
| React SPA + Express + Mongo  | Astro static site              |
| 3 containers + DB volume     | 1 container behind existing NPM |
| Admin panel with JWT auth    | `git push`                     |
| ~120MB image                 | ~25MB image                    |
| Several deps with CVEs       | Zero JS deps at runtime        |

## why static?

I don't write that often. The dynamic stack was solving a problem I didn't have.
Markdown in git gives me:

- atomic, reviewable, rollback-able content changes
- no DB to back up, restore, or watch CVE feeds for
- no auth surface — the only way to write is to have commit access
- builds that finish before my coffee does

## the new infra

```
nginx proxy manager (TLS, headers) → astro static (in-container nginx) → that's it
```

One Docker container for the blog itself. It joins NPM's existing
docker network so the edge can reach it by container name — no host
ports published. Read-only root filesystem. Non-root user. All
capabilities dropped. Cert renewal handled by NPM. Done.

## what's next

- writing more, probably about k3s + grafana
- adding a `/uses` page once I figure out my actual keyboard
- maybe a guestbook, if I can do it without a database

> If you're reading this from the RSS feed: hi 👋

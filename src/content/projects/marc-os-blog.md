---
title: "marc-os-blog"
description: "This site. Astro + Docker, fronted by Nginx Proxy Manager, themed Catppuccin Mocha with a matrix rain background."
pubDate: 2026-05-23
tags: ["astro", "nginx", "docker", "self-hosted"]
repo: "https://github.com/mmrmagno/marc-os-blog"
url: "https://marc-os.com"
status: "active"
featured: true
draft: false
---

The site you're looking at, right now. The README has the architecture and stack rationale;
this page is the dev diary.

## design constraints

- **single VPS, single Docker container** — no Kubernetes, no managed services
- **content in markdown, in git** — no admin panel, no DB
- **edge proxy is the existing NPM** — one ACME client, one place to manage TLS
- **zero third-party requests at runtime** — fonts self-hosted, no analytics, no CDN scripts
- **strict CSP** — no inline scripts other than the matrix canvas bootstrap
- **<100kb per page** at the wire, before compression

## things I'd like to add

- a `/now` page
- webmentions (statically rendered from a brid.gy export)
- a search index built at compile time (pagefind — done)

---
title: "marc-os-blog"
description: "This site. Astro + Docker, themed Catppuccin Mocha."
pubDate: 2025-03-23
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

- **single VPS, single Docker container**
- **content in markdown, in git**

## things I'd like to add

- a `/now` page
- webmentions (statically rendered from a brid.gy export)
- a search index built at compile time (pagefind — done)

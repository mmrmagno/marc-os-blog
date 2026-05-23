# marc-os-blog

> Static site for [marc-os.com](https://marc-os.com). Built with Astro,
> served by nginx

```
 ┌──────────────┐    ┌────────────────────┐    ┌────────────────────┐
 │  git push    │ -> │  GitHub Actions    │ -> │  ghcr.io image     │
 │  (markdown)  │    │  build + scan      │    │  signed + SBOM     │
 └──────────────┘    └────────────────────┘    └─────────┬──────────┘
                                                         │
                                                         ▼
                                              ┌──────────────────────┐
                                              │  VPS                 │
                                              │  ┌────────────────┐  │
                                              │  │ NPM (existing) │  │
                                              │  │ :80 / :443 TLS │  │
                                              │  └────────┬───────┘  │
                                              │   docker network     │
                                              │  ┌────────▼───────┐  │
                                              │  │ marc-os-app    │  │
                                              │  │ nginx :8080    │  │
                                              │  │ read-only,     │  │
                                              │  │ non-root, RO   │  │
                                              │  └────────────────┘  │
                                              └──────────────────────┘
```

## Local development

```bash
pnpm install
./scripts/fetch-fonts.sh    # one-time: download JetBrains Mono
pnpm dev                    # http://localhost:4321
pnpm build                  # static output in ./dist
pnpm preview                # serve the built site locally
```

## Writing content

Drop a markdown file into `src/content/blog/` or `src/content/projects/`.
Frontmatter is type-checked at build time (see `src/content/config.ts`).

```markdown
---
title: "Hardening Nginx Proxy Manager"
description: "Locking down the admin port and rotating creds"
pubDate: 2026-05-23
tags: ["npm", "security", "homelab"]
draft: false
---

Your content here.
```

## Production deploy

```bash
# on the VPS, once
git clone https://github.com/mmrmagno/marc-os-blog.git /opt/marc-os-blog
cd /opt/marc-os-blog
cp .env.example .env
$EDITOR .env                # set PROXY_NETWORK
docker compose up -d
```

CI builds and pushes `ghcr.io/mmrmagno/marc-os-blog:latest` on every push
to `main`. To redeploy after a CI build:

```bash
docker compose pull && docker compose up -d
```

The included `.github/workflows/deploy.yml` does this over SSH on each
green build.

## Repository layout

```
src/
├── components/
├── content/
│   ├── blog/
│   ├── projects/
│   └── config.ts
├── layouts/
├── pages/
├── styles/
└── lib/

infra/
docs/NPM-SETUP.md
.github/workflows/
```

## License

[MIT](LICENSE) 

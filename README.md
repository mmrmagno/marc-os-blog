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

The site runs on [Spire](https://github.com/mmrmagno/spire), my homelab Kubernetes cluster,
behind a Cloudflare Tunnel.

CI builds `ghcr.io/mmrmagno/marc-os-blog:latest` on every push to `main`, for amd64 and arm64.
Renovate in the spire repo notices the new digest, opens a PR and merges it, and Flux rolls it
out. Nothing in CI can reach the cluster, and nothing has to.

To roll back, revert the digest bump in the spire repo.

`docker-compose.yml` is still here for running the production image locally with the same
hardening flags as the cluster: read-only root, no capabilities, tmpfs for nginx.

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
.github/workflows/
```

## License

[MIT](LICENSE) 

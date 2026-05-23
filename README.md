# marc-os-blog

> Static site for [marc-os.com](https://marc-os.com). Built with Astro,
> served by a hardened nginx container, fronted by an existing
> Nginx Proxy Manager instance.

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

## Stack

| Layer       | Choice                                        | Why                                                    |
|-------------|-----------------------------------------------|--------------------------------------------------------|
| SSG         | Astro                                         | Zero JS by default, content collections, fast builds   |
| Content     | Markdown + frontmatter in `src/content/`      | Git is the database — no DB, no admin, no CVEs         |
| Theme       | Catppuccin Mocha + Matrix rain                | Pretty + on-brand                                      |
| App server  | nginx 1.27 alpine (in-container)              | Tiny, well-understood, sane defaults                   |
| Edge proxy  | Nginx Proxy Manager (already on the VPS)      | One ACME client, one place to manage TLS               |
| Container   | Multi-stage Docker build                      | ~25MB final image                                      |
| Orchestration | Docker Compose                              | One VPS, no need for k8s                               |
| CI/CD       | GitHub Actions → GHCR → SSH deploy            | Reproducible, cosign-signed images, SLSA provenance    |
| Hardening   | read-only FS, no-new-privileges, cap_drop ALL, non-root, CSP, HSTS | Defense in depth          |

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

Then add the proxy host in NPM — see **[docs/NPM-SETUP.md](docs/NPM-SETUP.md)**.

CI builds and pushes `ghcr.io/mmrmagno/marc-os-blog:latest` on every push
to `main`. To redeploy after a CI build:

```bash
docker compose pull && docker compose up -d
```

The included `.github/workflows/deploy.yml` does this over SSH on each
green build.

## Security posture

- HTTPS-only via NPM, HSTS preload-ready, TLS 1.2+
- Strict CSP, full security-headers set (see `docs/NPM-SETUP.md`)
- App container runs as non-root with read-only root filesystem
- All Linux capabilities dropped, `no-new-privileges` enforced
- No host ports — only NPM can reach the app, over its internal network
- Images pinned by digest in production
- Trivy scans on every CI run, blocks on HIGH/CRITICAL
- No databases, no user input, no auth surface
- Cosign keyless signing + SLSA provenance on every image

## Repository layout

```
src/
├── components/         # Astro components (Header, Footer, MatrixBackground, ...)
├── content/
│   ├── blog/           # ← write posts here
│   ├── projects/       # ← write projects here
│   └── config.ts       # frontmatter schema
├── layouts/
├── pages/              # routes, including /blog, /projects, /rss.xml
├── styles/             # Catppuccin Mocha tokens + global CSS
└── lib/                # site-wide config

infra/                  # in-container nginx config (served on :8080)
docs/NPM-SETUP.md       # how to wire this up to Nginx Proxy Manager
.github/workflows/      # CI: build, scan, sign; deploy on green
MIGRATION.md            # Claude Code playbook for the v1 → v2 migration
```

## License

MIT

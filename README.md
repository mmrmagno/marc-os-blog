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
to `main`, then sends an HMAC-signed POST to a
[webhook](https://github.com/adnanh/webhook) listener on the server. The
listener checks the `X-Hub-Signature-256` header and runs
`scripts/deploy.sh`, which pulls the new image, restarts the container and
waits for `/healthz`. No SSH access from CI is needed.

To enable it:

1. Add the entry from `infra/webhook-hook.json.example` to the listener's
   `hooks.json`, with a random secret.
2. Set the repository secrets `DEPLOY_WEBHOOK_URL` and
   `DEPLOY_WEBHOOK_SECRET` (same value as in `hooks.json`).

The deploy script only pulls images. Changes to `docker-compose.yml` or
`scripts/` need a manual `git pull` on the server. To redeploy by hand:

```bash
./scripts/deploy.sh
```

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

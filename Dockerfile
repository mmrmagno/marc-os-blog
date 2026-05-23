# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────
# Stage 1: build the Astro static site
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install pnpm via corepack (pinned to a known version).
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Install deps with a clean cache mount. Lockfile is required.
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install --no-frozen-lockfile; \
    fi

# Copy source and build.
COPY . .
RUN pnpm build

# ─────────────────────────────────────────────────────────────
# Stage 2: minimal nginx image to serve the static output
#
# An edge proxy (Nginx Proxy Manager) terminates TLS and reverse-proxies
# to this internal nginx — keeping the in-container app server lets the
# edge stay generic (you can swap NPM for Traefik or Cloudflared without
# touching this image).
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Drop the default nginx config and html.
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Our own nginx config (no server tokens, gzip, immutable assets).
COPY infra/nginx.conf /etc/nginx/nginx.conf
COPY infra/default.conf /etc/nginx/conf.d/default.conf

# Static site output.
COPY --from=build /app/dist /usr/share/nginx/html

# Tighten file perms — nginx worker just needs read.
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R a-w /usr/share/nginx/html && \
    # nginx needs to write its pid + cache somewhere when root FS is read-only;
    # we mount tmpfs for /var/cache/nginx and /var/run in compose.
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

# Healthcheck — hits the static index over the loopback.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

EXPOSE 8080

USER nginx
CMD ["nginx", "-g", "daemon off;"]

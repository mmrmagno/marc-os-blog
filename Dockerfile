FROM node:26-alpine AS build

WORKDIR /app

# Node 25+ no longer bundles corepack; install pnpm directly.
# Keep in sync with "packageManager" in package.json.
RUN npm install -g pnpm@11.3.0

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile --ignore-scripts; \
    else \
      pnpm install --no-frozen-lockfile --ignore-scripts; \
    fi

COPY . .
RUN pnpm build

FROM nginx:1.31-alpine AS runtime

RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

COPY infra/nginx.conf /etc/nginx/nginx.conf
COPY infra/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R a-w /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1

EXPOSE 8080

USER nginx
CMD ["nginx", "-g", "daemon off;"]

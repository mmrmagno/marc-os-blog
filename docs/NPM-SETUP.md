# Nginx Proxy Manager — setup for marc-os.com

The blog container exposes nginx on `:8080` and joins NPM's docker
network. NPM handles TLS, redirects, and security headers at the edge.
None of this needs to live in the blog repo, but documenting it here
keeps the next-you (or next-me) from re-discovering it.

## One-time NPM setup

### 1. Find the NPM network name

On the VPS:

```bash
docker network ls | grep -i npm
# typical names: npm_default, proxy, nginxproxymanager_default
```

Set it in this repo's `.env`:

```env
PROXY_NETWORK=npm_default     # whatever you found above
```

### 2. Bring up the blog container

```bash
cd /opt/marc-os-blog
docker compose pull
docker compose up -d
docker compose ps    # should show marc-os-app, healthy
```

The container is now reachable from NPM as `marc-os-app:8080`.
Nothing is exposed to the host or the internet.

### 3. Add the proxy host in NPM

NPM UI → **Hosts → Proxy Hosts → Add Proxy Host**

**Details tab:**
- Domain Names: `marc-os.com`, `www.marc-os.com`
- Scheme: `http`
- Forward Hostname / IP: `marc-os-app`
- Forward Port: `8080`
- Cache Assets: **off** (the app already sets cache headers)
- Block Common Exploits: **on**
- Websockets Support: **off** (static site)

**Custom locations tab:**
*(skip — handled via Advanced)*

**SSL tab:**
- SSL Certificate: **Request a new SSL Certificate**
- Force SSL: **on**
- HTTP/2 Support: **on**
- HSTS Enabled: **on**
- HSTS Subdomains: **on**
- Use a DNS Challenge: only if NPM can't reach the box on port 80
- Email: your address
- Accept LetsEncrypt TOS

**Advanced tab:** paste the block from the next section.

### 4. The Advanced-tab nginx config

This is what gives the site its security-headers grade and old-URL
redirects. Paste verbatim, then **Save**.

```nginx
# ── Security headers (matches what Caddy would have set) ─────
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" always;

# Don't advertise the stack
proxy_hide_header X-Powered-By;
server_tokens off;

# ── Compression ──────────────────────────────────────────────
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml application/javascript application/json application/xml+rss image/svg+xml application/wasm;

# ── Long-cache hashed asset paths ────────────────────────────
location ~ ^/(_assets|_pagefind|fonts)/ {
    proxy_pass http://marc-os-app:8080;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
}

# ── Old-URL redirects (v1 → v2) ──────────────────────────────
# Adapt these once you know the exact old shapes from MIGRATION.md
# Phase 6. Common patterns:
location ~ ^/post/(.+)$ {
    return 301 /blog/$1;
}
location ~ ^/posts/(.+)$ {
    return 301 /blog/$1;
}
```

### 5. www → apex canonicalisation

In NPM, either:

- Add `www.marc-os.com` to the same proxy host's domain list (both
  resolve to the same content — fine but two canonical URLs), **or**
- Create a separate **Redirection Host** for `www.marc-os.com` →
  `https://marc-os.com$request_uri` (cleaner, single canonical).

I'd pick the redirection host. Search engines and OG previews behave
better with one canonical hostname.

### 6. Verify

From anywhere:

```bash
curl -sI https://marc-os.com/ | head
curl -s  https://marc-os.com/healthz       # → "ok"
curl -sI https://marc-os.com/post/anything # → 301
```

Run through:
- <https://securityheaders.com/?q=marc-os.com> — aim for A+
- <https://www.ssllabs.com/ssltest/analyze.html?d=marc-os.com> — aim for A+

## Day-to-day ops

**Update the blog after a CI build:**
```bash
cd /opt/marc-os-blog
docker compose pull && docker compose up -d
```
NPM is untouched.

**NPM admin port:** lock it down. The admin UI defaults to `:81`.
If it's exposed publicly, firewall it to your IP or behind a VPN:
```bash
sudo ufw deny 81/tcp
sudo ufw allow from <your-ip> to any port 81 proto tcp
```

**NPM updates:** keep its image on a recent tag. There have been
auth-related CVEs in older versions; staying current matters.

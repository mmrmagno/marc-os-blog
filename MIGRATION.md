# MIGRATION.md — Claude Code Playbook

> **Audience:** Claude Code, running locally in the existing
> `marc-os-blog` repo. This file is a sequenced, verifiable playbook.
> Treat each phase as a self-contained task. **Stop and ask the human
> before** any step marked 🛑. **Do not skip verification steps.**

---

## Context for Claude Code

You're migrating an existing blog from:

- **Old stack:** React SPA + Node/Express API + MongoDB, served via
  Docker Compose. Content lives in a MongoDB `posts` collection.
- **New stack:** Astro static site, content as markdown in
  `src/content/`, served by nginx in a hardened container fronted by
  the existing Nginx Proxy Manager on the VPS, CI/CD via GitHub
  Actions + GHCR.

The new stack scaffold has been generated and is provided as a tarball
named `marc-os-blog.tar.gz` (and `.zip`). The human has it locally.

The migration is **destructive on the `main` branch** — we are
force-pushing a complete rewrite. The old code will be preserved on a
`v1-archive` tag, not deleted from history.

---

## Operating principles for this migration

1. **Branch before everything.** All work happens on
   `migration/v2-rewrite`. Main is only updated at the very end.
2. **One commit per phase.** Each phase below corresponds to one
   logical commit with a conventional-commit message. Don't squash
   them until phase 9.
3. **Verify before proceeding.** Each phase has an "Acceptance" block
   listing concrete commands that must succeed. If any check fails,
   stop and report — don't paper over it.
4. **No silent edits to the scaffold.** The scaffold is opinionated;
   if you need to deviate from it, ask. Don't refactor "for clarity"
   while migrating.
5. **Ask before destructive ops.** Anything marked 🛑 requires
   explicit human confirmation in chat before running.
6. **Content fidelity over format polish.** Don't rewrite the human's
   posts. Translate, don't editorialize.

---

## Phase 0 — Pre-flight inventory

**Goal:** Understand what we're migrating from before touching anything.

### Tasks

1. From the repo root, produce an inventory:
   ```bash
   git log --oneline | head -20
   git status
   find . -maxdepth 3 -type d -not -path '*/node_modules*' -not -path '*/.git*'
   cat docker-compose.yml 2>/dev/null
   cat backend/package.json 2>/dev/null
   cat frontend/package.json 2>/dev/null
   ```
2. Identify:
   - The MongoDB connection string env var name (likely `MONGODB_URI`
     or `MONGO_URL` in `backend/.env` or `.env.example`).
   - The post schema — read `backend/models/Post.js` (or similar) and
     note all fields: `title`, `slug`, `content`, `tags`,
     `createdAt`, `updatedAt`, `draft`/`published`, `excerpt`,
     `coverImage`, `author`, etc.
   - Whether content is stored as markdown or HTML — open one post in
     the DB or the editor source. (Old blogs often store TinyMCE/Quill
     HTML; the new stack expects markdown.)
   - Whether there's a `projects` collection or if those are
     hardcoded in the frontend.
3. Write findings to `MIGRATION_NOTES.md` at the repo root. **Do not
   commit this file** — it's a scratchpad. Add it to `.gitignore` for
   the duration of the migration.

### Acceptance

- `MIGRATION_NOTES.md` exists with: post schema fields, content
  format (md vs html), MongoDB connection info, project listing
  source, and any uploaded image paths.
- Report back to the human with these findings before starting Phase 1.

🛑 **STOP — wait for human confirmation that the inventory looks right.**

---

## Phase 1 — Back up everything that matters

**Goal:** Have a restore path if something goes sideways.

### Tasks

1. Tag and push the current state of `main`:
   ```bash
   git tag -a v1-archive -m "Archive of v1 (React+Mongo) before v2 rewrite"
   git push origin v1-archive
   ```
2. Export the MongoDB posts collection to local JSON. The old compose
   stack must be running for this. If it isn't, start only the
   `mongo` service:
   ```bash
   docker compose up -d mongo
   ```
   Then export — the container and DB names came from Phase 0:
   ```bash
   mkdir -p ./migration-backup
   docker compose exec -T mongo mongoexport \
     --db=<DB_NAME_FROM_PHASE_0> \
     --collection=posts \
     --jsonArray --pretty \
     > ./migration-backup/posts.json
   ```
   If there's a `projects` collection, export it too as
   `projects.json`.
3. If posts reference uploaded images stored on disk (e.g.
   `backend/uploads/`), copy that directory:
   ```bash
   cp -r backend/uploads ./migration-backup/uploads 2>/dev/null || true
   ```
4. Verify the backup:
   ```bash
   jq 'length' ./migration-backup/posts.json
   ls -la ./migration-backup/uploads 2>/dev/null | head
   ```
5. Add `./migration-backup/` to `.gitignore` and **do not commit it**.
   This is the human's local-only safety net.

### Acceptance

- `v1-archive` tag exists on origin (`git ls-remote --tags origin |
  grep v1-archive`).
- `./migration-backup/posts.json` exists and `jq 'length'` returns
  a non-zero integer matching the human's expectation of post count.
- Uploads directory copied if it existed.

🛑 **STOP — confirm with the human that post count is correct before
proceeding. Mismatched counts mean the export didn't capture everything.**

---

## Phase 2 — Branch and unpack the new scaffold

**Goal:** Get the v2 scaffold into the repo on a clean branch without
touching `main`.

### Tasks

1. Create the migration branch from `main`:
   ```bash
   git checkout -b migration/v2-rewrite
   ```
2. **Critical:** the scaffold tarball is `marc-os-blog.tar.gz`. It
   contains a top-level `marc-os-blog/` directory whose contents need
   to become the repo root. Extract to a sibling directory first:
   ```bash
   mkdir -p /tmp/v2-scaffold
   tar -xzf <path-to>/marc-os-blog.tar.gz -C /tmp/v2-scaffold
   ls /tmp/v2-scaffold/marc-os-blog
   ```
3. Move old code into `legacy/` (keeping it temporarily for content
   migration in Phase 3):
   ```bash
   mkdir -p legacy
   # Move every top-level entry except .git, migration scratchpads,
   # and the backup into legacy/
   for entry in *; do
     case "$entry" in
       legacy|migration-backup|MIGRATION_NOTES.md) continue ;;
       *) git mv "$entry" "legacy/$entry" ;;
     esac
   done
   # Also catch dotfiles we want to preserve in legacy
   for entry in .env.example .dockerignore; do
     [ -e "$entry" ] && git mv "$entry" "legacy/$entry"
   done
   ```
4. Copy the v2 scaffold into the now-empty repo root:
   ```bash
   cp -r /tmp/v2-scaffold/marc-os-blog/. .
   ```
   (Note the trailing `/.` — that copies contents including dotfiles.)
5. Stage and inspect:
   ```bash
   git add -A
   git status
   ```
6. Sanity-check the structure matches the scaffold's README:
   ```bash
   test -f Dockerfile && test -f docker-compose.yml && \
     test -f astro.config.mjs && test -d src/content && \
     echo "scaffold layout OK"
   ```
7. Commit:
   ```bash
   git commit -m "chore(migration): scaffold v2 stack, move v1 to legacy/"
   ```

### Acceptance

- Branch `migration/v2-rewrite` exists and is checked out.
- `legacy/` contains the old `backend/`, `frontend/`,
  `Dockerfile`, `docker-compose.yml`, etc.
- Repo root contains the new scaffold (`Dockerfile`,
  `astro.config.mjs`, `src/`, `infra/`, `docs/`, `.github/`).
- `git log --oneline -3` shows the new commit on top.

---

## Phase 3 — Migrate content (posts → markdown)

**Goal:** Convert `migration-backup/posts.json` into individual
markdown files under `src/content/blog/`.

This is the highest-risk phase because content format varies.

### Tasks

1. Open `./migration-backup/posts.json` and inspect **one post** in
   detail. Determine:
   - Is `content` markdown or HTML?
   - What's the date field? (`createdAt`, `date`, `publishedAt`?)
   - How are tags stored? (`tags: ["x"]` array, or
     `tags: "x,y,z"` CSV string, or comma-split needed?)
   - Is there a `slug` field, or do we need to derive it from `title`?
   - What's the published/draft flag? (`draft`, `published`, `status`?)
2. Create a migration script at `scripts/migrate-posts.mjs`. Use this
   skeleton — **adapt the field names** to what you found:
   ```js
   #!/usr/bin/env node
   import fs from 'node:fs';
   import path from 'node:path';

   const SRC = './migration-backup/posts.json';
   const DEST = './src/content/blog';

   const posts = JSON.parse(fs.readFileSync(SRC, 'utf8'));
   fs.mkdirSync(DEST, { recursive: true });

   const slugify = (s) =>
     String(s)
       .toLowerCase()
       .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
       .replace(/^-+|-+$/g, '')
       .slice(0, 80);

   const yamlString = (s) =>
     JSON.stringify(String(s ?? '').replace(/\r/g, ''));

   let written = 0, skipped = 0;
   for (const p of posts) {
     // ── Adapt these field names ─────────────────────────────
     const title = p.title ?? '(untitled)';
     const slug = p.slug ?? slugify(title);
     const description = p.description ?? p.excerpt ?? '';
     const pubDate = new Date(p.createdAt ?? p.date ?? Date.now())
       .toISOString()
       .slice(0, 10);
     const tags = Array.isArray(p.tags)
       ? p.tags
       : String(p.tags ?? '')
           .split(',')
           .map((t) => t.trim())
           .filter(Boolean);
     const draft = Boolean(p.draft) || p.published === false;
     const body = p.content ?? p.body ?? '';
     // ────────────────────────────────────────────────────────

     if (!title || !body) {
       console.warn(`skip: missing title or body for slug=${slug}`);
       skipped++;
       continue;
     }

     const frontmatter = [
       '---',
       `title: ${yamlString(title)}`,
       `description: ${yamlString(description.slice(0, 280))}`,
       `pubDate: ${pubDate}`,
       `tags: ${JSON.stringify(tags)}`,
       `draft: ${draft}`,
       '---',
       '',
       body,
       '',
     ].join('\n');

     const file = path.join(DEST, `${slug}.md`);
     if (fs.existsSync(file)) {
       console.warn(`skip: collision on ${file}`);
       skipped++;
       continue;
     }
     fs.writeFileSync(file, frontmatter);
     written++;
   }

   console.log(`✓ wrote ${written} posts, skipped ${skipped}`);
   ```
3. Delete the two sample posts that came with the scaffold so they
   don't pollute the import:
   ```bash
   rm -f src/content/blog/hello-world.md
   rm -f src/content/blog/hardening-vps.md
   ```
4. Run the script:
   ```bash
   node scripts/migrate-posts.mjs
   ```
5. **If the old content was HTML** (not markdown), convert it now.
   Install `turndown` as a one-shot dependency and re-run the script
   with a conversion step:
   ```bash
   pnpm add -D turndown
   ```
   In the script, before writing `body`, pass it through:
   ```js
   import TurndownService from 'turndown';
   const td = new TurndownService({
     headingStyle: 'atx',
     codeBlockStyle: 'fenced',
     bulletListMarker: '-',
   });
   // ...
   const body = td.turndown(p.content ?? '');
   ```
   Re-run, then remove the dev dep:
   ```bash
   pnpm remove turndown
   ```
6. Spot-check **3 random posts** by opening them. Look for:
   - Frontmatter that parses (no unescaped quotes in title/desc)
   - Code blocks intact (` ``` ` not `<pre><code>`)
   - Internal links not pointing to old URLs (`/post/abc123` →
     `/blog/some-slug` — see Phase 6 for redirects)
   - No raw HTML soup
7. Run the type-checker:
   ```bash
   pnpm install
   pnpm check
   ```
   Astro will fail loudly on any frontmatter that violates the schema
   in `src/content/config.ts`. Fix what it reports.
8. Commit:
   ```bash
   git add src/content scripts/migrate-posts.mjs
   git commit -m "feat(content): import v1 posts to markdown"
   ```

### Acceptance

- `ls src/content/blog/*.md | wc -l` matches the expected post count
  from Phase 1.
- `pnpm check` passes with 0 errors.
- 3 spot-checked posts read sensibly (no HTML noise, working code
  fences, sensible frontmatter).

🛑 **STOP — show the human one rendered post (via `pnpm dev`) before
continuing. Content problems are easier to fix here than after the build.**

---

## Phase 4 — Migrate uploaded images (if any)

**Goal:** Get post images into the new static pipeline.

Skip this phase if Phase 0 found no uploads directory.

### Tasks

1. Move uploads into the public tree:
   ```bash
   mkdir -p public/uploads
   cp -r migration-backup/uploads/* public/uploads/ 2>/dev/null || true
   ```
2. Update image references in posts. Old paths likely look like
   `/api/uploads/foo.jpg` or `http://localhost:3000/uploads/foo.jpg`.
   New paths should be `/uploads/foo.jpg`.
   ```bash
   # Dry run — count what would change
   grep -rE '(localhost:[0-9]+/uploads|/api/uploads/)' src/content/ | wc -l

   # Apply (BSD/macOS sed needs -i ''; GNU sed needs -i)
   if sed --version >/dev/null 2>&1; then SEDI="sed -i"; else SEDI="sed -i ''"; fi
   find src/content -name '*.md' -exec $SEDI -E \
     -e 's#https?://[^/]+/uploads/#/uploads/#g' \
     -e 's#/api/uploads/#/uploads/#g' {} +
   ```
3. Spot-check that images resolve in `pnpm dev`. Look at one post
   that you know has an image.
4. Commit:
   ```bash
   git add public/uploads src/content
   git commit -m "feat(content): bring uploaded images into public/uploads"
   ```

### Acceptance

- Images load locally without 404s in the network panel.

---

## Phase 5 — Migrate projects (if a collection existed)

**Goal:** Move the old projects list into `src/content/projects/`.

### Tasks

1. If projects were in MongoDB, repeat the Phase 3 pattern with a
   `scripts/migrate-projects.mjs` that writes into
   `src/content/projects/` and matches the schema in
   `src/content/config.ts` (look at it — fields are `title`,
   `description`, `pubDate`, `tags`, `repo?`, `url?`, `status`,
   `featured`, `draft`).
2. If projects were hardcoded in the old React frontend, copy each
   project's data over by hand into individual markdown files. Don't
   automate — there are too few to be worth it and the source
   structure is freeform.
3. Delete the placeholder `src/content/projects/marc-os-blog.md` if
   it duplicates a real project (or keep it — it's accurate for this
   site itself).
4. Commit:
   ```bash
   git add src/content/projects scripts/migrate-projects.mjs 2>/dev/null
   git commit -m "feat(content): import projects"
   ```

### Acceptance

- `pnpm check` still passes.
- Projects page renders all expected entries in `pnpm dev`.

---

## Phase 6 — URL redirects for old links

**Goal:** Avoid breaking inbound links to the old URLs.

The old SPA likely used paths like `/post/<mongo_id>` or `/posts/<slug>`.
The new site uses `/blog/<slug>`. **The redirects live in NPM, not in
this repo** — but generate the snippet here so the human can paste it.

### Tasks

1. Determine the old URL shape from the legacy React router. Look at
   `legacy/frontend/src/App.jsx` (or `Routes.jsx`) for `<Route>`
   declarations.
2. Generate the nginx-format redirect block. For shape-based redirects
   (`/post/:slug` → `/blog/:slug`), this is the snippet to paste into
   NPM's proxy-host **Advanced** tab:
   ```nginx
   location ~ ^/post/(.+)$ {
       return 301 /blog/$1;
   }
   location ~ ^/posts/(.+)$ {
       return 301 /blog/$1;
   }
   ```
3. If the old URLs used MongoDB ObjectIds (`/post/65f1a...`), generate
   per-post lines from the export:
   ```bash
   jq -r '.[] | "location = /post/\(._id) { return 301 /blog/\(.slug // (.title | ascii_downcase | gsub("[^a-z0-9]+"; "-"))); }"' \
     migration-backup/posts.json \
     > migration-backup/npm-redirects.conf
   wc -l migration-backup/npm-redirects.conf
   ```
   The human will paste `migration-backup/npm-redirects.conf` into the
   NPM Advanced tab.
4. Write the final snippet (shape-based + per-id if applicable) to
   `docs/npm-redirects-generated.conf` in the repo so it's tracked:
   ```bash
   mkdir -p docs
   {
     echo "# Generated redirects — paste into NPM proxy host Advanced tab"
     echo ""
     echo "location ~ ^/post/(.+)\$ { return 301 /blog/\$1; }"
     echo "location ~ ^/posts/(.+)\$ { return 301 /blog/\$1; }"
     [ -f migration-backup/npm-redirects.conf ] && cat migration-backup/npm-redirects.conf
   } > docs/npm-redirects-generated.conf
   ```
5. Commit:
   ```bash
   git add docs/npm-redirects-generated.conf
   git commit -m "feat(infra): generate v1 → v2 redirects for NPM"
   ```

### Acceptance

- `docs/npm-redirects-generated.conf` exists and contains both the
  shape-based locations and (if applicable) per-id rules.
- A spot-check of one known old URL traces through the rules to the
  correct new path.

---

## Phase 7 — Local end-to-end verification

**Goal:** Prove the new stack builds and serves the migrated content
locally before touching prod.

Locally we don't have NPM in the path — that's fine. We're testing
the **app container** (the internal nginx on `:8080`). NPM gets
verified for real in Phase 11.

### Tasks

1. Fetch fonts (one-time setup needed by the scaffold):
   ```bash
   chmod +x scripts/*.sh
   ./scripts/fetch-fonts.sh
   ```
2. Astro build:
   ```bash
   pnpm install
   pnpm check
   pnpm build
   ```
   The build emits `dist/`. Expect at minimum: `index.html`, `blog/`
   (with one dir per post), `projects/`, `rss.xml`,
   `sitemap-index.xml`, `_pagefind/`.
3. Verify build output stats:
   ```bash
   du -sh dist
   find dist -name '*.html' | wc -l
   ```
4. Build the Docker image locally:
   ```bash
   docker build -t marc-os-blog:local .
   ```
5. Run **just the app** (no NPM locally — we expose 8080 directly for
   the smoke test):
   ```bash
   docker run --rm -d --name blog-test \
     -p 8080:8080 \
     --read-only \
     --tmpfs /var/cache/nginx:size=20m,mode=0770,uid=101,gid=101 \
     --tmpfs /var/run:size=2m,mode=0770,uid=101,gid=101 \
     --tmpfs /tmp:size=10m,mode=1777 \
     --cap-drop ALL \
     --security-opt no-new-privileges \
     marc-os-blog:local

   sleep 2
   curl -s http://localhost:8080/healthz
   curl -s http://localhost:8080/ | head -20
   docker stop blog-test
   ```
6. Commit any tweaks needed to make this pass:
   ```bash
   git add -A
   git commit -m "fix(infra): local e2e tweaks" --allow-empty
   ```

### Acceptance

- `pnpm build` exits 0 with no errors.
- `dist/` contains the expected number of post pages.
- `docker run` brings the app container up healthy.
- `curl http://localhost:8080/healthz` returns `ok`.
- `curl http://localhost:8080/` returns the rendered home page.

---

## Phase 8 — Drop the legacy directory and clean up

**Goal:** Remove `legacy/` and migration scratchpads. The git history
on `v1-archive` is the source of truth for old code now.

### Tasks

1. Confirm one more time that everything migrated. List old posts
   the human remembers and grep for them in `src/content/blog/`.
2. Remove legacy:
   ```bash
   git rm -rf legacy
   rm -rf migration-backup
   rm -f MIGRATION_NOTES.md
   ```
3. Make sure `.gitignore` no longer references `migration-backup/`
   or `MIGRATION_NOTES.md` (they were transient).
4. Commit:
   ```bash
   git add -A
   git commit -m "chore(migration): remove legacy/, scratchpads"
   ```

### Acceptance

- `ls` from repo root shows only the new-stack layout.
- `git status` is clean.

🛑 **STOP — confirm with the human one final time that they have the
`v1-archive` tag pushed to origin and `migration-backup/` saved
somewhere outside the repo if they want it. After the next phase,
recovering the old code requires that tag.**

---

## Phase 9 — Land on main

**Goal:** Make v2 the new `main`. This is the destructive step.

### Tasks

1. Optionally squash the migration commits into a smaller, cleaner
   set. The human may prefer to keep the phase-per-commit history —
   ask them. If squashing:
   ```bash
   git rebase -i $(git merge-base HEAD main)
   ```
2. Push the branch first (NOT to main yet) so the human can review on
   GitHub:
   ```bash
   git push -u origin migration/v2-rewrite
   ```
3. Open a PR from `migration/v2-rewrite` → `main` so the diff is
   visible. **Do not auto-merge.**
4. After the human approves and merges (or, if they prefer
   force-push, on their explicit instruction):
   ```bash
   # Only run this if the human says "force-push to main":
   git checkout main
   git reset --hard migration/v2-rewrite
   git push --force-with-lease origin main
   ```
   `--force-with-lease` (not plain `--force`) ensures we don't
   clobber any commits the human might have pushed to main from
   another machine.

### Acceptance

- `origin/main` shows the v2 codebase.
- `git ls-remote --tags origin | grep v1-archive` still resolves.
- Repo's main branch on GitHub renders the new README.

---

## Phase 10 — CI/CD bootstrap

**Goal:** Wire up GitHub Actions secrets and confirm the pipeline
publishes an image.

### Tasks

1. Watch the first CI run trigger on the main push:
   ```bash
   gh run watch
   ```
2. If `gh` isn't available, point the human at
   `https://github.com/<owner>/marc-os-blog/actions`.
3. The first run will produce:
   - A build artifact (`dist`)
   - A pushed image at
     `ghcr.io/<owner>/marc-os-blog:latest` and `:sha-<sha>`
   - A cosign signature
   - A Trivy SARIF in the Security tab
4. **If CI fails on the cosign sign step**: the repo needs OIDC
   permissions for keyless signing. The workflow already sets
   `id-token: write`, but the repo must also have **Settings →
   Actions → General → Workflow permissions → Read and write
   permissions** enabled. Tell the human to flip it.
5. **If CI fails on Trivy with HIGH/CRITICAL findings**: do **not**
   bypass the gate. Report the findings to the human; they likely
   need an npm/pnpm update or a base-image bump.
6. **Deploy workflow secrets** — tell the human to add these in
   **Settings → Secrets and variables → Actions**:
   - `DEPLOY_HOST` — VPS IP or hostname
   - `DEPLOY_USER` — non-root deploy user
   - `DEPLOY_SSH_KEY` — private key, ed25519, no passphrase,
     dedicated to this repo
   - `DEPLOY_PORT` — optional, defaults to 22
   - `DEPLOY_PATH` — optional, defaults to `/opt/marc-os-blog`

### Acceptance

- One green run on `origin/main`.
- The image is visible at the repo's Packages tab.

---

## Phase 11 — Deploy to VPS

**Goal:** Replace the old running stack with v2, fronted by the
existing Nginx Proxy Manager.

This phase is mostly on the VPS, not in the repo. Claude Code helps
prep the commands; the human runs them.

### Tasks

1. **Tear down the old stack.** It owns ports `80` and `443` and
   marc-os.com's DNS — NPM and the old stack would fight for the
   ports otherwise. If the old stack is also behind NPM already,
   skip the port consideration and just stop its containers.
   ```bash
   cd /path/to/old-marc-os-blog
   docker compose down
   ```
2. **Identify NPM's docker network.**
   ```bash
   docker network ls
   # look for something like npm_default, proxy, nginxproxymanager_default
   ```
3. **Set up the new deployment directory.**
   ```bash
   sudo mkdir -p /opt/marc-os-blog
   sudo chown $USER:$USER /opt/marc-os-blog
   git clone https://github.com/mmrmagno/marc-os-blog.git /opt/marc-os-blog
   cd /opt/marc-os-blog
   cp .env.example .env
   # Edit .env: set PROXY_NETWORK to the name from step 2
   $EDITOR .env
   ```
4. **Bring up the blog container.**
   ```bash
   docker compose pull
   docker compose up -d
   docker compose ps    # marc-os-app should be healthy
   ```
   The container is now reachable from NPM as `marc-os-app:8080`.
   Nothing is exposed on the host network.
5. **Configure the NPM proxy host.** Follow the full procedure in
   [docs/NPM-SETUP.md](docs/NPM-SETUP.md). Summary:
   - Domain Names: `marc-os.com`, `www.marc-os.com`
     (or set up a separate Redirection Host for `www` → apex)
   - Forward to: `marc-os-app:8080`
   - Force SSL + HSTS + HTTP/2 on
   - Paste the **Advanced tab** snippet from `docs/NPM-SETUP.md`
     (security headers + cache headers + redirect rules from
     `docs/npm-redirects-generated.conf`)
6. **External smoke tests.**
   ```bash
   curl -sI https://marc-os.com/ | head
   curl -s  https://marc-os.com/healthz                # → "ok"
   curl -s  https://marc-os.com/rss.xml | head -5
   curl -sI https://marc-os.com/post/<some-old-slug>   # → 301
   ```
7. **Headers audit.**
   - https://securityheaders.com/?q=marc-os.com → A or A+
   - https://www.ssllabs.com/ssltest/analyze.html?d=marc-os.com → A+

### Acceptance

- `https://marc-os.com/` returns 200.
- One known old URL redirects (301) to the new path.
- securityheaders.com grade A or A+.
- RSS feed and sitemap accessible.
- The blog container is not directly reachable from the public
  internet (no host ports published).

---

## Phase 12 — Old-stack teardown

**Goal:** Reclaim the old DB volume, old images, and clean up.

🛑 **Do not run this phase until the human confirms the new site has
been live and verified for at least 24 hours.**

### Tasks

1. On the VPS:
   ```bash
   # List all docker volumes
   docker volume ls

   # Identify the old mongo data volume (usually named like
   # marc-os-blog_mongo-data) and back it up before deletion:
   docker run --rm -v <OLD_MONGO_VOLUME>:/data -v "$PWD":/backup \
     alpine tar czf /backup/mongo-final-backup.tar.gz -C /data .

   # Then remove it
   docker volume rm <OLD_MONGO_VOLUME>

   # Prune everything else dangling
   docker system prune -af --volumes
   ```
2. Move `mongo-final-backup.tar.gz` somewhere off the VPS for cold
   storage.

### Acceptance

- `docker volume ls` no longer lists the old mongo volume.
- `docker image ls` only shows the v2 app image (and your other
  services like NPM).
- `docker ps` shows `marc-os-app` healthy alongside NPM and your
  other containers.

---

## Recovery procedures

### "I want to roll back to v1"

```bash
git checkout v1-archive
# Manually restore the old docker-compose.yml and run it.
# DB data is gone unless you restored mongo-final-backup.tar.gz.
```

### "A specific post didn't migrate"

```bash
# Re-extract just that post from the backup
jq '.[] | select(.slug == "the-slug")' migration-backup/posts.json
# Hand-craft the markdown file in src/content/blog/
```

### "CI cosign step is failing"

The cosign step requires `packages: write` and `id-token: write`.
Both are set in the workflow already; if it still fails, the repo
needs **Settings → Actions → General → Workflow permissions: Read
and write permissions** enabled.

### "Caddy won't get a cert"

Not applicable in this setup — TLS is handled by Nginx Proxy
Manager. See the next item.

### "NPM won't issue a cert for marc-os.com"

Most common causes:
- DNS doesn't resolve to the VPS yet. Check with `dig marc-os.com`.
- Cloudflare proxy is on (orange cloud). Turn it off until the cert
  issues, then turn it back on. Or use the DNS-01 challenge if you
  want to keep it proxied.
- Port 80 is blocked by the VPS firewall — NPM needs HTTP-01
  challenge access. Check `sudo ufw status`.
- NPM can't reach `marc-os-app` over the docker network. Verify
  both are on the same network: `docker network inspect <PROXY_NETWORK>`
  should show both `marc-os-app` and the NPM container.

Check NPM's logs from inside its container or from its UI's
**Audit Log** / certificate provisioning page.

### "Old URLs aren't redirecting"

The redirects live in NPM's proxy-host Advanced tab, not in this
repo. Check that the snippet from `docs/npm-redirects-generated.conf`
was actually pasted there and saved. NPM should reload nginx
automatically on save; if not, restart the NPM container.

---

## Done conditions for the whole migration

All of these must be true:

- [ ] v1 code preserved at `v1-archive` tag on origin
- [ ] All v1 posts present in `src/content/blog/` as markdown
- [ ] All v1 projects present in `src/content/projects/`
- [ ] Old URLs redirect (301) to new equivalents
- [ ] `pnpm build` and `docker compose up -d` work locally
- [ ] CI green on `main`, image published to GHCR with cosign signature
- [ ] Live site serves over HTTPS with A/A+ security headers
- [ ] RSS feed renders, sitemap accessible
- [ ] Old mongo volume backed up and removed from VPS
- [ ] 24+ hours uptime on new stack

When every box is checked, the migration is complete.

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
  const title = p.title ?? '(untitled)';
  // No slug field in schema — derive from title
  const slug = slugify(title);
  // excerpt maps to description (cap at 280 chars per schema)
  const description = (p.excerpt ?? '').slice(0, 280);
  const pubDate = new Date(p.createdAt ?? Date.now()).toISOString().slice(0, 10);
  // No tags field in old schema — default empty
  const tags = [];
  // No draft/published field — default published
  const draft = false;
  const body = p.content ?? '';

  if (!title || !body) {
    console.warn(`skip: missing title or body for slug=${slug}`);
    skipped++;
    continue;
  }

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
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
  console.log(`wrote: ${file}`);
  written++;
}

console.log(`\n✓ wrote ${written} posts, skipped ${skipped}`);

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Update this when you point your DNS.
const SITE = process.env.SITE_URL ?? 'https://marc-os.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    format: 'directory',
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Catppuccin Mocha is built into Shiki.
      theme: 'catppuccin-mocha',
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], ariaLabel: 'Permalink' },
          content: { type: 'text', value: ' #' },
        },
      ],
    ],
  },
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        // Pagefind output is generated AFTER `astro build` (see package.json
        // scripts), so the dynamic import must be marked external.
        external: ['/_pagefind/pagefind.js'],
      },
    },
  },
});

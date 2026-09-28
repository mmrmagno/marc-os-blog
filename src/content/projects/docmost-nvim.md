---
title: "docmost.nvim"
description: "A Neovim plugin for my self-hosted Docmost. Browse and search spaces, open any page as Markdown, and save it back with :w."
pubDate: 2026-09-28
tags: ["neovim", "lua", "docmost", "pandoc"]
repo: "https://github.com/mmrmagno/docmost.nvim"
status: "wip"
featured: true
draft: false
---

A Neovim plugin for my self-hosted Docmost. A floating workspace to browse and search, and every page opens as an ordinary Markdown buffer that `:w` saves back.

Docmost stores JSON, not Markdown, so the plugin has its own format on top of Pandoc: callouts, mentions, attachments and comment anchors all survive a save, and a save only counts once the server reads it back.

More in the [blog post](/blog/docmost-nvim-editing-my-docmost-pages-in-neovim).

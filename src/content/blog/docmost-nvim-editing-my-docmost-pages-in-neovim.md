---
title: "docmost.nvim: editing my Docmost pages in Neovim"
description: "A Neovim plugin for my self-hosted Docmost. Every page opens as a Markdown buffer, :w saves it back, and nothing on the page gets lost on the way."
pubDate: 2026-09-28
tags: ["neovim", "lua", "docmost", "pandoc"]
draft: false
---

docmost.nvim is a Neovim plugin for my self-hosted [Docmost](https://docmost.com). I browse my spaces from Neovim, a page opens as a normal Markdown buffer, and `:w` saves it back.

## Why

I have been self-hosting Docmost for a while, and editing in the browser always annoyed me. It got to the point where I wrote pages in Neovim as Markdown and imported them later, whenever I got around to it.

That only works one way. An import creates a new page, so fixing an existing one meant copying it out, editing it, and pasting it back by hand. Now I just open it.

## What it does

`:Docmost` opens a workspace over the editor: spaces and pages as a tree, a preview of the selected page next to it, and search as you type. Enter opens the page in the window I came from.

The page is an ordinary buffer, so motions, macros and undo all work. `:w` saves, and the winbar shows `saving`, `verifying`, then `verified`. Changing the `title:` line at the top renames the page.

It signs in with a normal user session, the same one the browser gets, so it does not need Docmost's enterprise API keys.

## How it works

Docmost does not store Markdown. It stores a JSON document, and its own Markdown export drops everything Markdown cannot say: mentions, comment anchors, attachments, colours, alignment, merged table cells. Writing that export back would quietly delete all of it.

So the plugin has its own format. Plain Markdown where it works, and Pandoc's attribute syntax for everything else:

```markdown
---
title: Release plan
---

Owner [@Marcos]{.mention x-id="u1"}, see [the thread]{.comment commentId="c1"}.

::: {.callout type="warning"}
Freeze on **Friday**.
:::

- [x] Tag release
- [ ] Announce
```

The `{...}` parts are hidden until the cursor is on the line, so a page mostly reads like normal Markdown. Snippets fill in the rest: typing `callout` or `table` gives me something to Tab through.

On `:w`, Pandoc parses the buffer locally and the plugin turns it back into Docmost's JSON. Before sending, it reads the page twice and compares it with the version I opened, so it never overwrites someone else's change. Blocks the plugin has never seen get a generic `:::` form and come back untouched, so every page is editable.

## The parts that were not obvious

- **HTTP 200 does not mean saved.** Docmost applies updates through its collaboration server and writes them to the database later. The response comes back long before that, so a save only counts once two fresh reads return what was sent. A save that cannot be confirmed is never sent twice.
- **Pandoc turns tabs into spaces**, even inside code blocks, unless you pass `--preserve-tabs`. Randomly generated test pages found that one.
- **Some things have no Markdown at all.** A line break at the very end of a paragraph cannot be written, and neither can an empty paragraph. Both got explicit forms, and a lone `\` has to be told apart from an escaped backslash by reading the source, because Pandoc parses both the same.
- **Pandoc's task lists are unreliable** with this set of extensions. Sometimes `- [ ]` becomes a checkbox, sometimes plain text, so the plugin reads the source line itself.
- **Block IDs are invisible but matter.** Headings and paragraphs carry IDs that links point at. They never show up in the buffer. Extmarks follow them while I edit, so rewording, adding and moving blocks all keep the right ones.
- **Headless Neovim segfaults** when a status line redraw is forced after changing `columns`. It crashes inside `update_screen`, so the plugin only forces redraws when a UI is attached.

## Testing it

```sh
python3 tests/run.py
```

Everything runs against a local HTTP and HTTPS mock with made-up credentials, never a real server. That covers sessions, saves and every way they can fail, the page format with golden examples and randomly generated documents, and the workspace itself.

## Current state

Working against the mock:

- [x] Workspace with a tree, search, preview and session state
- [x] Every block type editable, including ones the plugin has never seen
- [x] Verified saves, conflict detection and renaming from the title line
- [x] Snippets and a cheatsheet for the Docmost-specific syntax

Not done yet:

- [ ] Running it against my own instance, on a scratch page first
- [ ] Creating pages, and uploading new images and files
- [ ] Editing while the browser has the page open, which needs Docmost's live collaboration protocol

Source on [GitHub](https://github.com/mmrmagno/docmost.nvim).

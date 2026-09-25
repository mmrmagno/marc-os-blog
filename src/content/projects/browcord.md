---
title: "browcord"
description: "A shared browser inside a Discord voice channel. One Chromium runs on my server, everyone sees the same screen, anyone can drive."
pubDate: 2026-09-25
tags: ["go", "typescript", "discord", "webcodecs", "gstreamer"]
repo: "https://github.com/mmrmagno/browcord"
status: "active"
featured: true
draft: false
---

A shared browser inside a Discord voice channel. One real Chromium runs on my server, its screen streams into the call, and anyone in the room can drive it.

Go gateway, a room container with Chromium and GStreamer encoding VP8 and Opus, and a TypeScript client decoding with WebCodecs inside the Discord iframe.

More in the [blog post](/blog/browcord-a-shared-browser-inside-a-discord-call).

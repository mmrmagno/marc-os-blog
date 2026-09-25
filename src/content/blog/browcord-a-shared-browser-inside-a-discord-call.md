---
title: "browcord: a shared browser inside a Discord call"
description: "One Chromium runs on my server, streams into a Discord voice channel over WebCodecs, and everyone in the room can drive it."
pubDate: 2026-09-25
tags: ["go", "typescript", "discord", "webcodecs", "gstreamer"]
draft: false
---

Screen sharing in Discord is one person sharing and everyone else watching. browcord is the other shape: one real Chromium runs on my server, its screen goes into the voice channel, and anyone in the room can drive it.

## Why

Watching something with friends usually means one person shares their screen, and then that person is stuck. They hold the mouse, they take the requests, and if they leave it ends.

Putting the browser on the server fixes that. The stream comes from the server instead of from anyone's machine, and whoever wants the mouse already has it.

## What it does

It launches from the voice channel as a Discord Activity. Login is Discord OAuth with a guild allow list, so only my servers can open it.

Inside it is a whole browser: mouse, scroll, keyboard, back, forward and a URL bar, all shared. You can see where everyone else is pointing, and a typing token stops two people fighting over the same text box. Any site that works in Chrome works, because it is Chrome.

## How it works

GStreamer captures the X display in the room container, encodes VP8 and Opus, and pushes chunks to the gateway. The gateway fans them out to every viewer and replays a cached keyframe to late joiners, so someone arriving halfway through sees a picture instead of a black screen. Input goes back the other way through the Chrome DevTools Protocol.

```text
Discord client
  └── web client (TypeScript, WebCodecs)
        ├── /ws/media   VP8 + Opus, server to client
        └── /ws/ctl     JSON, both ways
              │
        browcord-gateway    auth, rooms, fan out
              │
        browcord-room       Xvfb + PulseAudio + Chromium + GStreamer
```

The room has no published ports. It dials out to the gateway, never the reverse.

## The parts that were not obvious

- **VP8, not H.264.** Discord's client cannot decode H.264 through WebCodecs. `isConfigSupported()` returns true, then `configure()` fails for every profile. The API says yes right up until it says no.
- **Video and audio need one PTS origin.** Zeroing each stream on its own first buffer looks harmless and silently destroys sync.
- **Never present a frame straight off the decoder.** Frames go through a pace queue, and the one shown is the one nearest the next refresh. Showing the first frame past due measured worse than no pacing at all.
- **`cap_drop: ALL` kills Chromium's own sandbox.** The tempting fix is `--no-sandbox`, which turns any renderer bug into code execution. The real fix is a seccomp profile that lets Chromium build its namespace sandbox unprivileged.
- **Filter egress by IP, not by hostname.** A room runs whatever anyone types into it. A hostname deny list dies to a domain that resolves to a private address on the second lookup, so the rules live in `DOCKER-USER`.
- **A write only websocket still needs a reader.** A keepalive ping froze every viewer for 10 seconds out of every 35. Pongs are consumed inside `Read`, and that socket only ever wrote, so each ping waited out its timeout and killed the connection. One line: `conn.CloseRead(ctx)`.

## Current state

Working and in daily use:

- [x] Video, audio and A/V sync
- [x] Input, navigation and shared cursors
- [x] Discord OAuth with a guild allow list
- [x] Ad blocking and popup cleanup
- [x] Touch on mobile
- [x] Read only containers, all capabilities dropped, egress filter verified from inside a live room

Not done yet:

- [ ] Multi room, which needs a supervisor creating a container per Discord instance
- [ ] Gateway self healing, mostly a detection problem: a Chromium that stops painting still looks healthy from the outside
- [ ] Local input echo, since every click round trips to Germany before anything moves

Source on [GitHub](https://github.com/mmrmagno/browcord).

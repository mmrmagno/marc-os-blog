---
title: "StreamFin: streaming instead of storing in Jellyfin"
description: "A Jellyfin plugin that adds anime, movies and TV as two channels and streams them on demand, so the disk only holds what I want to keep."
pubDate: 2026-10-27
tags: ["jellyfin", "csharp", "self-hosting"]
draft: false
---

StreamFin is a Jellyfin plugin that streams anime, movies and TV instead of storing them. They show up as two channels, **Anime** and **Movies & TV**, and play in Jellyfin's own player on every client, TV included.

## Why

I host my own Jellyfin, but I do not have the storage to keep every movie, show and anime I might want to watch. Most of them I watch once anyway. Downloading something, waiting, and deleting it again to make room got old quickly.

So now the server finds it when I press play. The library on disk is for the things I want to keep, and everything else streams.

## What it does

- **Anime** browses AniList (Popular, This Season, A to Z) and plays from HiAnime, AnimeGG or AnimeHeaven, always Japanese audio with English subtitles.
- **Movies & TV** browses TMDB and plays from FlixHQ.
- Jellyfin's normal search also looks in both catalogs, and progress, resume and subtitles work like they do for the rest of the library.

## How it works

The catalogs and the video are separate. AniList and TMDB give me titles, posters and episode lists, and the sources only have to turn "this episode" into a video URL.

Jellyfin never sees that URL. It gets a loopback address into the plugin, and a small relay fetches the video. HLS playlists are rewritten so every segment points back at the relay, which means FFmpeg only ever talks to localhost, and nothing from the sites is ever run.

## Things I learned on the way

- **The Android TV app checks before it asks.** It opens a season only if the season reports at least one episode, and channel seasons report none until something has opened them. Phones and browsers worked fine; the TV showed a blank screen.
- **One source served a decoy.** AnimeHeaven lists five video links, and the first one is always the same 3.7 second clip. Skipping that host fixed "playback stops after six seconds".
- **Fuzzing pays off quickly.** I fuzz everything that parses a third-party page, and within minutes it found six real bugs, including one that broke encrypted HLS streams completely.

## Install

Add `https://github.com/mmrmagno/jellyfin-plugin-streamfin/releases/latest/download/manifest.json` under **Dashboard > Plugins > Repositories**, install StreamFin from the catalog and tick the users who may use it. Updates then come in like any other plugin.

StreamFin does not host anything. It plays what third-party sites already serve, and whether that is legal where you live is on you.

Source on [GitHub](https://github.com/mmrmagno/jellyfin-plugin-streamfin).

---
title: "mangolib: building a music manager in Go"
description: "A music library manager built in Go. Download from Spotify & YouTube, organize your collection, sync to your iPod."
pubDate: 2026-05-30
tags: ["go", "music", "ytdlp", "rockbox"]
draft: false
---

![logo](https://raw.githubusercontent.com/mmrmagno/mangolib/refs/heads/main/assets/logo.svg)
## Why

Managing a growing music library across multiple sources, devices, and formats gets messy fast. Keeping metadata clean, covers embedded, and everything synced to an iPod is the kind of thing that should just work. Inspired by [podlib](https://github.com/mikeshootzz/podlib), mangolib is my attempt at getting that right.

## What it does

mangolib handles the full lifecycle of a local music library. Spotify downloads use the Spotify Web API for authoritative metadata and then search YouTube for the audio via yt-dlp. YouTube downloads work for single videos or full playlists, with per-track progress bars and automatic title cleaning channel prefixes and noise like `(Official Video)` are stripped on every download.

Files are tagged natively (ID3v2 for MP3, ffmpeg for M4A and FLAC), organized into `Artist/Album/NN. Title.ext`, and synced to the iPod via rsync. The sync is bidirectional `--from-ipod` pulls music back from the device and reorganizes it automatically.

Cover art is fetched from iTunes at 3000×3000 with MusicBrainz as fallback. It gets embedded in the tags and also written as a `cover.jpg` per album folder, since Rockbox reads cover art from the filesystem rather than embedded ID3 tags.

## Get it

v0.1.1 is out. Available on the [AUR](https://aur.archlinux.org/packages/mangolib-bin) as `mangolib-bin`, or via the install script for everyone else.

```bash
# Arch Linux
yay -S mangolib-bin

# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/mmrmagno/mangolib/main/install.sh | bash
```

Source and docs on [GitHub](https://github.com/mmrmagno/mangolib).

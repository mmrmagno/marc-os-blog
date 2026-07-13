---
title: "STSPSVITA: building a Slay the Spire Vita pipeline"
description: "A build pipeline for turning a Slay the Spire PC copy into a PlayStation Vita VPK and optimized asset pack."
pubDate: 2026-07-13
tags: ["vita", "homebrew", "teavm", "slay-the-spire"]
draft: false
---

STSPSVITA is my current attempt at bringing Slay the Spire to the PlayStation Vita.

The shape is simple from the outside: provide `desktop-1.0.jar`, run one build script, install the VPK, and copy the generated assets to the Vita. Under the hood it is a lot less simple.

## Why

Slay the Spire is a Java/libGDX game. The Vita does not have a JVM, and it is not a desktop OpenGL target, so this is not a normal port where you tweak a few paths and recompile.

The build pipeline verifies and extracts the jar, repacks the assets for the Vita, runs TeaVM's C backend over the reachable Java code, swaps the desktop libGDX backend for a Vita backend, then compiles the generated C with VitaSDK.

## What it does

The build flow is intentionally boring:

```sh
mkdir -p game
cp /path/to/SlayTheSpire/desktop-1.0.jar game/

./build.sh
```

The default build produces:

- `build/STSVITA-slim.vpk`
- `work/assets_vita/`

The slim VPK keeps reinstall times reasonable. The asset payload lives separately on the Vita at:

```text
ux0:data/stsvita/assets/
```

There is also a full VPK mode, but the slim path is the one I expect most people to use.

## The pieces

`pipeline/` handles verification, extraction, texture conversion, font pruning, audio options, and LiveArea generation.

`backend/` is the libGDX Vita backend: graphics through vitaGL, controls through SceCtrl/SceTouch, audio through OpenAL, and file IO through Vita paths.

`transpiler/` is the TeaVM harness that turns the game and backend into C.

`native/` is the VitaSDK side: process startup, glue functions, CMake, and VPK packaging.

## Current state

This is pre-alpha. The workflow is now documented and repeatable, but it is still very much a hardware-debugging project.

The goal right now is not a polished end-user release. It is a reproducible build path that can be run, inspected, and improved.

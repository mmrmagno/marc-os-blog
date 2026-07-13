---
title: "STSPSVITA"
description: "Build pipeline for turning a Slay the Spire PC copy into a PlayStation Vita VPK and optimized asset pack."
pubDate: 2026-07-13
tags: ["vita", "homebrew", "teavm", "c"]
repo: "https://github.com/mmrmagno/stspsvita"
status: "wip"
featured: true
draft: false
---

STSPSVITA is a PlayStation Vita porting pipeline for Slay the Spire.

It takes a local `desktop-1.0.jar`, extracts and optimizes the assets, transpiles the Java game code through TeaVM, compiles the generated C with VitaSDK, and packages the result as a VPK.

The interesting parts are the split asset workflow, the Vita libGDX backend, and the TeaVM-to-VitaSDK compilation path.

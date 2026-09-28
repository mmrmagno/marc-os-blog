---
title: "spire"
description: "My homelab Kubernetes cluster. Talos Linux on bare metal, Cilium, an Intel iGPU shared between pods, everything rebuildable from one repo."
pubDate: 2026-09-28
tags: ["kubernetes", "talos", "cilium", "homelab"]
repo: "https://github.com/mmrmagno/spire"
status: "wip"
featured: false
draft: false
---

My homelab Kubernetes cluster, and the repo that rebuilds it from scratch. Talos Linux on an N100 control plane and a Minisforum MS-01 worker, with two more MS-01s planned.

Cilium replaces kube-proxy, the MS-01's iGPU is shared between pods for transcoding, and the only secret in the repo is SOPS encrypted. The self-hosted services on my cloud server are moving here.

More in the [blog post](/blog/spire-a-talos-homelab-kubernetes-cluster).

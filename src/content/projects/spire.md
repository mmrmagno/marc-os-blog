---
title: "spire"
description: "My homelab Kubernetes cluster. Talos Linux on bare metal, Cilium, an Intel iGPU shared between pods, everything rebuildable from one repo."
pubDate: 2026-09-28
tags: ["kubernetes", "talos", "cilium", "homelab"]
repo: "https://github.com/mmrmagno/spire"
status: "active"
featured: true
draft: false
---

My homelab Kubernetes cluster, and the repo that rebuilds it from scratch. Talos Linux on an N100 control plane and two Minisforum MS-01 workers, with two more MS-01s planned. A MikroTik router and a 10G SFP+ switch carry the lab network.

Cilium replaces kube-proxy and announces LoadBalancer IPs to the router over BGP, the MS-01 iGPUs are shared between pods for transcoding, and the only secret in the repo is SOPS encrypted. This blog and browcord already run here, and the rest of the self-hosted services on my cloud server are moving over.

More in the [blog post](/blog/spire-a-talos-homelab-kubernetes-cluster).

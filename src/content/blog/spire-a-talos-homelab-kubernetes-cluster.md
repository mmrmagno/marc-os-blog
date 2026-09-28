---
title: "Spire: a Kubernetes homelab on Talos"
description: "My homelab Kubernetes cluster on Talos Linux. Two nodes for now, no SSH, configs rendered from patches and encrypted secrets, and a live move from Flannel to Cilium."
pubDate: 2026-09-28
tags: ["kubernetes", "talos", "cilium", "homelab"]
draft: false
---

Spire is my homelab Kubernetes cluster. It runs Talos Linux on bare metal, and the [repo](https://github.com/mmrmagno/spire) has everything needed to rebuild it from scratch.

## Why

I wanted to actually learn Kubernetes, not click through a managed cluster. Running it on my own hardware means I own every layer: the OS, the network, storage, backups, and every way they can break.

It is also where my self-hosted services are going to live. Right now they run on a cloud server with Docker Compose, and the plan is to move all of them here.

## The hardware

| Node | Hardware | RAM | Role |
|---|---|---|---|
| `architect` | Intel N100 mini PC | 16 GB | control plane |
| `ironclad` | Minisforum MS-01, i9-13900H | 32 GB | worker, iGPU transcoding |

Two more MS-01s are planned, which is where the `spire 2/4` in the header of this site comes from. A MikroTik router and a 10 GbE switch are on the way too, the switch mostly for Ceph later.

## Talos

Talos has no SSH and no shell. Everything goes through an API, so nothing on the nodes is configured by hand, because it can't be.

That forces a nice shape on the repo. Patches and an encrypted secrets bundle go in, one script renders the machine configs, and `talosctl` applies them:

```sh
scripts/gen-configs.sh all
talosctl apply-config --insecure -n <node-ip> -f talos/generated/<node>.yaml
talosctl bootstrap -n <control-plane-ip>
```

There is one common patch, one per node, and one for the Cilium prerequisites. `gen-configs.sh` runs `talosctl validate` on every config it renders and deletes the output if validation fails, so a broken config never reaches a node.

The rendered configs are never committed. They contain the cluster CA and join tokens, and they are a pure function of the secrets plus the patches, so there is no reason to keep them around.

## Flannel to Cilium, live

The cluster came up with Talos defaults: Flannel as the CNI and kube-proxy. I wanted Cilium instead, replacing kube-proxy entirely, with Hubble for seeing what talks to what. I did the switch on the running cluster.

It is less scary than it sounds. Talos never deletes manifests it already deployed, so removing Flannel from the machine config breaks nothing by itself. Flannel just keeps running.

So the order was:

1. Apply the patch that deletes the Flannel config and disables kube-proxy.
2. Install Cilium with Helm, next to Flannel.
3. Run `talosctl upgrade-k8s --dry-run` to see what it would prune, then run it for real to remove Flannel and kube-proxy.
4. Reboot the worker, then the control plane.

The only real outage is the reboot. Three things still went wrong.

My first draft of the patch disabled the Talos discovery service along with Flannel. That is a mistake: KubePrism needs discovery, and Cilium talks to the API server through KubePrism.

Pods that started before Cilium was ready kept their old Flannel addresses and could not resolve DNS. Deleting them fixed it, they came back with Cilium addresses.

Rebooting `ironclad`, the only worker, left about 76 pods in `NodeShutdown` state. That looks alarming in `kubectl get pods`, but it is harmless. They are just records of pods that were running when the node went down.

## The iGPU

The i9 in the MS-01 has an Intel iGPU, which is good at video transcoding. The Intel GPU device plugin exposes it to Kubernetes as `gpu.intel.com/i915`.

By default one GPU means one pod. I run the plugin with `-shared-dev-num=4`, so up to four pods can claim a share of it at the same time. A pod asks for it like any other resource:

```yaml
resources:
  limits:
    gpu.intel.com/i915: 1
```

## What is next

- **Flux**, so the cluster pulls its state from the repo instead of me running `kubectl`.
- **Traefik**, with Cilium handing out LoadBalancer IPs and cert-manager for TLS.
- **Rook/Ceph** for replicated storage, once every MS-01 has a second NVMe for it.
- **Real backups** before anything stateful moves in.

Source on [GitHub](https://github.com/mmrmagno/spire).
